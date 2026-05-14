import { Hono } from 'hono';
import { feedbackRoutes } from './feedback.routes.js';

export function buildApp(): Hono {
  const app = new Hono();

  app.route('/api/feedback', feedbackRoutes);

  app.get('/health', (c) => c.json({ ok: true }));

  return app;
}
