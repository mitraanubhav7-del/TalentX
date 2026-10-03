import { Router } from 'express';
import { authenticate, requireRole } from './auth.js';

export function createAdminRouter(database, options) {
  const router = Router();
  router.use(authenticate(database, options), requireRole('admin'));

  router.get('/recruiters', (request, response) => {
    const status = request.query.status || 'pending';
    if (!['pending', 'approved', 'rejected', 'all'].includes(status)) {
      return response.status(400).json({ error: 'Choose pending, approved, rejected, or all.' });
    }

    const recruiters = status === 'all'
      ? database.prepare(`
        SELECT id, name, email, recruiter_status AS status, created_at AS createdAt
        FROM users WHERE role = 'recruiter'
        ORDER BY created_at DESC
      `).all()
      : database.prepare(`
        SELECT id, name, email, recruiter_status AS status, created_at AS createdAt
        FROM users WHERE role = 'recruiter' AND recruiter_status = ?
        ORDER BY created_at DESC
      `).all(status);

    response.json({ recruiters });
  });

  router.patch('/recruiters/:id', (request, response) => {
    const recruiterId = Number(request.params.id);
    const status = request.body?.status;
    if (!Number.isSafeInteger(recruiterId) || recruiterId < 1) {
      return response.status(400).json({ error: 'Recruiter ID is invalid.' });
    }
    if (status !== 'approved' && status !== 'rejected') {
      return response.status(400).json({ error: 'Set status to approved or rejected.' });
    }

    const result = database.prepare(`
      UPDATE users
      SET recruiter_status = ?, approved = ?
      WHERE id = ? AND role = 'recruiter' AND recruiter_status = 'pending'
    `).run(status, status === 'approved' ? 1 : 0, recruiterId);

    if (result.changes === 0) {
      const recruiter = database.prepare(`
        SELECT recruiter_status AS status FROM users
        WHERE id = ? AND role = 'recruiter'
      `).get(recruiterId);
      if (!recruiter) return response.status(404).json({ error: 'Recruiter request was not found.' });
      return response.status(409).json({ error: `This recruiter request is already ${recruiter.status}.` });
    }

    response.json({ id: recruiterId, status });
  });

  return router;
}
