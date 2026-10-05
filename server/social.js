import { Router } from 'express';
import { authenticate } from './auth.js';

const MAX_MESSAGE_LENGTH = 4_000;
const asId = value => {
  if (!/^\d+$/.test(String(value))) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

function requireNetworkMember(request, response, next) {
  const user = request.authUser;
  if (!user || !['candidate', 'recruiter'].includes(user.role) || (user.role === 'recruiter' && !user.approved)) {
    return response.status(403).json({ error: 'An approved TalentX member account is required.' });
  }
  next();
}

export function createSocialRouter(database, options = {}) {
  const router = Router();
  const session = authenticate(database, options);
  const member = [session, requireNetworkMember];

  router.get('/posts', ...member, async (request, response, next) => {
    try {
      const { rows } = await database.query(`
        SELECT p.id, p.body, p.created_at, u.id AS author_id, u.name,
          u.profile_data->>'title' AS title, u.profile_data->>'avatar' AS avatar,
          (SELECT COUNT(*)::INTEGER FROM feed_post_likes l WHERE l.post_id = p.id) AS likes,
          EXISTS (SELECT 1 FROM feed_post_likes l WHERE l.post_id = p.id AND l.user_id = $1) AS has_liked
        FROM feed_posts p JOIN users u ON u.id = p.author_id
        WHERE u.role = 'candidate' OR (u.role = 'recruiter' AND u.approved = TRUE)
        ORDER BY p.created_at DESC, p.id DESC LIMIT 100
      `, [request.authUser.id]);
      response.json({ posts: rows.map(row => ({
        id: row.id,
        author: { id: row.author_id, name: row.name, title: row.title || 'TalentX member', avatar: row.avatar || '', verified: true },
        content: row.body,
        createdAt: Number(row.created_at),
        likes: Number(row.likes),
        hasLiked: row.has_liked,
        comments: 0,
        shares: 0,
        tags: [],
      })) });
    } catch (error) { next(error); }
  });

  router.post('/posts', ...member, async (request, response, next) => {
    const body = typeof request.body?.content === 'string' ? request.body.content.trim() : '';
    if (!body || body.length > 2_000) return response.status(400).json({ error: 'Posts must be between 1 and 2,000 characters.' });
    try {
      const { rows: [post] } = await database.query(`
        INSERT INTO feed_posts (author_id, body, created_at) VALUES ($1, $2, $3)
        RETURNING id, body, created_at
      `, [request.authUser.id, body, Date.now()]);
      response.status(201).json({ post: { id: post.id, content: post.body, createdAt: Number(post.created_at) } });
    } catch (error) { next(error); }
  });

  router.post('/posts/:postId/like', ...member, async (request, response, next) => {
    const postId = asId(request.params.postId);
    if (!postId) return response.status(400).json({ error: 'Invalid post.' });
    try {
      const { rows: [post] } = await database.query('SELECT id FROM feed_posts WHERE id = $1', [postId]);
      if (!post) return response.status(404).json({ error: 'Post not found.' });
      const createdAt = Date.now();
      const inserted = await database.query(`
        INSERT INTO feed_post_likes (post_id, user_id, created_at) VALUES ($1, $2, $3)
        ON CONFLICT (post_id, user_id) DO NOTHING
      `, [postId, request.authUser.id, createdAt]);
      let liked = inserted.rowCount === 1;
      if (!liked) {
        await database.query('DELETE FROM feed_post_likes WHERE post_id = $1 AND user_id = $2', [postId, request.authUser.id]);
      }
      const { rows: [count] } = await database.query('SELECT COUNT(*)::INTEGER AS likes FROM feed_post_likes WHERE post_id = $1', [postId]);
      response.json({ liked, likes: Number(count.likes) });
    } catch (error) { next(error); }
  });

  router.get('/members', ...member, async (request, response, next) => {
    try {
      const { rows } = await database.query(`
        SELECT u.id, u.name, u.role, u.profile_data,
          c.id AS connection_id, c.status AS connection_status,
          c.requester_id,
          (SELECT MAX(m.created_at) FROM direct_messages m WHERE m.connection_id = c.id) AS last_message_at
        FROM users u
        LEFT JOIN member_connections c ON
          c.left_user_id = LEAST(u.id, $1::integer) AND c.right_user_id = GREATEST(u.id, $1::integer)
        WHERE u.id <> $1 AND (u.role = 'candidate' OR (u.role = 'recruiter' AND u.approved = TRUE))
        ORDER BY u.created_at DESC
        LIMIT 200
      `, [request.authUser.id]);
      response.json({ members: rows.map(publicMember) });
    } catch (error) { next(error); }
  });

  router.post('/connections/:memberId', ...member, async (request, response, next) => {
    const otherId = asId(request.params.memberId);
    if (!otherId || otherId === request.authUser.id) return response.status(400).json({ error: 'Choose another member to connect with.' });
    try {
      const { rows: [other] } = await database.query(`
        SELECT id FROM users WHERE id = $1 AND (role = 'candidate' OR (role = 'recruiter' AND approved = TRUE))
      `, [otherId]);
      if (!other) return response.status(404).json({ error: 'Member not found.' });
      const left = Math.min(request.authUser.id, otherId);
      const right = Math.max(request.authUser.id, otherId);
      const { rows: [connection] } = await database.query(`
        INSERT INTO member_connections (left_user_id, right_user_id, requester_id, status, created_at, updated_at)
        VALUES ($1, $2, $3, 'pending', $4, $4)
        ON CONFLICT (left_user_id, right_user_id) DO UPDATE SET
          status = CASE
            WHEN member_connections.status = 'pending' AND member_connections.requester_id <> EXCLUDED.requester_id THEN 'accepted'
            WHEN member_connections.status = 'declined' THEN 'pending'
            ELSE member_connections.status
          END,
          requester_id = CASE WHEN member_connections.status = 'declined' THEN EXCLUDED.requester_id ELSE member_connections.requester_id END,
          updated_at = EXCLUDED.updated_at
        RETURNING id, status, requester_id
      `, [left, right, request.authUser.id, Date.now()]);
      response.status(201).json({ connection });
    } catch (error) { next(error); }
  });

  router.patch('/connections/:connectionId', ...member, async (request, response, next) => {
    const connectionId = asId(request.params.connectionId);
    const status = request.body?.status;
    if (!connectionId || !['accepted', 'declined'].includes(status)) return response.status(400).json({ error: 'Choose accept or decline for this request.' });
    try {
      const { rows: [connection] } = await database.query(`
        UPDATE member_connections SET status = $1, updated_at = $2
        WHERE id = $3 AND status = 'pending' AND requester_id <> $4
          AND (left_user_id = $4 OR right_user_id = $4)
        RETURNING id, status, requester_id
      `, [status, Date.now(), connectionId, request.authUser.id]);
      if (!connection) return response.status(404).json({ error: 'Connection request not found or already handled.' });
      response.json({ connection });
    } catch (error) { next(error); }
  });

  router.get('/messages/:memberId', ...member, async (request, response, next) => {
    const otherId = asId(request.params.memberId);
    if (!otherId || otherId === request.authUser.id) return response.status(400).json({ error: 'Invalid conversation.' });
    try {
      const { rows: [connection] } = await database.query(`
        SELECT id FROM member_connections WHERE left_user_id = LEAST($1::integer, $2::integer)
          AND right_user_id = GREATEST($1::integer, $2::integer) AND status = 'accepted'
      `, [request.authUser.id, otherId]);
      if (!connection) return response.status(403).json({ error: 'You can message this member after they accept your connection request.' });
      const { rows } = await database.query(`
        SELECT id, sender_id, body, created_at FROM direct_messages
        WHERE connection_id = $1 ORDER BY created_at DESC, id DESC LIMIT 100
      `, [connection.id]);
      response.json({ messages: rows.reverse().map(row => ({ id: row.id, senderId: row.sender_id, text: row.body, createdAt: Number(row.created_at) })) });
    } catch (error) { next(error); }
  });

  router.post('/messages/:memberId', ...member, async (request, response, next) => {
    const otherId = asId(request.params.memberId);
    const body = typeof request.body?.text === 'string' ? request.body.text.trim() : '';
    if (!otherId || otherId === request.authUser.id || !body || body.length > MAX_MESSAGE_LENGTH) {
      return response.status(400).json({ error: `Messages must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` });
    }
    try {
      const { rows: [connection] } = await database.query(`
        SELECT id FROM member_connections WHERE left_user_id = LEAST($1::integer, $2::integer)
          AND right_user_id = GREATEST($1::integer, $2::integer) AND status = 'accepted'
      `, [request.authUser.id, otherId]);
      if (!connection) return response.status(403).json({ error: 'You can message this member after they accept your connection request.' });
      const { rows: [message] } = await database.query(`
        INSERT INTO direct_messages (connection_id, sender_id, body, created_at)
        VALUES ($1, $2, $3, $4) RETURNING id, sender_id, body, created_at
      `, [connection.id, request.authUser.id, body, Date.now()]);
      response.status(201).json({ message: { id: message.id, senderId: message.sender_id, text: message.body, createdAt: Number(message.created_at) } });
    } catch (error) { next(error); }
  });

  return router;
}

function publicMember(row) {
  const profile = row.profile_data || {};
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    title: profile.title || (row.role === 'recruiter' ? 'Recruiter' : 'TalentX member'),
    avatar: profile.avatar || '',
    location: profile.location || '',
    connectionId: row.connection_id || null,
    connectionStatus: row.connection_status || null,
    requesterId: row.requester_id || null,
  };
}
