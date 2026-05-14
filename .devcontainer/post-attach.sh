#!/usr/bin/env bash
# AIP-35 — runs every time VS Code attaches to the container.
# Unlike postCreateCommand, the `code` CLI here IS wired to the editor,
# so this is where we open the candidate's working files.

set -euo pipefail

# shellcheck disable=SC2155
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO_ROOT"

if command -v code >/dev/null 2>&1; then
  code --reuse-window ASSESSMENT.md || true
  code --reuse-window NOTES.md || true
fi
