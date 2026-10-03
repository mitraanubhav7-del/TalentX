import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { authenticate, createAuthRouter, requireRole } from './auth.js';
import { createAdminRouter } from './admin.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function createApp(database) {
  const userCapacity = Number(process.env.USER_CAPACITY || 4);
  if (!Number.isSafeInteger(userCapacity) || userCapacity < 1) {
    throw new Error('USER_CAPACITY must be a positive whole number.');
  }
  const app = express();
  app.disable('x-powered-by');
  if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  }));
  app.use(express.json({ limit: '10kb' }));
  app.use('/api/auth', createAuthRouter(database, { userCapacity }));
  app.use('/api/admin', createAdminRouter(database, { userCapacity }));

  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));

  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'API endpoint not found.' });
  });

  const distributionDirectory = path.join(projectRoot, 'dist');
  app.use(express.static(distributionDirectory));
  app.get(/.*/, (_request, response) => {
    response.sendFile(path.join(distributionDirectory, 'index.html'));
  });

  app.use((error, _request, response, _next) => {
    if (error.type === 'entity.parse.failed') {
      return response.status(400).json({ error: 'Request body must be valid JSON.' });
    }
    console.error('Request failed:', error);
    response.status(500).json({ error: 'An unexpected server error occurred.' });
  });

  return app;
}

export { authenticate, requireRole };
