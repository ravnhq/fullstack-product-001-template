import type { FeedbackItem } from '../../server/types.js';

interface FeedbackListProps {
  items: FeedbackItem[];
  onTriage: (id: string) => void;
}

export function FeedbackList({ items, onTriage }: FeedbackListProps) {
  if (items.length === 0) {
    return (
      <p data-testid="empty-state">No feedback items match your filters.</p>
    );
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item) => (
        <li
          key={item.id}
          data-testid="feedback-item"
          style={{
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          <strong>{item.title}</strong>
          <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>
            [{item.priority}] [{item.status}]
          </span>
          <p style={{ margin: '0.25rem 0' }}>{item.body}</p>
          {item.status !== 'triaged' && item.status !== 'closed' && (
            <button onClick={() => onTriage(item.id)}>Mark Triaged</button>
          )}
        </li>
      ))}
    </ul>
  );
}
