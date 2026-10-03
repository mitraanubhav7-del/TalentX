import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { Router } from 'express';

const scryptAsync = promisify(scrypt);
const SESSION_COOKIE = 'talentx_session';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const ACTIVE_WINDOW_MS = 5 * 60 * 1000;
const PASSWORD_KEY_LENGTH = 64;

class CapacityError extends Error {
  constructor(capacity) {
    super(`TalentX is at its ${capacity}-user capacity. Please try again when someone signs out or becomes inactive.`);
    this.code = 'user_capacity_reached';
  }
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function cookieValue(request, name) {
  const cookieHeader = request.headers.cookie || '';
  const entry = cookieHeader.split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    approved: Boolean(user.approved),
    recruiterStatus: user.role === 'recruiter' ? user.recruiter_status : undefined,
  };
}

function setSessionCookie(response, token) {
  response.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS,
  });
}

export async function createPasswordHash(password, salt = randomBytes(16).toString('hex')) {
  const derivedKey = await scryptAsync(password, salt, PASSWORD_KEY_LENGTH);
  return { hash: derivedKey.toString('hex'), salt };
}

function createRateLimiter({ limit, windowMs }) {
  const requests = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of requests) {
      if (record.resetAt <= now) requests.delete(key);
    }
  }, windowMs).unref();

  return (request, response, next) => {
    const key = request.ip;
    const now = Date.now();
    let record = requests.get(key);
    if (!record || record.resetAt <= now) {
      record = { count: 0, resetAt: now + windowMs };
      requests.set(key, record);
    }

    record.count += 1;
    if (record.count > limit) {
      response.set('Retry-After', String(Math.ceil((record.resetAt - now) / 1000)));
      return response.status(429).json({ error: 'Too many authentication attempts. Please try again shortly.' });
    }
    next();
  };
}

function occupiesUserSlot(user) {
  return user.role === 'candidate' || (user.role === 'recruiter' && user.recruiter_status === 'approved');
}

async function lockCapacity(client) {
  await client.query('UPDATE capacity_guard SET revision = revision + 1 WHERE id = 1');
}

async function createSession(pool, { userId = null, adminId = null, user = null }, capacity) {
  const client = await pool.connect();
  const now = Date.now();
  try {
    await client.query('BEGIN');
    await lockCapacity(client);
    await client.query('DELETE FROM sessions WHERE expires_at <= $1 OR last_seen_at < $2', [
      now,
      now - ACTIVE_WINDOW_MS,
    ]);

    if (user && occupiesUserSlot(user)) {
      const { rows: [activeResult] } = await client.query(`
        SELECT COUNT(DISTINCT users.id)::INTEGER AS count
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.last_seen_at >= $1
          AND (users.role = 'candidate'
            OR (users.role = 'recruiter' AND users.recruiter_status = 'approved'))
      `, [now - ACTIVE_WINDOW_MS]);
      const { rows: [existing] } = await client.query(`
        SELECT 1
        FROM sessions
        WHERE user_id = $1 AND last_seen_at >= $2
        LIMIT 1
      `, [user.id, now - ACTIVE_WINDOW_MS]);
      if (!existing && Number(activeResult.count) >= capacity) throw new CapacityError(capacity);
    }

    const token = randomBytes(32).toString('base64url');
    await client.query(`
      INSERT INTO sessions (token_hash, user_id, admin_id, expires_at, created_at, last_seen_at)
      VALUES ($1, $2, $3, $4, $5, $5)
    `, [hashToken(token), userId, adminId, now + SESSION_DURATION_MS, now]);
    await client.query('COMMIT');
    return token;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function activateSession(pool, tokenHash, capacity) {
  const client = await pool.connect();
  const now = Date.now();
  try {
    await client.query('BEGIN');
    await lockCapacity(client);
    await client.query('DELETE FROM sessions WHERE expires_at <= $1 OR last_seen_at < $2', [
      now,
      now - ACTIVE_WINDOW_MS,
    ]);
    const { rows: [session] } = await client.query(`
      SELECT
        COALESCE(users.id, administrators.id) AS id,
        COALESCE(users.name, administrators.name) AS name,
        COALESCE(users.email, administrators.email) AS email,
        COALESCE(users.role, 'admin') AS role,
        COALESCE(users.approved, TRUE) AS approved,
        users.recruiter_status
      FROM sessions
      LEFT JOIN users ON users.id = sessions.user_id
      LEFT JOIN administrators ON administrators.id = sessions.admin_id
      WHERE sessions.token_hash = $1 AND sessions.expires_at > $2
    `, [tokenHash, now]);

    if (!session) {
      await client.query('COMMIT');
      return null;
    }

    if (occupiesUserSlot(session)) {
      const { rows: [activeResult] } = await client.query(`
        SELECT COUNT(DISTINCT users.id)::INTEGER AS count
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.last_seen_at >= $1
          AND (users.role = 'candidate'
            OR (users.role = 'recruiter' AND users.recruiter_status = 'approved'))
      `, [now - ACTIVE_WINDOW_MS]);
      const { rows: [existing] } = await client.query(`
        SELECT 1
        FROM sessions
        WHERE user_id = $1 AND last_seen_at >= $2
        LIMIT 1
      `, [session.id, now - ACTIVE_WINDOW_MS]);
      if (!existing && Number(activeResult.count) >= capacity) throw new CapacityError(capacity);
    }

    await client.query('UPDATE sessions SET last_seen_at = $1 WHERE token_hash = $2', [now, tokenHash]);
    await client.query('COMMIT');
    return session;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export function authenticate(database, { userCapacity = Number(process.env.USER_CAPACITY || 4) } = {}) {
  return async (request, response, next) => {
    const token = cookieValue(request, SESSION_COOKIE);
    if (!token) return response.status(401).json({ error: 'Authentication required.' });

    try {
      const session = await activateSession(database, hashToken(token), userCapacity);
      if (!session) return response.status(401).json({ error: 'Session expired. Please sign in again.' });
      request.authUser = publicUser(session);
      next();
    } catch (error) {
      if (error instanceof CapacityError) {
        return response.status(429).json({ error: error.message, code: error.code });
      }
      next(error);
    }
  };
}

export function requireRole(role, { requireApproval = false } = {}) {
  return (request, response, next) => {
    if (!request.authUser || request.authUser.role !== role) {
      return response.status(403).json({ error: 'You do not have access to this area.' });
    }
    if (requireApproval && !request.authUser.approved) {
      const rejected = request.authUser.recruiterStatus === 'rejected';
      return response.status(403).json({
        error: rejected ? 'Recruiter access was rejected.' : 'Recruiter access is awaiting approval.',
        code: rejected ? 'recruiter_rejected' : 'recruiter_pending',
      });
    }
    next();
  };
}

export function createAuthRouter(database, { userCapacity = Number(process.env.USER_CAPACITY || 4) } = {}) {
  const router = Router();
  const authRateLimit = createRateLimiter({ limit: 10, windowMs: 15 * 60 * 1000 });
  if (!Number.isSafeInteger(userCapacity) || userCapacity < 1) {
    throw new Error('USER_CAPACITY must be a positive whole number.');
  }

  router.post('/register', authRateLimit, async (request, response, next) => {
    const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
    const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const password = typeof request.body?.password === 'string' ? request.body.password : '';
    const role = request.body?.role;

    if (name.length < 2 || name.length > 80) {
      return response.status(400).json({ error: 'Name must be between 2 and 80 characters.' });
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response.status(400).json({ error: 'Enter a valid email address.' });
    }
    if (password.length < 10 || password.length > 128) {
      return response.status(400).json({ error: 'Password must be between 10 and 128 characters.' });
    }
    if (role !== 'candidate' && role !== 'recruiter') {
      return response.status(400).json({ error: 'Choose Candidate or Recruiter as your account type.' });
    }

    const client = await database.connect();
    try {
      await client.query('BEGIN');
      await lockCapacity(client);
      const { rows: [duplicate] } = await client.query(`
        SELECT email FROM users WHERE email = $1
        UNION ALL
        SELECT email FROM administrators WHERE email = $1
        LIMIT 1
      `, [email]);
      if (duplicate) {
        await client.query('ROLLBACK');
        return response.status(409).json({ error: 'An account with this email already exists.' });
      }

      const { hash, salt } = await createPasswordHash(password);
      const createdAt = Date.now();
      const status = role === 'recruiter' ? 'pending' : 'approved';
      const approved = role === 'candidate';
      const { rows: [user] } = await client.query(`
        INSERT INTO users (name, email, role, password_hash, password_salt, approved, recruiter_status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, email, role, approved, recruiter_status
      `, [name, email, role, hash, salt, approved, status, createdAt]);

      if (occupiesUserSlot(user)) {
        const { rows: [activeResult] } = await client.query(`
          SELECT COUNT(DISTINCT users.id)::INTEGER AS count
          FROM sessions
          JOIN users ON users.id = sessions.user_id
          WHERE sessions.last_seen_at >= $1
            AND (users.role = 'candidate'
              OR (users.role = 'recruiter' AND users.recruiter_status = 'approved'))
        `, [createdAt - ACTIVE_WINDOW_MS]);
        if (Number(activeResult.count) >= userCapacity) throw new CapacityError(userCapacity);
      }

      const token = randomBytes(32).toString('base64url');
      await client.query(`
        INSERT INTO sessions (token_hash, user_id, admin_id, expires_at, created_at, last_seen_at)
        VALUES ($1, $2, NULL, $3, $4, $4)
      `, [hashToken(token), user.id, createdAt + SESSION_DURATION_MS, createdAt]);
      await client.query('COMMIT');
      setSessionCookie(response, token);
      response.status(201).json({ user: publicUser(user) });
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof CapacityError) {
        return response.status(429).json({ error: error.message, code: error.code });
      }
      if (error.code === '23505') {
        return response.status(409).json({ error: 'An account with this email already exists.' });
      }
      next(error);
    } finally {
      client.release();
    }
  });

  router.post('/login', authRateLimit, async (request, response, next) => {
    const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const password = typeof request.body?.password === 'string' ? request.body.password : '';

    try {
      const { rows: [user] } = await database.query('SELECT * FROM users WHERE email = $1', [email]);
      const { rows: [admin] } = user
        ? { rows: [] }
        : await database.query('SELECT * FROM administrators WHERE email = $1', [email]);
      const account = user || admin;
      if (!account || password.length > 128) {
        return response.status(401).json({ error: 'Email or password is incorrect.' });
      }

      const { hash } = await createPasswordHash(password, account.password_salt);
      const expected = Buffer.from(account.password_hash, 'hex');
      const actual = Buffer.from(hash, 'hex');
      if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
        return response.status(401).json({ error: 'Email or password is incorrect.' });
      }

      const isAdmin = Boolean(admin);
      const loginUser = isAdmin
        ? { ...admin, role: 'admin', approved: true, recruiter_status: null }
        : user;
      const token = await createSession(database, {
        userId: user?.id ?? null,
        adminId: admin?.id ?? null,
        user: isAdmin ? null : user,
      }, userCapacity);
      setSessionCookie(response, token);
      response.json({ user: publicUser(loginUser) });
    } catch (error) {
      if (error instanceof CapacityError) {
        return response.status(429).json({ error: error.message, code: error.code });
      }
      next(error);
    }
  });

  router.get('/me', authenticate(database, { userCapacity }), (request, response) => {
    response.json({ user: request.authUser });
  });

  router.post('/activity', authenticate(database, { userCapacity }), (_request, response) => {
    response.status(204).end();
  });

  router.post('/logout', async (request, response, next) => {
    const token = cookieValue(request, SESSION_COOKIE);
    try {
      if (token) await database.query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);
      response.clearCookie(SESSION_COOKIE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
