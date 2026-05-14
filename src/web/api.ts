import type { FeedbackItem } from '../server/types.js';

export interface FetchFeedbackOptions {
  status?: string;
  priority?: string;
}

export interface FeedbackResponse {
  items: FeedbackItem[];
}

export async function fetchFeedback(
  opts: FetchFeedbackOptions = {},
): Promise<FeedbackResponse> {
  const params = new URLSearchParams();
  if (opts.status) params.set('status', opts.status);
  if (opts.priority) params.set('priority', opts.priority);

  const url = `/api/feedback${params.size > 0 ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status.toString()}`);
  }

  return res.json() as Promise<FeedbackResponse>;
}

export async function triageFeedback(id: string): Promise<FeedbackItem> {
  const res = await fetch(`/api/feedback/${id}/triage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error(`Triage error: ${res.status.toString()}`);
  }

  const data = (await res.json()) as { item: FeedbackItem };
  return data.item;
}
