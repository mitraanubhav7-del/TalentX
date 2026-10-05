import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { DataType, newDb } from 'pg-mem';
import express from 'express';
import { authenticate, createAuthRouter, createPasswordHash, requireRole } from './auth.js';
import { createAdminRouter } from './admin.js';
import { initializeDatabase } from './db.js';
import { provisionAdmin } from './provision-admin.js';

function createMemoryDb() {
  const memory = newDb();
  memory.public.registerFunction({
    name: 'char_length',
    args: [DataType.text],
    returns: DataType.integer,
    implementation: value => [...value].length,
  });
  return memory;
}

const memory = createMemoryDb();
const Pool = memory.adapters.createPg().Pool;
const database = new Pool();
const otpCodes = new Map();
const testOtpSecret = 'test-only-otp-hmac-secret-at-least-32-chars';
const app = express();
app.use(express.json());
app.use('/api/auth', createAuthRouter(database, {
  userCapacity: 10,
  otpSecret: testOtpSecret,
  sendOtp: async ({ email, code, purpose }) => otpCodes.set(`${purpose}:${email}`, code),
}));
app.use('/api/admin', createAdminRouter(database, { userCapacity: 10 }));
app.get(
  '/api/test/recruiter',
  authenticate(database),
  requireRole('recruiter', { requireApproval: true }),
  (_request, response) => response.json({ access: 'granted' }),
);

let server;
let baseUrl;

before(async () => {
  await initializeDatabase(database);
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  const { hash, salt } = await createPasswordHash('admin-test-password-123');
  await database.query(`
    INSERT INTO administrators (name, email, password_hash, password_salt, created_at)
    VALUES ($1, $2, $3, $4, $5)
  `, ['Test Admin', 'admin@example.com', hash, salt, Date.now()]);
});

after(async () => {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  await database.end();
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

async function postTo(url, path, body, cookie) {
  return fetch(`${url}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

async function registerAndVerify(url, details, codes = otpCodes) {
  const registration = await postTo(url, '/api/auth/register', details);
  if (registration.status !== 202) return registration;
  return postTo(url, '/api/auth/register/verify', {
    email: details.email,
    code: codes.get(`signup:${details.email.toLowerCase()}`),
  });
}

function sessionCookie(response) {
  const cookie = response.headers.get('set-cookie');
  assert.ok(cookie, 'expected the server to set an authentication cookie');
  return cookie.split(';', 1)[0];
}

test('candidate can register, sign in, read session, and sign out', async () => {
  const registrationRequest = await post('/api/auth/register', {
    name: 'Casey Candidate',
    email: 'casey@example.com',
    password: 'candidate-password',
    role: 'candidate',
  });
  assert.equal(registrationRequest.status, 202);
  const { rows: [beforeVerification] } = await database.query(
    'SELECT COUNT(*)::INTEGER AS count FROM users WHERE email = $1',
    ['casey@example.com'],
  );
  assert.equal(Number(beforeVerification.count), 0);
  const registration = await post('/api/auth/register/verify', {
    email: 'casey@example.com',
    code: otpCodes.get('signup:casey@example.com'),
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
  const registration = await registerAndVerify(baseUrl, {
    name: 'Riley Recruiter',
    email: 'riley@example.com',
    password: 'recruiter-password',
    role: 'recruiter',
  });
  assert.equal(registration.status, 201);
  const cookie = sessionCookie(registration);
  const { user } = await registration.json();
  assert.equal(user.approved, false);

  const pendingProfileUpdate = await fetch(`${baseUrl}/api/auth/profile`, {
    method: 'PATCH',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile: {} }),
  });
  assert.equal(pendingProfileUpdate.status, 403);

  const denied = await fetch(`${baseUrl}/api/test/recruiter`, { headers: { Cookie: cookie } });
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).code, 'recruiter_pending');

  await database.query(`
    UPDATE users SET approved = TRUE, recruiter_status = 'approved' WHERE email = $1
  `, ['riley@example.com']);
  const allowed = await fetch(`${baseUrl}/api/test/recruiter`, { headers: { Cookie: cookie } });
  assert.equal(allowed.status, 200);
  assert.deepEqual(await allowed.json(), { access: 'granted' });

  const profile = {
    avatar: 'data:image/jpeg;base64,/9j/',
    banner: 'data:image/jpeg;base64,/9j/',
    title: 'Senior technical recruiter',
    location: 'Bengaluru, India',
    university: 'Example University',
    targetRole: 'Talent acquisition',
    about: 'I connect engineering teams with people who love solving hard problems.',
    socialLinks: {
      github: 'https://github.com/riley-recruiter',
      linkedin: 'https://linkedin.com/in/riley-recruiter',
      portfolio: 'https://riley-recruiter.example.com',
    },
    skills: [{ name: 'Technical recruiting', level: 'Advanced' }],
    experience: [{
      role: 'Technical recruiter',
      company: 'Example Co',
      period: '2023 – 2025',
      description: 'Built engineering hiring pipelines.',
      skillsUsed: ['Talent sourcing'],
    }],
    education: [{
      degree: 'B.A.',
      institution: 'Example University',
      period: '2018 – 2022',
      grade: '3.8 GPA',
      highlights: 'Organizational psychology.',
    }],
    projects: [{
      title: 'Engineering hiring playbook',
      description: 'A structured hiring and interview guide.',
      techStack: ['Hiring'],
      github: 'https://github.com/riley-recruiter/playbook',
      demo: 'https://playbook.example.com',
    }],
    certifications: [{
      title: 'Recruiting foundations',
      issuer: 'Example Academy',
      date: '2024',
      credentialUrl: 'https://example.com/recruiting-certificate',
    }],
  };
  const profileUpdate = await fetch(`${baseUrl}/api/auth/profile`, {
    method: 'PATCH',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile }),
  });
  assert.equal(profileUpdate.status, 200);
  assert.deepEqual((await profileUpdate.json()).profile, profile);
});

test('candidate profile completion is validated and persisted in the session', async () => {
  const registration = await registerAndVerify(baseUrl, {
    name: 'Profile Candidate',
    email: 'profile-candidate@example.com',
    password: 'profile-candidate-password',
    role: 'candidate',
  });
  const cookie = sessionCookie(registration);

  const incomplete = await fetch(`${baseUrl}/api/auth/profile`, {
    method: 'PATCH',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile: {} }),
  });
  assert.equal(incomplete.status, 400);

  const profile = {
    avatar: 'data:image/jpeg;base64,/9j/',
    banner: 'data:image/jpeg;base64,/9j/',
    title: 'Software engineer',
    location: 'Bengaluru, India',
    university: 'Example University',
    targetRole: 'Frontend engineer',
    about: 'I build accessible products and enjoy working with small teams.',
    socialLinks: {
      github: 'https://github.com/profile-candidate',
      linkedin: 'https://linkedin.com/in/profile-candidate',
      portfolio: 'https://profile-candidate.dev',
    },
    skills: [{ name: 'React', level: 'Intermediate' }],
    experience: [{
      role: 'Developer',
      company: 'Example Co',
      period: '2024 – 2025',
      description: 'Built customer-facing web applications.',
      skillsUsed: ['React'],
    }],
    education: [{
      degree: 'B.Tech',
      institution: 'Example University',
      period: '2021 – 2025',
      grade: '8.5 CGPA',
      highlights: 'Computer science and engineering.',
    }],
    projects: [{
      title: 'Talent app',
      description: 'A project portfolio.',
      techStack: ['React'],
      github: 'https://github.com/profile-candidate/talent-app',
      demo: 'https://talent-app.example.com',
    }],
    certifications: [{
      title: 'Web development',
      issuer: 'Example Academy',
      date: '2025',
      credentialUrl: 'https://example.com/certificate',
    }],
  };
  const saved = await fetch(`${baseUrl}/api/auth/profile`, {
    method: 'PATCH',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile }),
  });
  assert.equal(saved.status, 200);
  assert.deepEqual((await saved.json()).profile, profile);

  const session = await fetch(`${baseUrl}/api/auth/me`, { headers: { Cookie: cookie } });
  assert.deepEqual((await session.json()).user.profile, profile);
});

test('admin can review and decide recruiter requests while candidates cannot access the queue', async () => {
  const registration = await registerAndVerify(baseUrl, {
    name: 'New Recruiter',
    email: 'new-recruiter@example.com',
    password: 'new-recruiter-password',
    role: 'recruiter',
  });
  const recruiterId = (await registration.json()).user.id;
  const rejectedRegistration = await registerAndVerify(baseUrl, {
    name: 'Another Recruiter',
    email: 'rejected-recruiter@example.com',
    password: 'another-recruiter-password',
    role: 'recruiter',
  });
  const rejectedRecruiterId = (await rejectedRegistration.json()).user.id;

  const candidateRegistration = await registerAndVerify(baseUrl, {
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

test('signup requires a valid email OTP before creating an account', async () => {
  const email = 'otp-candidate@example.com';
  const requested = await post('/api/auth/register', {
    name: 'OTP Candidate',
    email,
    password: 'otp-candidate-password',
    role: 'candidate',
  });
  assert.equal(requested.status, 202);
  const issuedCode = otpCodes.get(`signup:${email}`);
  const wrongCode = issuedCode === '000000' ? '000001' : '000000';
  const invalidCode = await post('/api/auth/register/verify', { email, code: wrongCode });
  assert.equal(invalidCode.status, 400);
  const { rows: [notCreated] } = await database.query(
    'SELECT COUNT(*)::INTEGER AS count FROM users WHERE email = $1',
    [email],
  );
  assert.equal(Number(notCreated.count), 0);

  const verified = await post('/api/auth/register/verify', {
    email,
    code: otpCodes.get(`signup:${email}`),
  });
  assert.equal(verified.status, 201);
  assert.equal((await verified.json()).user.email, email);
});

test('password reset uses email OTP and revokes existing sessions', async () => {
  const email = 'casey@example.com';
  const existingLogin = await post('/api/auth/login', {
    email,
    password: 'candidate-password',
  });
  const existingCookie = sessionCookie(existingLogin);
  const resetRequest = await post('/api/auth/password/forgot', { email });
  assert.equal(resetRequest.status, 200);
  assert.match((await resetRequest.json()).message, /If an account exists/);

  const issuedCode = otpCodes.get(`password_reset:${email}`);
  const wrongCode = issuedCode === '000000' ? '000001' : '000000';
  const invalidCode = await post('/api/auth/password/reset', {
    email,
    code: wrongCode,
    password: 'new-candidate-password',
  });
  assert.equal(invalidCode.status, 400);

  const reset = await post('/api/auth/password/reset', {
    email,
    code: otpCodes.get(`password_reset:${email}`),
    password: 'new-candidate-password',
  });
  assert.equal(reset.status, 200);

  const oldSession = await fetch(`${baseUrl}/api/auth/me`, { headers: { Cookie: existingCookie } });
  assert.equal(oldSession.status, 401);
  const oldPasswordLogin = await post('/api/auth/login', {
    email,
    password: 'candidate-password',
  });
  assert.equal(oldPasswordLogin.status, 401);
  const newPasswordLogin = await post('/api/auth/login', {
    email,
    password: 'new-candidate-password',
  });
  assert.equal(newPasswordLogin.status, 200);

  const adminResetRequest = await post('/api/auth/password/forgot', { email: 'admin@example.com' });
  assert.equal(adminResetRequest.status, 200);
  const adminReset = await post('/api/auth/password/reset', {
    email: 'admin@example.com',
    code: otpCodes.get('password_reset:admin@example.com'),
    password: 'new-admin-test-password-123',
  });
  assert.equal(adminReset.status, 200);
  const oldAdminLogin = await post('/api/auth/login', {
    email: 'admin@example.com',
    password: 'admin-test-password-123',
  });
  assert.equal(oldAdminLogin.status, 401);
  const newAdminLogin = await post('/api/auth/login', {
    email: 'admin@example.com',
    password: 'new-admin-test-password-123',
  });
  assert.equal(newAdminLogin.status, 200);
});

test('admin bootstrap is idempotent and only an explicit rotation changes the password', async () => {
  const adminMemory = createMemoryDb();
  const AdminPool = adminMemory.adapters.createPg().Pool;
  const adminDatabase = new AdminPool();
  await initializeDatabase(adminDatabase);

  try {
    const firstCredentials = {
      name: 'Deployment Admin',
      email: 'deployment-admin@example.com',
      password: 'first-deployment-admin-password',
    };
    await provisionAdmin(adminDatabase, firstCredentials);
    const { rows: [initial] } = await adminDatabase.query(
      'SELECT password_hash FROM administrators WHERE email = $1',
      [firstCredentials.email],
    );

    await provisionAdmin(adminDatabase, { ...firstCredentials, password: 'different-deployment-password' });
    const { rows: [afterRestart] } = await adminDatabase.query(
      'SELECT password_hash FROM administrators WHERE email = $1',
      [firstCredentials.email],
    );
    assert.equal(afterRestart.password_hash, initial.password_hash);

    await provisionAdmin(adminDatabase, { ...firstCredentials, password: 'rotated-deployment-password' }, {
      updateExisting: true,
    });
    const { rows: [afterRotation] } = await adminDatabase.query(
      'SELECT password_hash FROM administrators WHERE email = $1',
      [firstCredentials.email],
    );
    assert.notEqual(afterRotation.password_hash, initial.password_hash);
  } finally {
    await adminDatabase.end();
  }
});

test('candidate accounts are capped at four active users and sign-out frees a slot', async () => {
  const limitedMemory = createMemoryDb();
  const LimitedPool = limitedMemory.adapters.createPg().Pool;
  const limitedDatabase = new LimitedPool();
  await initializeDatabase(limitedDatabase);
  const limitedApp = express();
  limitedApp.use(express.json());
  const limitedOtpCodes = new Map();
  limitedApp.use('/api/auth', createAuthRouter(limitedDatabase, {
    userCapacity: 4,
    otpSecret: testOtpSecret,
    sendOtp: async ({ email, code, purpose }) => limitedOtpCodes.set(`${purpose}:${email}`, code),
  }));
  limitedApp.use('/api/admin', createAdminRouter(limitedDatabase, { userCapacity: 4 }));
  const { hash: adminHash, salt: adminSalt } = await createPasswordHash('limited-admin-password-123');
  await limitedDatabase.query(`
    INSERT INTO administrators (name, email, password_hash, password_salt, created_at)
    VALUES ($1, $2, $3, $4, $5)
  `, ['Limited Admin', 'limited-admin@example.com', adminHash, adminSalt, Date.now()]);
  const limitedServer = limitedApp.listen(0, '127.0.0.1');
  await new Promise(resolve => limitedServer.once('listening', resolve));
  const limitedUrl = `http://127.0.0.1:${limitedServer.address().port}`;

  try {
    const cookies = [];
    for (let index = 1; index <= 4; index += 1) {
      const response = await registerAndVerify(limitedUrl, {
        name: `Candidate ${index}`,
        email: `capacity-${index}@example.com`,
        password: `capacity-test-password-${index}`,
        role: 'candidate',
      }, limitedOtpCodes);
      assert.equal(response.status, 201);
      cookies.push(sessionCookie(response));
    }

    const blockedRequest = await postTo(limitedUrl, '/api/auth/register', {
      name: 'Candidate Five',
      email: 'capacity-5@example.com',
      password: 'capacity-test-password-5',
      role: 'candidate',
    });
    assert.equal(blockedRequest.status, 202);
    const blocked = await postTo(limitedUrl, '/api/auth/register/verify', {
      email: 'capacity-5@example.com',
      code: limitedOtpCodes.get('signup:capacity-5@example.com'),
    });
    assert.equal(blocked.status, 429);
    assert.equal((await blocked.json()).code, 'user_capacity_reached');
    const { rows: [count] } = await limitedDatabase.query('SELECT COUNT(*)::INTEGER AS count FROM sessions');
    assert.equal(Number(count.count), 4);

    const pendingRecruiter = await registerAndVerify(limitedUrl, {
      name: 'Pending Recruiter',
      email: 'pending-capacity-recruiter@example.com',
      password: 'capacity-recruiter-password',
      role: 'recruiter',
    }, limitedOtpCodes);
    assert.equal(pendingRecruiter.status, 201);
    const recruiterId = (await pendingRecruiter.json()).user.id;
    const adminLogin = await postTo(limitedUrl, '/api/auth/login', {
      email: 'limited-admin@example.com',
      password: 'limited-admin-password-123',
    });
    const approvalWhenFull = await fetch(`${limitedUrl}/api/admin/recruiters/${recruiterId}`, {
      method: 'PATCH',
      headers: {
        Cookie: sessionCookie(adminLogin),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'approved' }),
    });
    assert.equal(approvalWhenFull.status, 429);
    assert.equal((await approvalWhenFull.json()).code, 'user_capacity_reached');

    await fetch(`${limitedUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: cookies[0] },
    });
    const replacement = await registerAndVerify(limitedUrl, {
      name: 'Candidate Replacement',
      email: 'capacity-replacement@example.com',
      password: 'capacity-test-password-5',
      role: 'candidate',
    }, limitedOtpCodes);
    assert.equal(replacement.status, 201);

    await limitedDatabase.query(`
      UPDATE sessions SET last_seen_at = $1
      WHERE user_id = (SELECT id FROM users WHERE email = $2)
    `, [Date.now() - 6 * 60 * 1000, 'capacity-2@example.com']);
    const afterIdle = await registerAndVerify(limitedUrl, {
      name: 'Candidate Six',
      email: 'capacity-6@example.com',
      password: 'capacity-test-password-6',
      role: 'candidate',
    }, limitedOtpCodes);
    assert.equal(afterIdle.status, 201);
    const expiredSession = await fetch(`${limitedUrl}/api/auth/me`, {
      headers: { Cookie: cookies[1] },
    });
    assert.equal(expiredSession.status, 401);
  } finally {
    await new Promise((resolve, reject) => limitedServer.close(error => error ? reject(error) : resolve()));
    await limitedDatabase.end();
  }

});
