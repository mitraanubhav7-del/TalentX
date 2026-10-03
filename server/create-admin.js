import 'dotenv/config';
import { db } from './db.js';
import { createPasswordHash } from './auth.js';

const name = (process.env.ADMIN_NAME || 'TalentX Administrator').trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Set a valid ADMIN_EMAIL in your ignored .env file before creating the admin account.');
  process.exitCode = 1;
} else if (!password || password.length < 14 || password.length > 128) {
  console.error('Set ADMIN_PASSWORD in .env to a unique password with at least 14 characters.');
  process.exitCode = 1;
} else if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
  console.error('That email already belongs to a candidate or recruiter account.');
  process.exitCode = 1;
} else {
  try {
    const { hash, salt } = await createPasswordHash(password);
    db.prepare(`
      INSERT INTO administrators (name, email, password_hash, password_salt, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, hash, salt, Date.now());
    console.log(`Administrator account created for ${email}. The password was not printed.`);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      console.error('An administrator account already uses that email.');
      process.exitCode = 1;
    } else {
      throw error;
    }
  }
}

db.close();
