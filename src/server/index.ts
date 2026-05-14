import { serve } from '@hono/node-server';
import { buildApp } from './app.js';

const app = buildApp();
const port = 3000;

serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}`);
});
