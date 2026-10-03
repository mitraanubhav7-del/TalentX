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

function activateSession(database, tokenHash, capacity) {
  const now = Date.now();
  return database.transaction(() => {
    database.prepare('DELETE FROM sessions WHERE expires_at <= ? OR last_seen_at < ?')
      .run(now, now - ACTIVE_WINDOW_MS);
    const session = database.prepare(`
      SELECT
        COALESCE(users.id, administrators.id) AS id,
        COALESCE(users.name, administrators.name) AS name,
        COALESCE(users.email, administrators.email) AS email,
        COALESCE(users.role, 'admin') AS role,
        COALESCE(users.approved, 1) AS approved,
        users.recruiter_status
      FROM sessions
      LEFT JOIN users ON users.id = sessions.user_id
      LEFT JOIN administrators ON administrators.id = sessions.admin_id
      WHERE sessions.token_hash = ? AND sessions.expires_at > ?
    `).get(tokenHash, now);

    if (!session) return null;

    if (occupiesUserSlot(session)) {
      const activeUsers = database.prepare(`
        SELECT COUNT(DISTINCT users.id) AS count
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.last_seen_at >= ?
          AND (users.role = 'candidate'
            OR (users.role = 'recruiter' AND users.recruiter_status = 'approved'))
      `).get(now - ACTIVE_WINDOW_MS).count;

      const alreadyActive = database.prepare(`
        SELECT 1
        FROM sessions
        WHERE user_id = ? AND last_seen_at >= ?
        LIMIT 1
      `).get(session.id, now - ACTIVE_WINDOW_MS);
      if (!alreadyActive && activeUsers >= capacity) throw new CapacityError(capacity);
    }

    database.prepare('UPDATE sessions SET last_seen_at = ? WHERE token_hash = ?').run(now, tokenHash);
    return session;
  }).immediate();
}

function createSession(database, insertSession, { userId = null, adminId = null, user = null }, capacity) {
  const now = Date.now();
  return database.transaction(() => {
    database.prepare('DELETE FROM sessions WHERE expires_at <= ? OR last_seen_at < ?')
      .run(now, now - ACTIVE_WINDOW_MS);

    if (user && occupiesUserSlot(user)) {
      const activeUsers = database.prepare(`
        SELECT COUNT(DISTINCT users.id) AS count
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.last_seen_at >= ?
          AND (users.role = 'candidate'
            OR (users.role = 'recruiter' AND users.recruiter_status = 'approved'))
      `).get(now - ACTIVE_WINDOW_MS).count;
      const alreadyActive = database.prepare(`
        SELECT 1 FROM sessions WHERE user_id = ? AND last_seen_at >= ? LIMIT 1
      `).get(user.id, now - ACTIVE_WINDOW_MS);
      if (!alreadyActive && activeUsers >= capacity) throw new CapacityError(capacity);
    }

    const token = randomBytes(32).toString('base64url');
    insertSession.run(hashToken(token), userId, adminId, now + SESSION_DURATION_MS, now, now);
    return token;
  }).immediate();
}

export function authenticate(database, { userCapacity = Number(process.env.USER_CAPACITY || 4) } = {}) {
  return (request, response, next) => {
    const token = cookieValue(request, SESSION_COOKIE);
    if (!token) return response.status(401).json({ error: 'Authentication required.' });

    try {
      const session = activateSession(database, hashToken(token), userCapacity);
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

  const findUserByEmail = database.prepare(`
    SELECT users.*, users.recruiter_status FROM users WHERE email = ?
  `);
  const findAdminByEmail = database.prepare('SELECT * FROM administrators WHERE email = ?');
  const insertUser = database.prepare(`
    INSERT INTO users (name, email, role, password_hash, password_salt, approved, recruiter_status, created_at)
    VALUES (@name, @email, @role, @password_hash, @password_salt, @approved, @recruiter_status, @created_at)
  `);
  const insertSession = database.prepare(`
    INSERT INTO sessions (token_hash, user_id, admin_id, expires_at, created_at, last_seen_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

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
    if (findUserByEmail.get(email) || findAdminByEmail.get(email)) {
      return response.status(409).json({ error: 'An account with this email already exists.' });
    }

    try {
      const { hash, salt } = await createPasswordHash(password);
      const createdAt = Date.now();
      const registration = database.transaction(() => {
        const result = insertUser.run({
          name,
          email,
          role,
          password_hash: hash,
          password_salt: salt,
          approved: role === 'candidate' ? 1 : 0,
          recruiter_status: role === 'recruiter' ? 'pending' : 'approved',
          created_at: createdAt,
        });
        const user = database.prepare(`
          SELECT id, name, email, role, approved, recruiter_status FROM users WHERE id = ?
        `).get(result.lastInsertRowid);
        const token = createSession(database, insertSession, { userId: user.id, user }, userCapacity);
        return { user, token };
      }).immediate();
      const { user, token } = registration;
      setSessionCookie(response, token);
      response.status(201).json({ user: publicUser(user) });
    } catch (error) {
      if (error instanceof CapacityError) {
        return response.status(429).json({ error: error.message, code: error.code });
      }
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return response.status(409).json({ error: 'An account with this email already exists.' });
      }
      next(error);
    }
  });

  router.post('/login', authRateLimit, async (request, response, next) => {
    const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const password = typeof request.body?.password === 'string' ? request.body.password : '';
    const user = findUserByEmail.get(email);
    const admin = user ? null : findAdminByEmail.get(email);
    const account = user || admin;

    if (!account || password.length > 128) {
      return response.status(401).json({ error: 'Email or password is incorrect.' });
    }

    try {
      const { hash } = await createPasswordHash(password, account.password_salt);
      const expected = Buffer.from(account.password_hash, 'hex');
      const actual = Buffer.from(hash, 'hex');
      if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
        return response.status(401).json({ error: 'Email or password is incorrect.' });
      }

      const token = createSession(database, insertSession, {
        userId: user?.id ?? null,
        adminId: admin?.id ?? null,
        user,
      }, userCapacity);
      setSessionCookie(response, token);
      response.json({
        user: publicUser(user || {
          ...admin,
          role: 'admin',
          approved: 1,
          recruiter_status: null,
        }),
      });
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

  router.post('/logout', (request, response) => {
    const token = cookieValue(request, SESSION_COOKIE);
    if (token) database.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
    response.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    response.status(204).end();
  });

  return router;
}
