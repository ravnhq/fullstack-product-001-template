import type { FeedbackPriority, FeedbackStatus } from '../../server/types.js';

interface FilterBarProps {
  status: string;
  priority: string;
  onStatusChange: (v: FeedbackStatus | '') => void;
  onPriorityChange: (v: FeedbackPriority | '') => void;
}

export function FilterBar({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: FilterBarProps) {
  return (
    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
      <label>
        Status:{' '}
        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as FeedbackStatus | '')
          }
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="triaged">Triaged</option>
          <option value="closed">Closed</option>
        </select>
      </label>

      <label>
        Priority:{' '}
        <select
          value={priority}
          onChange={(e) =>
            onPriorityChange(e.target.value as FeedbackPriority | '')
          }
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="med">Med</option>
          <option value="high">High</option>
        </select>
      </label>
    </div>
  );
}
