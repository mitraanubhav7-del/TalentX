import { Router } from 'express';
import { authenticate, requireRole } from './auth.js';

export function createAdminRouter(database, options) {
  const router = Router();
  router.use(authenticate(database, options), requireRole('admin'));
  const userCapacity = options?.userCapacity ?? Number(process.env.USER_CAPACITY || 50);

  router.get('/recruiters', async (request, response, next) => {
    const status = request.query.status || 'pending';
    if (!['pending', 'approved', 'rejected', 'all'].includes(status)) {
      return response.status(400).json({ error: 'Choose pending, approved, rejected, or all.' });
    }

    try {
      const { rows } = status === 'all'
        ? await database.query(`
          SELECT id, name, email, recruiter_status AS status, created_at AS "createdAt"
          FROM users WHERE role = 'recruiter'
          ORDER BY created_at DESC
        `)
        : await database.query(`
          SELECT id, name, email, recruiter_status AS status, created_at AS "createdAt"
          FROM users WHERE role = 'recruiter' AND recruiter_status = $1
          ORDER BY created_at DESC
        `, [status]);
      response.json({ recruiters: rows.map(recruiter => ({
        ...recruiter,
        createdAt: Number(recruiter.createdAt),
      })) });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/recruiters/:id', async (request, response, next) => {
    const recruiterId = Number(request.params.id);
    const status = request.body?.status;
    if (!Number.isSafeInteger(recruiterId) || recruiterId < 1) {
      return response.status(400).json({ error: 'Recruiter ID is invalid.' });
    }
    if (status !== 'approved' && status !== 'rejected') {
      return response.status(400).json({ error: 'Set status to approved or rejected.' });
    }

    const client = await database.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE capacity_guard SET revision = revision + 1 WHERE id = 1');
      const { rows: [current] } = await client.query(`
        SELECT recruiter_status AS status FROM users
        WHERE id = $1 AND role = 'recruiter' FOR UPDATE
      `, [recruiterId]);
      if (!current) {
        await client.query('ROLLBACK');
        return response.status(404).json({ error: 'Recruiter request was not found.' });
      }
      if (current.status !== 'pending') {
        await client.query('ROLLBACK');
        return response.status(409).json({ error: `This recruiter request is already ${current.status}.` });
      }

      if (status === 'approved') {
        const { rows: [activeResult] } = await client.query(`
          SELECT COUNT(DISTINCT users.id)::INTEGER AS count
          FROM sessions
          JOIN users ON users.id = sessions.user_id
          WHERE sessions.last_seen_at >= $1
            AND (users.role = 'candidate'
              OR (users.role = 'recruiter' AND users.recruiter_status = 'approved'))
        `, [Date.now() - 5 * 60 * 1000]);
        if (Number(activeResult.count) >= userCapacity) {
          await client.query('ROLLBACK');
          return response.status(429).json({
            error: `TalentX is at its ${userCapacity}-user capacity. Try approving this request later.`,
            code: 'user_capacity_reached',
          });
        }
      }

      await client.query(`
        UPDATE users
        SET recruiter_status = $1, approved = $2
        WHERE id = $3
      `, [status, status === 'approved', recruiterId]);
      await client.query('COMMIT');
      response.json({ id: recruiterId, status });
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  });

  return router;
}
