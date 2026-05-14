# Assessment Requirements — fullstack_product_001

## Overview

You are working on a **Feedback Triage** tool. Product teams submit feedback items (bug reports, feature requests, complaints) and reviewers need to triage them — reviewing each item and marking it as handled.

## Functional requirements

### 1. List feedback items

- `GET /api/feedback` returns all feedback items in the store.
- The response shape is `{ items: FeedbackItem[] }`.

### 2. Filter by status and/or priority

- `GET /api/feedback?status=open` returns only items with `status === 'open'`.
- `GET /api/feedback?status=triaged&priority=high` returns items matching **both** filters.
- Invalid filter values should return a 400 error with shape `{ error: { code, message } }`.

### 3. Triage an item

- `POST /api/feedback/:id/triage` transitions the item's status to `'triaged'`.
- The request body must be validated. If the body is missing required fields, return 400.
- If the `id` does not exist, return 404 with `{ error: { code: 'NOT_FOUND', message: '...' } }`.
- The response on success is `{ item: FeedbackItem }`.

### 4. Idempotency

- Triaging an already-triaged item is allowed and returns 200 (no error, no double-write).

### 5. Error envelope consistency

All error responses (400, 404, 409, 500) must use the same envelope:

```json
{ "error": { "code": "STRING_CODE", "message": "Human-readable message" } }
```

### 6. Frontend — list view with filters

- The SPA at `:5173` shows the list of feedback items.
- Filter dropdowns for status and priority update the list in real time.
- When no items match, show an **empty state** message (`data-testid="empty-state"`).
- When the API call fails, show an **error state** message (`data-testid="error-state"`).

## Non-functional requirements

- TypeScript strict mode — no `any`, no `@ts-ignore`.
- All new logic must be covered by tests (`pnpm test`).
- `pnpm typecheck` must pass.

## Known issues in the baseline

The baseline code ships with **three deliberate bugs**. Finding and fixing them is part of the assessment.

Good luck!
