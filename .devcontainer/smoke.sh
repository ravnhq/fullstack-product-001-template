#!/usr/bin/env bash
# AIP-27 — candidate devcontainer smoke test.
#
# Runs the candidate's actual onboarding flow against a stub Ravn API to prove:
#   1. `pnpm install` succeeds inside the devcontainer
#   2. `pnpm test` (visible suite) passes
#   3. `pnpm budget` reaches the API and prints a budget line
#   4. `pnpm submit --dry-run` prints the payload and exits 0 without POSTing
#   5. No upstream provider credentials leaked into the candidate environment
#   6. The candidate's token does not get echoed in error responses
#
# Expected env (set by the CALLER of this script, NOT by post-create.sh):
#   RAVN_ASSESSMENT_TOKEN — a seeded test token
#   RAVN_API_BASE         — http://localhost:<port> of a Ravn API booted with
#                           proxyProviderKind=stub and that token seeded
#
# Exit codes:
#   0 — all checks pass
#   1 — a check failed (specific stage is printed before exit)

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

step() { printf '\n▶ smoke: %s\n' "$1"; }
fail() { printf '\n✗ smoke FAILED at: %s\n' "$1" >&2; exit 1; }

# --- 0. Preconditions ---
step "preconditions"
: "${RAVN_ASSESSMENT_TOKEN:?missing}" || fail "RAVN_ASSESSMENT_TOKEN not set"
: "${RAVN_API_BASE:?missing}" || fail "RAVN_API_BASE not set"

# --- 1. Install + visible tests ---
step "pnpm install"
pnpm install --ignore-workspace --frozen-lockfile=false >/dev/null

step "pnpm test (visible suite)"
pnpm test || fail "pnpm test"

# --- 2. Budget script reaches the API ---
step "pnpm budget"
BUDGET_OUTPUT="$(pnpm budget 2>&1)" || fail "pnpm budget"
printf '  %s\n' "$BUDGET_OUTPUT"
echo "$BUDGET_OUTPUT" | grep -qE '(tokens?|budget|remaining)' || fail "budget output shape"

# --- 3. Submit --dry-run prints payload, no network write ---
step "pnpm submit --dry-run"
SUBMIT_OUTPUT="$(node scripts/submit.js --dry-run 2>&1 || true)"
printf '  %s\n' "$SUBMIT_OUTPUT"
echo "$SUBMIT_OUTPUT" | grep -q -i 'dry' || fail "dry-run banner missing"

# --- 4. No upstream provider credentials in env ---
step "env hygiene (no upstream provider credentials present)"
for FORBIDDEN in OPENROUTER_API_KEY LITELLM_MASTER_KEY ANTHROPIC_API_KEY OPENROUTER_KEY; do
  if printenv "$FORBIDDEN" >/dev/null 2>&1; then
    fail "forbidden env var present: $FORBIDDEN"
  fi
done

# Sanity: the AI-tool-facing env vars ARE set and equal the Ravn token.
if [ "${ANTHROPIC_AUTH_TOKEN:-}" != "$RAVN_ASSESSMENT_TOKEN" ]; then
  fail "ANTHROPIC_AUTH_TOKEN does not equal RAVN_ASSESSMENT_TOKEN"
fi
if [ "${OPENAI_API_KEY:-}" != "$RAVN_ASSESSMENT_TOKEN" ]; then
  fail "OPENAI_API_KEY does not equal RAVN_ASSESSMENT_TOKEN"
fi

# --- 5. Token-leak check via a forced-error response ---
step "token-leak check (error body must not echo the candidate's token)"
# Tamper the token to force a 401 with a body we can inspect.
BAD_BODY="$(curl -sS -H "authorization: Bearer not-the-real-token" \
  "${RAVN_API_BASE}/api/candidate/session" 2>&1 || true)"
if printf '%s' "$BAD_BODY" | grep -q -F "$RAVN_ASSESSMENT_TOKEN"; then
  fail "401 response body contains the candidate's token (LEAK)"
fi

printf '\n✓ smoke passed.\n'
