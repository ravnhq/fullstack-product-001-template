# Instructions for AI Coding Agents

> These instructions are for Claude Code, Pi, or any other AI agent operating in this repository during the assessment.

## Allowed tools

- Read, write, and edit files in this repository.
- Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm coverage`.
- Run `pnpm budget` to check your remaining token allowance.
- Run `pnpm submit` **once** when you are finished. Submission is final.

## Prohibited actions

- Do NOT call any external AI API directly (use only the tools provided by your environment).
- Do NOT read files outside this repository.
- Do NOT install additional npm packages without a clear justification left in `NOTES.md`.
- Do NOT modify `scripts/budget.js` or `scripts/submit.js`.
- Do NOT modify `tests/visible/` — those tests are part of the acceptance criteria.

## Budget and deadline

Check your budget before starting: `pnpm budget`.

If your token budget is running low, prioritise correctness over completeness. Submit early if you are close to the limit.

## Submission process

1. Make at least one commit (`git add . && git commit -m "feat: your work"`).
2. Run `pnpm submit --dry-run` to preview the payload.
3. Run `pnpm submit` to submit.

## Environment variables

Copy `.env.example` to `.env` and fill in:

- `RAVN_ASSESSMENT_TOKEN` — your personal assessment token (provided in onboarding email).
- `RAVN_API_BASE` — the Ravn proxy base URL (provided in onboarding email).

These are required for `pnpm budget` and `pnpm submit`. The dev server does **not** need them.

## Workspace layout

```
src/server/     Hono API (Node 22)
src/web/        Vite + React 19 SPA
tests/visible/  Vitest tests (do not modify)
scripts/        CLI scripts (do not modify)
ASSESSMENT.md   Full requirements
NOTES.md        Your working notes (encouraged)
```
