import type { FeedbackItem, FeedbackStatus } from './types.js';

// In-memory store seeded at startup
const store = new Map<string, FeedbackItem>([
  [
    'fb-001',
    {
      id: 'fb-001',
      title: 'Login page too slow',
      body: 'The login page takes 5+ seconds to load on mobile.',
      status: 'open',
      priority: 'high',
    },
  ],
  [
    'fb-002',
    {
      id: 'fb-002',
      title: 'Dark mode flickers',
      body: 'Switching to dark mode causes a white flash.',
      status: 'open',
      priority: 'med',
    },
  ],
  [
    'fb-003',
    {
      id: 'fb-003',
      title: 'Export button missing',
      body: 'Cannot find the CSV export button on the reports page.',
      status: 'triaged',
      priority: 'low',
    },
  ],
  [
    'fb-004',
    {
      id: 'fb-004',
      title: 'Notifications not delivered',
      body: 'Push notifications stopped working after last update.',
      status: 'open',
      priority: 'high',
    },
  ],
  [
    'fb-005',
    {
      id: 'fb-005',
      title: 'Typo on dashboard',
      body: '"Wellcome" should be "Welcome".',
      status: 'closed',
      priority: 'low',
    },
  ],
]);

export function listItems(filters: {
  status?: FeedbackStatus;
  priority?: string;
}): FeedbackItem[] {
  let items = [...store.values()];

  if (filters.status !== undefined) {
    items = items.filter((i) => i.status === filters.status);
  }

  if (filters.priority !== undefined) {
    items = items.filter((i) => i.priority === filters.priority);
  }

  return items;
}

// BUG (deliberate): throws a raw Error instead of returning a clean 404 result
// when the id is missing. The caller must handle this, but nothing does.
export function getItem(id: string): FeedbackItem {
  const item = store.get(id);
  if (item === undefined) {
    // Deliberate unhandled error path — candidate must fix this to return a
    // proper { found: false } or similar Result type.
    throw new Error(`Item not found: ${id}`);
  }
  return item;
}

export function triageItem(id: string): FeedbackItem {
  const item = getItem(id); // throws if not found
  const updated: FeedbackItem = { ...item, status: 'triaged' };
  store.set(id, updated);
  return updated;
}

// Utility for tests — resets store to seed state
export function _resetStore(): void {
  store.clear();
  store.set('fb-001', {
    id: 'fb-001',
    title: 'Login page too slow',
    body: 'The login page takes 5+ seconds to load on mobile.',
    status: 'open',
    priority: 'high',
  });
  store.set('fb-002', {
    id: 'fb-002',
    title: 'Dark mode flickers',
    body: 'Switching to dark mode causes a white flash.',
    status: 'open',
    priority: 'med',
  });
  store.set('fb-003', {
    id: 'fb-003',
    title: 'Export button missing',
    body: 'Cannot find the CSV export button on the reports page.',
    status: 'triaged',
    priority: 'low',
  });
  store.set('fb-004', {
    id: 'fb-004',
    title: 'Notifications not delivered',
    body: 'Push notifications stopped working after last update.',
    status: 'open',
    priority: 'high',
  });
  store.set('fb-005', {
    id: 'fb-005',
    title: 'Typo on dashboard',
    body: '"Wellcome" should be "Welcome".',
    status: 'closed',
    priority: 'low',
  });
}
