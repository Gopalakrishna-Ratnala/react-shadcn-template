---
description: TypeScript strict mode — no explicit any, required typing, ESLint enforcement rules. Loaded when editing TS/TSX files.
paths: ["src/**/*.ts", "src/**/*.tsx"]
---

# TypeScript Rules

## Strict Mode Requirements

- **NEVER** use explicit `any`
- Use `unknown` only when truly necessary, then narrow it
- **Always explicitly annotate the return type of every exported function, component,
  and hook** — mechanically enforced via `@typescript-eslint/explicit-module-boundary-types`
  (`eslint.config.js`, scoped to exclude `src/components/ui/**`). Components typically
  return `ReactElement` (import as `import type { ReactElement } from "react"`); use
  `ReactNode` if the function can also return `null`/a fragment/children directly
  (e.g. a class component's `render()`, or a component with an early-return guard).
- Always type:
  - props
  - API payloads
  - service return types
  - store state and actions
  - hook return values

- Use discriminated unions for state variants when applicable
- Prefer `Readonly`, `Record`, and literal unions over vague object shapes

## Enforcement Rules

- `@typescript-eslint/no-explicit-any` = error
- `@typescript-eslint/no-unused-vars` = error
- `@typescript-eslint/no-floating-promises` = error
- `@typescript-eslint/await-thenable` = error
- `@typescript-eslint/return-await` = error
- `@typescript-eslint/explicit-module-boundary-types` = error (excludes vendored `src/components/ui/**`)
- `import-x/order` = error (excludes vendored `src/components/ui/**`)

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

**Mechanically enforced** via `eslint-plugin-import-x`'s `import-x/order` rule
(`eslint.config.js`) — not just documentation. Auto-fixable with `npm run lint --
--fix` or `npx eslint . --fix`. Scoped to exclude `src/components/ui/**`
(vendored, never manually edited).

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

## `satisfies` for Literal Config Objects

Use `satisfies` (not a type annotation) on constant object literals — like
`ROUTES`, `API_ENDPOINTS`, or a status-to-variant lookup — when you want the
compiler to check the shape matches an expected type, while keeping the exact,
narrowed literal types (so `ROUTES.PRODUCTS` is still the literal string
`"/products"`, not the wider `string`). A plain type annotation (`: Record<string,
string>`) or `as const` alone can't do both at once.

```ts
// WRONG — plain annotation widens every value to `string`, losing the literal type
const ROUTES: Record<string, string> = {
  COMPONENTS_GALLERY: "/components-gallery",
};
// ROUTES.COMPONENTS_GALLERY is typed as `string`, not the literal "/components-gallery"

// WRONG — as const alone gives no shape-checking against an expected type at all
const ROUTES = {
  COMPONENTS_GALERY: "/components-gallery", // typo — nothing catches this
} as const;

// CORRECT — satisfies checks the shape, as const keeps the literal types
interface RouteMap {
  COMPONENTS_GALLERY: string;
}

const ROUTES = {
  COMPONENTS_GALLERY: "/components-gallery",
} as const satisfies RouteMap;
// ROUTES.COMPONENTS_GALLERY is still the literal "/components-gallery",
// and a missing/misspelled key would be a real type error against RouteMap
```
