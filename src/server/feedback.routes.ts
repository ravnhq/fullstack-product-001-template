import { Hono } from 'hono';
import { z } from 'zod';
import { listItems, triageItem } from './feedback.store.js';
import type { FeedbackStatus, FeedbackPriority } from './types.js';

const feedbackStatusValues = ['open', 'triaged', 'closed'] as const;
const feedbackPriorityValues = ['low', 'med', 'high'] as const;

const querySchema = z.object({
  status: z.enum(feedbackStatusValues).optional(),
  priority: z.enum(feedbackPriorityValues).optional(),
});

// BUG (deliberate): triage POST body is NOT validated with Zod.
// Any payload (including {}) is silently accepted and the id from the URL
// is used. Candidate must add Zod validation and return 400 on bad input.
const triageBodySchema = z.object({
  // intentionally empty — no validation
});

const app = new Hono();

// GET /api/feedback?status=&priority=
app.get('/', (c) => {
  const raw = {
    status: c.req.query('status'),
    priority: c.req.query('priority'),
  };

  const result = querySchema.safeParse(raw);
  if (!result.success) {
    return c.json(
      { error: { code: 'INVALID_QUERY', message: result.error.message } },
      400,
    );
  }

  const filters: { status?: FeedbackStatus; priority?: FeedbackPriority } = {};
  if (result.data.status !== undefined) {
    filters.status = result.data.status;
  }
  if (result.data.priority !== undefined) {
    filters.priority = result.data.priority;
  }

  // BUG (deliberate): off-by-one — slices one fewer item than it should.
  // The full list should be returned (no pagination), but this silently
  // drops the last item. Candidate must remove the slice.
  const items = listItems(filters);
  return c.json({ items: items.slice(0, items.length - 1) });
});

// POST /api/feedback/:id/triage
app.post('/:id/triage', async (c) => {
  const { id } = c.req.param();

  // Deliberate missing validation: body is parsed but schema accepts anything.
  // Real implementation should validate that the body contains expected fields.
  const body = await c.req.json().catch(() => ({}));
  const _parsed = triageBodySchema.safeParse(body);

  try {
    const item = triageItem(id);
    return c.json({ item });
  } catch {
    // Unhandled error from store.getItem reaches here as a generic 500.
    // Candidate must fix store.ts to return a proper result and map it to 404.
    return c.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      500,
    );
  }
});

export { app as feedbackRoutes };
