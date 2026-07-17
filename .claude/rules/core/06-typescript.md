---
description: TypeScript strict mode — no explicit any, required typing, ESLint enforcement rules. Loaded when editing TS/TSX files.
paths: ["src/**/*.ts", "src/**/*.tsx"]
---

# TypeScript Rules

## Strict Mode Requirements

- **NEVER** use explicit `any`
- Use `unknown` only when truly necessary, then narrow it
- Always type:
  - props
  - API payloads
  - service return types
  - store state and actions
  - hook return values where useful

- Use discriminated unions for state variants when applicable
- Prefer `Readonly`, `Record`, and literal unions over vague object shapes

## Enforcement Rules

- `@typescript-eslint/no-explicit-any` = error
- `@typescript-eslint/no-unused-vars` = error
- `@typescript-eslint/no-floating-promises` = error
- `@typescript-eslint/await-thenable` = error
- `@typescript-eslint/return-await` = error

## Path Alias

- Always use the `@/` alias for all internal imports — never use relative paths that traverse up more than one level
- The `@/` alias maps to `src/` and must be configured in both `tsconfig.json` and `vite.config.ts`

```ts
// WRONG — relative path traversing upward
import { useAuth } from "../../hooks/useAuth";

// CORRECT — alias from src root
import { useAuth } from "@/hooks";
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

## Import Order

Always group imports in this order, with a blank line between each group:

1. React (always first)
2. Third-party libraries
3. Internal aliases (`@/`)
4. Relative imports (`./`)
5. Type-only imports (`import type`) — at the end of their respective group

```ts
// CORRECT order
import { useState, useCallback } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
 
import { useAuthStore } from "@/store/auth";
import { loginUser } from "@/services/auth/authService";

import { loginSchema } from "./LoginPage.schema";
import type { LoginFormValues } from "./LoginPage.schema";
```

## Required Practices

```typescript
// Always type async functions explicitly
const handleSubmit = async (): Promise<void> => {
  await saveData();
};

// Always type caught errors as unknown and narrow before use
try {
  return await fetchResource();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  throw new Error(message);
}

// Use underscore prefix ONLY for intentionally unused destructured values
const [_ignored, setValue] = useState(0);
```
