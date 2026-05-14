export type FeedbackStatus = 'open' | 'triaged' | 'closed';
export type FeedbackPriority = 'low' | 'med' | 'high';

export interface FeedbackItem {
  id: string;
  title: string;
  body: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
}

export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
  };
}
