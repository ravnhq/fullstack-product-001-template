// @ts-check
import { z } from 'zod';

const envSchema = z.object({
  RAVN_ASSESSMENT_TOKEN: z.string().min(1),
  RAVN_API_BASE: z.string().url(),
});

/**
 * Loads and validates required environment variables.
 * Exits with code 2 and a friendly message if any are missing or invalid.
 * @returns {{ RAVN_ASSESSMENT_TOKEN: string; RAVN_API_BASE: string }}
 */
export function loadEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => /** @type {string} */ (i.path[0]))
      .join(', ');
    console.error(
      `\nMissing or invalid environment variables: ${missing}\n` +
        `Please copy .env.example to .env and fill in your values.\n` +
        `See ASSESSMENT.md for details.\n`,
    );
    process.exit(2);
  }
  return result.data;
}
