import { useState, useEffect, useCallback } from 'react';
import { fetchFeedback, triageFeedback } from './api.js';
import { FeedbackList } from './components/FeedbackList.js';
import { FilterBar } from './components/FilterBar.js';
import type { FeedbackItem, FeedbackStatus, FeedbackPriority } from '../server/types.js';

export function App() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [status, setStatus] = useState<FeedbackStatus | ''>('');
  const [priority, setPriority] = useState<FeedbackPriority | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchFeedback({ status: status || undefined, priority: priority || undefined })
      .then((res) => {
        setItems(res.items);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      });
  }, [status, priority]);

  useEffect(() => {
    load();
  }, [load]);

  const handleTriage = (id: string) => {
    triageFeedback(id)
      .then((updated) => {
        setItems((prev) =>
          prev.map((i) => (i.id === updated.id ? updated : i)),
        );
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unknown error');
      });
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Feedback Triage</h1>

      <FilterBar
        status={status}
        priority={priority}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
      />

      {loading && <p data-testid="loading-state">Loading…</p>}

      {!loading && error !== null && (
        <p data-testid="error-state" style={{ color: 'red' }}>
          Error: {error}
        </p>
      )}

      {!loading && error === null && (
        <FeedbackList items={items} onTriage={handleTriage} />
      )}
    </div>
  );
}
