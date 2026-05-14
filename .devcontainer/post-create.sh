#!/usr/bin/env bash
# AIP-27 / AIP-35 — candidate Codespaces post-create script.
#
# Runs once when the devcontainer first starts. Installs deps silently and
# opens ASSESSMENT.md + NOTES.md in VS Code.
#
# Trust-boundary invariants:
#   - The ONLY upstream credential reaching the candidate environment is
#     RAVN_ASSESSMENT_TOKEN. No LiteLLM master, no OpenRouter, no provider
#     API key. The ANTHROPIC_AUTH_TOKEN / OPENAI_API_KEY values that AI tools
#     read are set (via devcontainer.json remoteEnv) to the SAME Ravn token —
#     they intentionally collide on purpose so Claude Code / Pi route through
#     the Ravn proxy.
#   - smoke.sh greps the rendered env to confirm no foreign provider keys
#     leaked in.

set -euo pipefail

# shellcheck disable=SC2155
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO_ROOT"

# 1. Validate the assessment token is set BEFORE installing anything else.
if [ -z "${RAVN_ASSESSMENT_TOKEN:-}" ]; then
  printf 'Add RAVN_ASSESSMENT_TOKEN and RAVN_API_BASE as Codespaces secrets, then rebuild.\n' >&2
  exit 2
fi

if [ -z "${RAVN_API_BASE:-}" ]; then
  printf 'Add RAVN_ASSESSMENT_TOKEN and RAVN_API_BASE as Codespaces secrets, then rebuild.\n' >&2
  exit 2
fi

# 2. Confirm pnpm is available; if not, enable corepack and install it.
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >>"$HOME/.ravn-postcreate.log" 2>&1
  corepack prepare pnpm@latest --activate >>"$HOME/.ravn-postcreate.log" 2>&1
fi

# 3. Install dependencies (standalone — not a workspace member), logged silently.
{
  pnpm install --ignore-workspace
} >>"$HOME/.ravn-postcreate.log" 2>&1

# 4. Open ASSESSMENT.md and NOTES.md if `code` is available (it is, inside Codespaces).
if command -v code >/dev/null 2>&1; then
  code --reuse-window ASSESSMENT.md || true
  code --reuse-window NOTES.md || true
fi
