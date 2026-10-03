import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import Database from 'better-sqlite3';
import express from 'express';
import { authenticate, createAuthRouter, createPasswordHash, requireRole } from './auth.js';
import { createAdminRouter } from './admin.js';
import { initializeDatabase } from './db.js';

const database = new Database(':memory:');
initializeDatabase(database);
const app = express();
app.use(express.json());
app.use('/api/auth', createAuthRouter(database));
app.use('/api/admin', createAdminRouter(database));
app.get(
  '/api/test/recruiter',
  authenticate(database),
  requireRole('recruiter', { requireApproval: true }),
  (_request, response) => response.json({ access: 'granted' }),
);

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  const { hash, salt } = await createPasswordHash('admin-test-password-123');
  database.prepare(`
    INSERT INTO administrators (name, email, password_hash, password_salt, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run('Test Admin', 'admin@example.com', hash, salt, Date.now());
});

after(async () => {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  database.close();
});

async function post(path, body, cookie) {
  return fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

function sessionCookie(response) {
  const cookie = response.headers.get('set-cookie');
  assert.ok(cookie, 'expected the server to set an authentication cookie');
  return cookie.split(';', 1)[0];
}

test('candidate can register, sign in, read session, and sign out', async () => {
  const registration = await post('/api/auth/register', {
    name: 'Casey Candidate',
    email: 'casey@example.com',
    password: 'candidate-password',
    role: 'candidate',
  });
  assert.equal(registration.status, 201);
  const cookie = sessionCookie(registration);
  const { user } = await registration.json();
  assert.equal(user.role, 'candidate');
  assert.equal(user.approved, true);

  const session = await fetch(`${baseUrl}/api/auth/me`, { headers: { Cookie: cookie } });
  assert.equal(session.status, 200);
  assert.equal((await session.json()).user.email, 'casey@example.com');

  const logout = await post('/api/auth/logout', {}, cookie);
  assert.equal(logout.status, 204);
  const expiredSession = await fetch(`${baseUrl}/api/auth/me`, { headers: { Cookie: cookie } });
  assert.equal(expiredSession.status, 401);

  const login = await post('/api/auth/login', {
    email: 'casey@example.com',
    password: 'candidate-password',
  });
  assert.equal(login.status, 200);
});

test('recruiter is kept out of hiring routes until explicitly approved', async () => {
  const registration = await post('/api/auth/register', {
    name: 'Riley Recruiter',
    email: 'riley@example.com',
    password: 'recruiter-password',
    role: 'recruiter',
  });
  assert.equal(registration.status, 201);
  const cookie = sessionCookie(registration);
  const { user } = await registration.json();
  assert.equal(user.approved, false);

  const denied = await fetch(`${baseUrl}/api/test/recruiter`, { headers: { Cookie: cookie } });
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).code, 'recruiter_pending');

  database.prepare("UPDATE users SET approved = 1, recruiter_status = 'approved' WHERE email = ?").run('riley@example.com');
  const allowed = await fetch(`${baseUrl}/api/test/recruiter`, { headers: { Cookie: cookie } });
  assert.equal(allowed.status, 200);
  assert.deepEqual(await allowed.json(), { access: 'granted' });
});

test('admin can review and decide recruiter requests while candidates cannot access the queue', async () => {
  const registration = await post('/api/auth/register', {
    name: 'New Recruiter',
    email: 'new-recruiter@example.com',
    password: 'new-recruiter-password',
    role: 'recruiter',
  });
  const recruiterId = (await registration.json()).user.id;
  const rejectedRegistration = await post('/api/auth/register', {
    name: 'Another Recruiter',
    email: 'rejected-recruiter@example.com',
    password: 'another-recruiter-password',
    role: 'recruiter',
  });
  const rejectedRecruiterId = (await rejectedRegistration.json()).user.id;

  const candidateRegistration = await post('/api/auth/register', {
    name: 'Candidate User',
    email: 'candidate-user@example.com',
    password: 'candidate-user-password',
    role: 'candidate',
  });
  const candidateCookie = sessionCookie(candidateRegistration);
  const denied = await fetch(`${baseUrl}/api/admin/recruiters`, {
    headers: { Cookie: candidateCookie },
  });
  assert.equal(denied.status, 403);

  const adminLogin = await post('/api/auth/login', {
    email: 'admin@example.com',
    password: 'admin-test-password-123',
  });
  assert.equal(adminLogin.status, 200);
  const adminCookie = sessionCookie(adminLogin);
  assert.equal((await adminLogin.json()).user.role, 'admin');

  const queue = await fetch(`${baseUrl}/api/admin/recruiters?status=pending`, {
    headers: { Cookie: adminCookie },
  });
  assert.equal(queue.status, 200);
  assert.ok((await queue.json()).recruiters.some(recruiter => recruiter.id === recruiterId));

  const approval = await fetch(`${baseUrl}/api/admin/recruiters/${recruiterId}`, {
    method: 'PATCH',
    headers: { Cookie: adminCookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'approved' }),
  });
  assert.equal(approval.status, 200);
  assert.equal((await approval.json()).status, 'approved');

  const repeatedDecision = await fetch(`${baseUrl}/api/admin/recruiters/${recruiterId}`, {
    method: 'PATCH',
    headers: { Cookie: adminCookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'rejected' }),
  });
  assert.equal(repeatedDecision.status, 409);

  const rejection = await fetch(`${baseUrl}/api/admin/recruiters/${rejectedRecruiterId}`, {
    method: 'PATCH',
    headers: { Cookie: adminCookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'rejected' }),
  });
  assert.equal(rejection.status, 200);
  assert.equal((await rejection.json()).status, 'rejected');
});

test('invalid registration data and incorrect credentials are rejected', async () => {
  const invalid = await post('/api/auth/register', {
    name: 'A',
    email: 'bad-email',
    password: 'short',
    role: 'admin',
  });
  assert.equal(invalid.status, 400);

  const denied = await post('/api/auth/login', {
    email: 'casey@example.com',
    password: 'incorrect-password',
  });
  assert.equal(denied.status, 401);
});

test('existing account and session databases migrate without losing sessions', () => {
  const legacy = new Database(':memory:');
  legacy.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      role TEXT NOT NULL CHECK (role IN ('candidate', 'recruiter')),
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      approved INTEGER NOT NULL DEFAULT 1 CHECK (approved IN (0, 1)),
      created_at INTEGER NOT NULL
    );
    CREATE TABLE sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    INSERT INTO users (name, email, role, password_hash, password_salt, approved, created_at)
    VALUES ('Existing Recruiter', 'existing@example.com', 'recruiter', 'hash', 'salt', 0, 1);
    INSERT INTO sessions (token_hash, user_id, expires_at, created_at)
    VALUES ('existing-token-hash', 1, 9999999999999, 2);
  `);

  initializeDatabase(legacy);
  const session = legacy.prepare('SELECT * FROM sessions WHERE token_hash = ?').get('existing-token-hash');
  assert.equal(session.user_id, 1);
  assert.equal(session.admin_id, null);
  assert.equal(legacy.prepare('SELECT recruiter_status FROM users WHERE id = 1').get().recruiter_status, 'pending');
  assert.equal(legacy.prepare('PRAGMA foreign_key_check').all().length, 0);
  legacy.close();
});

test('candidate accounts are capped at four active users and sign-out frees a slot', async () => {
  const limitedDatabase = new Database(':memory:');
  initializeDatabase(limitedDatabase);
  const limitedApp = express();
  limitedApp.use(express.json());
  limitedApp.use('/api/auth', createAuthRouter(limitedDatabase, { userCapacity: 4 }));
  const limitedServer = limitedApp.listen(0, '127.0.0.1');
  await new Promise(resolve => limitedServer.once('listening', resolve));
  const limitedUrl = `http://127.0.0.1:${limitedServer.address().port}`;

  try {
    const cookies = [];
    for (let index = 1; index <= 4; index += 1) {
      const response = await fetch(`${limitedUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Candidate ${index}`,
          email: `capacity-${index}@example.com`,
          password: `capacity-test-password-${index}`,
          role: 'candidate',
        }),
      });
      assert.equal(response.status, 201);
      cookies.push(sessionCookie(response));
    }

    const blocked = await fetch(`${limitedUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Candidate Five',
        email: 'capacity-5@example.com',
        password: 'capacity-test-password-5',
        role: 'candidate',
      }),
    });
    assert.equal(blocked.status, 429);
    assert.equal((await blocked.json()).code, 'user_capacity_reached');
    assert.equal(limitedDatabase.prepare('SELECT COUNT(*) AS count FROM users').get().count, 4);

    await fetch(`${limitedUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: cookies[0] },
    });
    const replacement = await fetch(`${limitedUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Candidate Five',
        email: 'capacity-5@example.com',
        password: 'capacity-test-password-5',
        role: 'candidate',
      }),
    });
    assert.equal(replacement.status, 201);
    const replacementCookie = sessionCookie(replacement);

    limitedDatabase.prepare(`
      UPDATE sessions
      SET last_seen_at = ?
      WHERE user_id = (SELECT id FROM users WHERE email = ?)
    `).run(Date.now() - 6 * 60 * 1000, 'capacity-2@example.com');

    const afterIdle = await fetch(`${limitedUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Candidate Six',
        email: 'capacity-6@example.com',
        password: 'capacity-test-password-6',
        role: 'candidate',
      }),
    });
    assert.equal(afterIdle.status, 201);
    const expiredSession = await fetch(`${limitedUrl}/api/auth/me`, {
      headers: { Cookie: cookies[1] },
    });
    assert.equal(expiredSession.status, 401);

    await fetch(`${limitedUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: replacementCookie },
    });
  } finally {
    await new Promise((resolve, reject) => limitedServer.close(error => error ? reject(error) : resolve()));
    limitedDatabase.close();
  }
});
