/**
 * Typed environment variable access with startup validation.
 * Vite only exposes variables prefixed with VITE_ to client code
 * (see https://vite.dev/guide/env-and-mode.html).
 *
 * Add new variables in three places: .env.example (documented placeholder),
 * this file's `requireEnv()` calls, and the `Env` interface below.
 */

interface Env {
  apiBaseUrl: string;
  appEnv: string;
}

function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Copy .env.example to .env.local and fill in a value.`,
    );
  }
  return value;
}

export const env: Env = {
  apiBaseUrl: requireEnv("VITE_API_BASE_URL"),
  appEnv: import.meta.env.VITE_APP_ENV ?? "development",
};
