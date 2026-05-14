import { describe, it, expect, beforeEach } from 'vitest';
import { buildApp } from '../../src/server/app.js';
import { _resetStore } from '../../src/server/feedback.store.js';

describe('GET /api/feedback', () => {
  beforeEach(() => {
    _resetStore();
  });

  it('returns an array of feedback items with expected shape', async () => {
    const app = buildApp();
    const res = await app.request('/api/feedback');
    expect(res.status).toBe(200);

    const body = await res.json() as { items: unknown[] };
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);

    const first = body.items[0] as Record<string, unknown>;
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('body');
    expect(first).toHaveProperty('status');
    expect(first).toHaveProperty('priority');
  });

  it('filters by status when query param is provided', async () => {
    const app = buildApp();
    const res = await app.request('/api/feedback?status=open');
    expect(res.status).toBe(200);

    const body = await res.json() as { items: Array<{ status: string }> };
    expect(body.items.length).toBeGreaterThan(0);
    for (const item of body.items) {
      expect(item.status).toBe('open');
    }
  });
});

describe('POST /api/feedback/:id/triage', () => {
  beforeEach(() => {
    _resetStore();
  });

  it('transitions an open item to triaged status', async () => {
    const app = buildApp();
    const res = await app.request('/api/feedback/fb-001/triage', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(200);

    const body = await res.json() as { item: { id: string; status: string } };
    expect(body.item.id).toBe('fb-001');
    expect(body.item.status).toBe('triaged');
  });
});
