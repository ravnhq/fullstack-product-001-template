#!/usr/bin/env node
// @ts-check
import { loadEnv } from './lib/env.js';

const env = loadEnv();

const res = await fetch(`${env.RAVN_API_BASE}/api/candidate/session`, {
  headers: { authorization: `Bearer ${env.RAVN_ASSESSMENT_TOKEN}` },
});

if (!res.ok) {
  console.error(`Budget check failed: HTTP ${res.status}`);
  process.exit(1);
}

/** @type {{ tokensUsed: number; tokenBudget: number; tokensRemaining: number; deadlineAt: string; status: string }} */
const data = await res.json();

console.log(
  `\nSession budget summary\n` +
    `  Status:     ${data.status}\n` +
    `  Used:       ${data.tokensUsed.toLocaleString()} tokens\n` +
    `  Budget:     ${data.tokenBudget.toLocaleString()} tokens\n` +
    `  Remaining:  ${data.tokensRemaining.toLocaleString()} tokens\n` +
    `  Deadline:   ${new Date(data.deadlineAt).toLocaleString()}\n`,
);
