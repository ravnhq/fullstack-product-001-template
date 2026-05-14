# Ravn Work Sample — fullstack_product_001

## Purpose

This assessment gives you a small but realistic full-stack TypeScript codebase to work on. Your task is to extend and fix a feedback-triage tool (see `ASSESSMENT.md` for requirements).

## Quick start

```bash
cp .env.example .env
# Fill in RAVN_ASSESSMENT_TOKEN and RAVN_API_BASE from your onboarding email
pnpm install
pnpm dev          # API on :3000, SPA on :5173
```

## Scripts

| Script | What it does |
|--------|-------------|
| `pnpm dev` | Runs the Hono API server + Vite SPA in parallel |
| `pnpm test` | Runs visible Vitest suite |
| `pnpm typecheck` | TypeScript type-check (no emit) |
| `pnpm lint` | ESLint (advisory — no CI gate in this repo) |
| `pnpm coverage` | Vitest with V8 coverage report |
| `pnpm security` | `pnpm audit --audit-level high` (advisory only; a clean clone may still flag advisories in transitive deps — this does **not** fail your assessment) |
| `pnpm budget` | Prints your session token usage and deadline |
| `pnpm submit` | Submits your work (reads HEAD commit SHA) |
| `pnpm submit --dry-run` | Prints what would be submitted, exits 0 |

## Outside-AI prohibition notice

**[Placeholder — final wording supplied by Ravn legal]**

This assessment must be completed using only the AI tools provided in your Codespace environment (Claude Code or Pi, as assigned). Use of external AI assistants, code-sharing sites, or collaboration with other humans is prohibited during the assessment window. By proceeding you confirm your consent to these terms.

## Consent

By cloning this repository and running `pnpm submit`, you confirm that the submitted work is your own within the terms above.
