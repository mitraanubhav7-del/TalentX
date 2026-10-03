import 'dotenv/config';
import { db, initializeDatabase } from './db.js';
import { provisionAdmin } from './provision-admin.js';

try {
  await initializeDatabase(db);
  await provisionAdmin(db, {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  }, { updateExisting: true });
  console.log(`Administrator account is ready for ${process.env.ADMIN_EMAIL.trim().toLowerCase()}.`);
} catch (error) {
  console.error('Unable to create administrator:', error.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
