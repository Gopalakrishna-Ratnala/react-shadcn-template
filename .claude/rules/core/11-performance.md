---
description: Performance guidelines — memoization rules, lazy loading, list keys, virtualization, bundle size. Always loaded.
---

# Performance

## Rules

- Never wrap a component in `React.memo` by default — only add it when a profiler confirms unnecessary re-renders
- Never use `useMemo` or `useCallback` as a habit — only use them when the computation is expensive or referential stability is required by a dependency array
- Always lazy-load page components via each route's own `lazy: () => import(...)` (React Router v8 data mode) — never eagerly import pages in the route config, and never use `React.lazy` + `Suspense` for this (see `core/12-routing.md`)
- Always provide a stable, unique identifier as the `key` prop in lists — never use array index as `key` in dynamic lists
- Never fetch data in a `useEffect` when a route `loader` can own it instead — effects are a last resort for data fetching (see `core/12-routing.md`, `core/07-react-hooks.md`)
- Avoid deeply nested component trees — flatten when components have no independent re-render needs.

## When `useMemo` Is Justified

```ts
// ✅ Expensive derived computation
const sorted = useMemo(() => heavySortFn(items), [items]);

// ❌ Trivial — not worth memoizing
const label = useMemo(() => `Hello ${name}`, [name]);
```

## When `useCallback` Is Justified

```ts
// ✅ Passed to a memoized child or used as an effect dependency
const handleSubmit = useCallback(async () => { ... }, [dep]);

// ❌ Not passed down or used as a dep — plain function is fine
const handleClick = () => setOpen(true);
```

## Lazy Loading Pages

This project uses React Router v8 **data mode** — route-level `lazy` replaces
`React.lazy` + `Suspense` entirely (see `core/12-routing.md` for the full
router setup). Never reach for `React.lazy`/`Suspense` for page-level code
splitting in this repo; `lazy` also resolves a route's `loader`/`action`
alongside its `Component`, code-splitting all three together:

```tsx
// src/config/routes.tsx
import { createBrowserRouter } from "react-router";
import { ROUTES } from "@/constants";
import { HydrateFallback } from "./routeFallback";
import type { RouteObject } from "react-router";

const routes: RouteObject[] = [
  {
    path: ROUTES.DASHBOARD,
    lazy: async () => {
      const { DashboardPage } = await import("@/pages/dashboard/DashboardPage");
      return { Component: DashboardPage };
    },
    HydrateFallback,
  },
  {
    path: ROUTES.PROFILE,
    lazy: async () => {
      const { ProfilePage } = await import("@/pages/profile/ProfilePage");
      return { Component: ProfilePage };
    },
    HydrateFallback,
  },
];

export const router = createBrowserRouter(routes);
```

## Long Lists

- Always virtualize lists with more than ~50 items — use `@tanstack/react-virtual` rather than rendering all DOM nodes
- Never map over large arrays directly into JSX without virtualization

## Bundle Size

- Always import named exports from libraries that support tree-shaking — avoid namespace imports (`import * as _`)
- Prefer dynamic `import()` for heavy optional features (charts, PDF renderers, rich text editors) that are not needed on initial load
