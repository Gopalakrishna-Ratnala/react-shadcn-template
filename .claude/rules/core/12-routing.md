---
description: Routing — React Router v7, ProtectedRoute with Outlet, lazy loading, ROUTES constants. Always loaded.
---

# Routing & Protected Routes

## Stack

- Always use **React Router v7** (`react-router`) for all client-side navigation
- Always define all routes centrally in `src/config/routes.tsx` — never scatter `<Route>` definitions across pages or components
- Always lazy-load page components with `React.lazy` + `Suspense` — never eagerly import pages

## Router Wrapper in App.tsx

Always wrap `AppRoutes` with `<BrowserRouter>` in `App.tsx` — never inside a page, layout, or the route config itself:

```tsx
// src/App.tsx
import { BrowserRouter } from "react-router";
import { AppRoutes } from "@/config/routes";

export const App = (): ReactElement => {
  return (
    <BrowserRouter>
      {/* other root providers (ThemeProvider, ErrorBoundary, Toaster…) */}
      <AppRoutes />
    </BrowserRouter>
  );
};
```

- Only one `<BrowserRouter>` per app — always at the root
- `AppRoutes` returns only `<Routes>` / `<Route>` — it never owns the router provider

## Route Types

| Type | Description |
|---|---|
| **Public route** | Accessible to anyone — no auth required (e.g. Login, Signup) |
| **Protected route** | Requires authenticated session — redirects to login if unauthenticated |

## Protected Route Pattern

Build `ProtectedRoute` in `src/components/shared/protectedRoute/`. Because it has no visual UI, it uses a **reduced 4-file contract** — no `.styles.ts` and no `.stories.tsx`:

```text
protectedRoute/
├── ProtectedRoute.tsx
├── types.ts
├── ProtectedRoute.test.tsx
└── index.ts
```

It reads auth state from the store and redirects unauthenticated users:

```tsx
// src/components/shared/protectedRoute/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants";

export const ProtectedRoute = (): ReactElement => {
  // Adapt selector syntax to your chosen state management library (Zustand shown)
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return <p>Loading…</p>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  return <Outlet />;
};
```

## Route Config Pattern

```tsx
// src/config/routes.tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { ProtectedRoute } from "@/components/shared/protectedRoute";
import { ROUTES } from "@/constants";

const LoginPage     = lazy(() => import("@/pages/login/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));

const PageLoader = () => <p>Loading…</p>;

export const AppRoutes = (): ReactElement => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path={ROUTES.LOGIN}
        element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>}
      />

      {/* Protected routes — all children require auth */}
      <Route element={<ProtectedRoute />}>
        <Route
          path={ROUTES.DASHBOARD}
          element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>}
        />
      </Route>
    </Routes>
  );
};
```

## ROUTES Constants

Never hardcode path strings inline — always define them in `src/constants/routes.constants.ts`:

```ts
// src/constants/routes.constants.ts
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
} as const;
```

## Rules

- Always use `<Outlet />` in `ProtectedRoute` — never render children directly
- Always use `replace` on `<Navigate>` redirects — prevents polluting browser history
- Never check auth state directly inside a page component — delegate to `ProtectedRoute`
- Never put redirect logic inside a hook — keep it in the route guard component
- Always place `ProtectedRoute` as a layout route wrapping all protected paths — never repeat the guard per page
- If auth state is still loading (e.g. rehydrating from localStorage), render a loading fallback instead of redirecting — avoids false redirects
- Never use `useEffect` + `navigate()` inside a page to guard it — use `ProtectedRoute` instead
- Never duplicate route path strings — always import from `ROUTES` constants
