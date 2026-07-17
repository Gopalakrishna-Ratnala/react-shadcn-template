---
description: Performance guidelines — memoization rules, lazy loading, list keys, virtualization, bundle size. Always loaded.
---

# Performance

## Rules

- Never wrap a component in `React.memo` by default — only add it when a profiler confirms unnecessary re-renders
- Never use `useMemo` or `useCallback` as a habit — only use them when the computation is expensive or referential stability is required by a dependency array
- Always lazy-load page components with `React.lazy` + `Suspense` — never eagerly import pages in the route config
- Always provide a stable, unique identifier as the `key` prop in lists — never use array index as `key` in dynamic lists
- Never fetch data in a `useEffect` when a hook can encapsulate it — effects are a last resort for data fetching
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

```tsx
// src/config/routes.tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { ROUTES } from "@/constants";

const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const ProfilePage   = lazy(() => import("@/pages/profile/ProfilePage"));

const PageLoader = () => <p>Loading…</p>;

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        }
      />
    </Routes>
  );
}
```

## Long Lists

- Always virtualize lists with more than ~50 items — use `@tanstack/react-virtual` rather than rendering all DOM nodes
- Never map over large arrays directly into JSX without virtualization

## Bundle Size

- Always import named exports from libraries that support tree-shaking — avoid namespace imports (`import * as _`)
- Prefer dynamic `import()` for heavy optional features (charts, PDF renderers, rich text editors) that are not needed on initial load
