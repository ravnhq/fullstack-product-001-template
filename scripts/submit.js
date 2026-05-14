#!/usr/bin/env node
// @ts-check
import { execSync } from 'child_process';
import { loadEnv } from './lib/env.js';

const isDryRun = process.argv.includes('--dry-run');
const env = loadEnv();

// Verify we are inside a git repository
try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch {
  console.error('Not inside a git repository. Please initialise git first.');
  process.exit(2);
}

// Verify the repository has at least one commit
try {
  execSync('git rev-parse --verify HEAD', { stdio: 'ignore' });
} catch {
  console.error(
    'Repository has no commits — make at least one commit before submitting.',
  );
  process.exit(2);
}

// Capture HEAD commit SHA
const commitSha = execSync('git rev-parse HEAD').toString().trim();

// Warn on dirty working tree (does not block submission)
try {
  execSync('git diff --quiet && git diff --cached --quiet');
} catch {
  console.warn(
    'Warning: you have uncommitted changes. They will not be included in the submission.',
  );
}

const payload = { commitSha, notesPath: 'NOTES.md' };

if (isDryRun) {
  console.log('\n[dry-run] Would POST to:', `${env.RAVN_API_BASE}/api/candidate/submit`);
  console.log('[dry-run] Payload:', JSON.stringify(payload, null, 2));
  console.log('[dry-run] No submission was made.\n');
  process.exit(0);
}

const res = await fetch(`${env.RAVN_API_BASE}/api/candidate/submit`, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${env.RAVN_ASSESSMENT_TOKEN}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  /** @type {{ error?: { code?: string; message?: string } }} */
  const err = await res.json().catch(() => ({}));
  const code = err.error?.code ?? 'UNKNOWN';
  const msg = err.error?.message ?? `HTTP ${res.status}`;
  console.error(`Submission failed [${code}]: ${msg}`);
  process.exit(1);
}

// AIP-35: green ✓ + close-codespace hint signals the end of the candidate flow.
console.log(`\x1b[32m✓ Submitted commit ${commitSha}. You can close this Codespace.\x1b[0m\n`);
