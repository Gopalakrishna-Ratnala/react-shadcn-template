---
description: Environment variable rules — VITE_ prefix, no secrets in client bundle, typed config module, startup validation. Always loaded.
paths: ["src/**/*.ts", "src/**/*.tsx", "vite.config.ts"]
---

# Environment Variables

## Rules

- Always prefix all client-side environment variables with `VITE_` — Vite strips any variable without this prefix from the client bundle
- Never access `import.meta.env.*` directly inside UI components, hooks, or services — always go through the typed config module at `src/config/env.ts`
- Never commit `.env` files containing real secrets — only commit `.env.example` with placeholder values
- Never hardcode secrets, API keys, or base URLs as string literals anywhere in source files
- Always validate required environment variables at app startup — fail fast with a clear error if a required variable is missing
- Always type all environment variables in `src/config/env.ts` — never leave them as `string | undefined`

## Directory Structure

```text
.env.example          # Checked into git — placeholder values only, no real secrets
.env.local            # Never committed — real values for local development
src/
  config/
    env.ts            # Single source of truth for all env access and validation
    routes.tsx        # Route config (separate from env config)
```

## Required Pattern

```ts
// src/config/env.ts
const requireEnv = (key: string): string => {
  const value = import.meta.env[key] as string | undefined;
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const env = {
  apiBaseUrl: requireEnv("VITE_API_BASE_URL"),
  appEnv: (import.meta.env["VITE_APP_ENV"] as string | undefined) ?? "development",
} as const;
```

```ts
// src/services/apiClient.ts — imports from env config, never from import.meta.env directly
import { env } from "@/config/env";

// apiClient uses native fetch, not a library instance — see data-fetching/01-fetch-client.md
// for the full implementation. The key point here: env.apiBaseUrl is read once, from the
// typed config module, never inline as import.meta.env.VITE_API_BASE_URL.
const response = await fetch(`${env.apiBaseUrl}/products`, {
  headers: { "Content-Type": "application/json" },
});
```

## .env.example Shape

```env
# API
VITE_API_BASE_URL=https://api.example.com

# App
VITE_APP_ENV=development
```

## Forbidden Patterns

```ts
// WRONG — direct import.meta.env access in a component or hook
const data = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`);

// CORRECT — go through env config
import { env } from "@/config/env";
const data = await fetch(`${env.apiBaseUrl}/users`);

// WRONG — hardcoded base URL
const response = await fetch("https://api.example.com/products");

// WRONG — variable missing without check (silently undefined)
const url = import.meta.env.VITE_API_BASE_URL; // could be undefined at runtime
```
