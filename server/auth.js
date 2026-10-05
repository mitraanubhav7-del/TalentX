import { createHash, createHmac, randomBytes, randomInt, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { Router } from 'express';
import { sendVerificationCode } from './email.js';

const scryptAsync = promisify(scrypt);
const SESSION_COOKIE = 'talentx_session';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const ACTIVE_WINDOW_MS = 5 * 60 * 1000;
const PASSWORD_KEY_LENGTH = 64;
const OTP_LIFETIME_MS = 10 * 60 * 1000;
const OTP_RESEND_WAIT_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

class CapacityError extends Error {
  constructor(capacity) {
    super(`TalentX is at its ${capacity}-user capacity. Please try again when someone signs out or becomes inactive.`);
    this.code = 'user_capacity_reached';
  }
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function hashOtp(email, purpose, code, secret) {
  return createHmac('sha256', secret).update(`${email}:${purpose}:${code}`).digest();
}

function matchesOtp(email, purpose, code, storedHash, secret) {
  const expected = Buffer.from(storedHash, 'hex');
  const actual = hashOtp(email, purpose, code, secret);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

async function issueEmailChallenge(database, {
  email, purpose, name = null, role = null, passwordHash = null, passwordSalt = null,
}, sendOtp, otpSecret) {
  const now = Date.now();
  const code = String(randomInt(100000, 1000000));
  const codeHash = hashOtp(email, purpose, code, otpSecret).toString('hex');
  const client = await database.connect();
  try {
    await client.query('BEGIN');
    await lockCapacity(client);
    const { rows: [existing] } = await client.query(`
      SELECT created_at FROM email_challenges
      WHERE email = $1 AND purpose = $2 FOR UPDATE
    `, [email, purpose]);
    if (existing && now - Number(existing.created_at) < OTP_RESEND_WAIT_MS) {
      const error = new Error('Please wait a minute before requesting another code.');
      error.code = 'otp_resend_wait';
      throw error;
    }
    await client.query(`
      INSERT INTO email_challenges (
        email, purpose, code_hash, name, role, password_hash, password_salt,
        expires_at, created_at, attempts
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0)
      ON CONFLICT (email, purpose) DO UPDATE SET
        code_hash = EXCLUDED.code_hash,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        password_hash = EXCLUDED.password_hash,
        password_salt = EXCLUDED.password_salt,
        expires_at = EXCLUDED.expires_at,
        created_at = EXCLUDED.created_at,
        attempts = 0
    `, [email, purpose, codeHash, name, role, passwordHash, passwordSalt, now + OTP_LIFETIME_MS, now]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  try {
    await sendOtp({ email, code, purpose });
  } catch (error) {
    await database.query(`
      DELETE FROM email_challenges
      WHERE email = $1 AND purpose = $2 AND created_at = $3
    `, [email, purpose, now]);
    throw error;
  }
}

async function checkEmailChallenge(client, { email, purpose, code, otpSecret }) {
  const { rows: [challenge] } = await client.query(`
    SELECT * FROM email_challenges
    WHERE email = $1 AND purpose = $2 FOR UPDATE
  `, [email, purpose]);
  if (!challenge) {
    await client.query('COMMIT');
    return { error: 'That code is invalid or expired.' };
  }
  if (Number(challenge.expires_at) <= Date.now()) {
    await client.query('DELETE FROM email_challenges WHERE email = $1 AND purpose = $2', [email, purpose]);
    await client.query('COMMIT');
    return { error: 'That code is invalid or expired.' };
  }
  if (Number(challenge.attempts) >= OTP_MAX_ATTEMPTS) {
    await client.query('COMMIT');
    return { error: 'Too many incorrect codes. Request a new code.' };
  }
  if (!matchesOtp(email, purpose, code, challenge.code_hash, otpSecret)) {
    await client.query(`
      UPDATE email_challenges SET attempts = attempts + 1
      WHERE email = $1 AND purpose = $2
    `, [email, purpose]);
    await client.query('COMMIT');
    return { error: 'That code is invalid or expired.' };
  }
  return { challenge };
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
    profile: user.profile_data || {},
  };
}

function validateProfile(profile) {
  const optionalText = (value, maxLength) => (
    value === undefined || value === null || value === '' || (typeof value === 'string' && value.trim().length <= maxLength)
  );
  const requiredText = (value, maxLength) => (
    typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength
  );
  const optionalUrl = value => {
    if (!value || (typeof value === 'string' && value.trim() === '')) return true;
    if (typeof value !== 'string' || value.trim().length > 1_500) return false;
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
      return false;
    }
  };
  const optionalImage = value => (
    !value || (typeof value === 'string'
      && value.length <= 1_500_000
      && /^data:image\/(?:jpeg|png|webp);base64,[\w+/]+=*$/.test(value))
  );
  const validOptionalEntries = (entries, maxCount) => (
    entries === undefined || entries === null || (
      Array.isArray(entries)
      && entries.length <= maxCount
      && entries.every(entry => entry && typeof entry === 'object')
    )
  );

  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) return false;
  if (!optionalImage(profile.avatar) || !optionalImage(profile.banner)) return false;
  if (!requiredText(profile.title || profile.targetRole || profile.name, 120)) return false;
  if (!optionalText(profile.location, 120)
    || !optionalText(profile.university, 160)
    || !optionalText(profile.targetRole, 120)
    || !optionalText(profile.about, 2_000)) return false;
  if (profile.socialLinks && typeof profile.socialLinks === 'object') {
    if (!['github', 'linkedin', 'portfolio'].every(key => optionalUrl(profile.socialLinks[key]))) return false;
  }
  if (!validOptionalEntries(profile.skills, 50)) return false;
  if (!validOptionalEntries(profile.experience, 20)) return false;
  if (!validOptionalEntries(profile.education, 20)) return false;
  if (!validOptionalEntries(profile.projects, 20)) return false;
  if (!validOptionalEntries(profile.certifications, 30)) return false;
  return true;
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
        users.recruiter_status,
        users.profile_data
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

export function authenticate(database, { userCapacity = Number(process.env.USER_CAPACITY || 50) } = {}) {
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

export function createAuthRouter(database, {
  userCapacity = Number(process.env.USER_CAPACITY || 50),
  otpSecret = process.env.EMAIL_OTP_SECRET ||
    (process.env.NODE_ENV === 'production' ? undefined : 'talentx-local-development-otp-secret'),
  sendOtp = sendVerificationCode,
} = {}) {
  const router = Router();
  const authRateLimit = createRateLimiter({ limit: 30, windowMs: 15 * 60 * 1000 });
  const otpDeliveryAvailable = typeof otpSecret === 'string' && otpSecret.length >= 32 &&
    (sendOtp !== sendVerificationCode || (process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL));
  if (!Number.isSafeInteger(userCapacity) || userCapacity < 1) {
    throw new Error('USER_CAPACITY must be a positive whole number.');
  }

  router.post('/register', authRateLimit, async (request, response, next) => {
    if (!otpDeliveryAvailable) {
      return response.status(503).json({ error: 'Email verification is not configured yet. Please contact the TalentX administrator.' });
    }
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

    try {
      const { rows: [duplicate] } = await database.query(`
        SELECT email FROM users WHERE email = $1
        UNION ALL
        SELECT email FROM administrators WHERE email = $1
        LIMIT 1
      `, [email]);
      if (duplicate) {
        return response.status(409).json({ error: 'An account with this email already exists.' });
      }

      const { hash, salt } = await createPasswordHash(password);
      await issueEmailChallenge(database, {
        email,
        purpose: 'signup',
        name,
        role,
        passwordHash: hash,
        passwordSalt: salt,
      }, sendOtp, otpSecret);
      response.status(202).json({ message: 'A verification code was sent to your email address.' });
    } catch (error) {
      if (error.code === 'otp_resend_wait') {
        return response.status(429).json({ error: error.message, code: error.code });
      }
      next(error);
    }
  });

  router.post('/register/verify', authRateLimit, async (request, response, next) => {
    if (!otpDeliveryAvailable) {
      return response.status(503).json({ error: 'Email verification is not configured yet. Please contact the TalentX administrator.' });
    }
    const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const code = typeof request.body?.code === 'string' ? request.body.code.trim() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code)) {
      return response.status(400).json({ error: 'Enter a valid email address and six-digit code.' });
    }

    const client = await database.connect();
    try {
      await client.query('BEGIN');
      await lockCapacity(client);
      const result = await checkEmailChallenge(client, { email, purpose: 'signup', code, otpSecret });
      if (!result.challenge) return response.status(400).json({ error: result.error });
      const { challenge } = result;
      const { rows: [duplicate] } = await client.query(`
        SELECT email FROM users WHERE email = $1
        UNION ALL
        SELECT email FROM administrators WHERE email = $1
        LIMIT 1
      `, [email]);
      if (duplicate) {
        await client.query('DELETE FROM email_challenges WHERE email = $1 AND purpose = $2', [email, 'signup']);
        await client.query('COMMIT');
        return response.status(409).json({ error: 'An account with this email already exists.' });
      }

      const createdAt = Date.now();
      const approved = challenge.role === 'candidate';
      const recruiterStatus = challenge.role === 'recruiter' ? 'pending' : 'approved';
      const { rows: [user] } = await client.query(`
        INSERT INTO users (name, email, role, password_hash, password_salt, approved, recruiter_status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, email, role, approved, recruiter_status
      `, [challenge.name, email, challenge.role, challenge.password_hash, challenge.password_salt,
        approved, recruiterStatus, createdAt]);

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
      await client.query('DELETE FROM email_challenges WHERE email = $1 AND purpose = $2', [email, 'signup']);
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

  router.post('/password/forgot', authRateLimit, async (request, response, next) => {
    if (!otpDeliveryAvailable) {
      return response.status(503).json({ error: 'Password reset email is not configured yet. Please contact the TalentX administrator.' });
    }
    const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response.status(400).json({ error: 'Enter a valid email address.' });
    }

    try {
      const { rows: [account] } = await database.query(`
        SELECT email FROM users WHERE email = $1
        UNION ALL
        SELECT email FROM administrators WHERE email = $1
        LIMIT 1
      `, [email]);
      if (account) {
        try {
          await issueEmailChallenge(database, { email, purpose: 'password_reset' }, sendOtp, otpSecret);
        } catch (error) {
          if (error.code !== 'otp_resend_wait') throw error;
        }
      }
      response.json({ message: 'If an account exists for that email, a password reset code has been sent.' });
    } catch (error) {
      next(error);
    }
  });

  router.post('/password/reset', authRateLimit, async (request, response, next) => {
    if (!otpDeliveryAvailable) {
      return response.status(503).json({ error: 'Password reset email is not configured yet. Please contact the TalentX administrator.' });
    }
    const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const code = typeof request.body?.code === 'string' ? request.body.code.trim() : '';
    const password = typeof request.body?.password === 'string' ? request.body.password : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code)) {
      return response.status(400).json({ error: 'Enter a valid email address and six-digit code.' });
    }
    if (password.length < 10 || password.length > 128) {
      return response.status(400).json({ error: 'Password must be between 10 and 128 characters.' });
    }

    const client = await database.connect();
    try {
      const { hash, salt } = await createPasswordHash(password);
      await client.query('BEGIN');
      const result = await checkEmailChallenge(client, {
        email, purpose: 'password_reset', code, otpSecret,
      });
      if (!result.challenge) return response.status(400).json({ error: result.error });

      const { rows: [user] } = await client.query(`
        UPDATE users SET password_hash = $1, password_salt = $2
        WHERE email = $3
        RETURNING id
      `, [hash, salt, email]);
      const { rows: [admin] } = user ? { rows: [] } : await client.query(`
        UPDATE administrators SET password_hash = $1, password_salt = $2
        WHERE email = $3
        RETURNING id
      `, [hash, salt, email]);
      if (!user && !admin) {
        await client.query('DELETE FROM email_challenges WHERE email = $1 AND purpose = $2', [
          email, 'password_reset',
        ]);
        await client.query('COMMIT');
        return response.status(400).json({ error: 'That code is invalid or expired.' });
      }
      if (user) {
        await client.query('DELETE FROM sessions WHERE user_id = $1', [user.id]);
      } else {
        await client.query('DELETE FROM sessions WHERE admin_id = $1', [admin.id]);
      }
      await client.query('DELETE FROM email_challenges WHERE email = $1 AND purpose = $2', [
        email, 'password_reset',
      ]);
      await client.query('COMMIT');
      response.json({ message: 'Password reset. You can now sign in with your new password.' });
    } catch (error) {
      await client.query('ROLLBACK');
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

  router.patch('/profile', authenticate(database, { userCapacity }), async (request, response, next) => {
    if (!['candidate', 'recruiter'].includes(request.authUser.role)) {
      return response.status(403).json({ error: 'This account cannot update a member profile.' });
    }
    if (request.authUser.role === 'recruiter' && !request.authUser.approved) {
      return response.status(403).json({ error: 'Recruiter approval is required before updating a profile.' });
    }
    if (!validateProfile(request.body?.profile)) {
      return response.status(400).json({
        error: 'Complete every profile section with valid details, links, and profile images before saving.',
      });
    }

    try {
      const { rows: [user] } = await database.query(`
        UPDATE users SET profile_data = $1::jsonb
        WHERE id = $2
        RETURNING profile_data
      `, [JSON.stringify(request.body.profile), request.authUser.id]);
      response.json({ profile: user.profile_data });
    } catch (error) {
      next(error);
    }
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
