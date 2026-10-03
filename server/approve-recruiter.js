import { db } from './db.js';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Usage: npm run auth:approve -- recruiter@example.com');
  process.exitCode = 1;
} else {
  const result = db.prepare(`
    UPDATE users SET approved = 1, recruiter_status = 'approved'
    WHERE email = ? AND role = 'recruiter'
  `).run(email);

  if (result.changes === 0) {
    console.error(`No pending recruiter account found for ${email}.`);
    process.exitCode = 1;
  } else {
    console.log(`Recruiter account approved: ${email}`);
  }
}

db.close();
