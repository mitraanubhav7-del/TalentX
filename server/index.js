import { createApp } from './app.js';
import { db, initializeDatabase } from './db.js';
import { provisionAdmin } from './provision-admin.js';

const port = Number(process.env.PORT || 3001);
const adminConfig = {
  name: process.env.ADMIN_NAME,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};
const configuredAdminFields = Object.values(adminConfig).filter(Boolean).length;

try {
  if (process.env.NODE_ENV === 'production' && configuredAdminFields !== 3) {
    throw new Error('Production startup requires ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD.');
  }
  if (configuredAdminFields !== 0 && configuredAdminFields !== 3) {
    throw new Error('Set all three admin variables together: ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD.');
  }
  await initializeDatabase(db);
  if (configuredAdminFields === 3) await provisionAdmin(db, adminConfig);
  const app = createApp(db);
  app.listen(port, '0.0.0.0', () => {
    console.log(`TalentX server listening on 0.0.0.0:${port}`);
  });
} catch (error) {
  console.error('Failed to initialize TalentX database:', error);
  await db.end();
  process.exitCode = 1;
}
