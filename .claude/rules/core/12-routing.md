---
description: Routing — React Router v8, ProtectedRoute with Outlet, lazy loading, ROUTES constants. Always loaded.
---

# Routing & Protected Routes

## Stack

- Always use **React Router v8** (`react-router`) for all client-side navigation — confirm the installed version in `package.json` before writing version-specific code, since the API has changed across major versions
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

## Navigation — Link and NavLink

Never use a raw `<a href="...">` for in-app navigation — it triggers a full page
reload. Use `Link` for plain navigation, `NavLink` when the link needs to reflect
whether it's the currently-active route (nav bars, tabs):

```tsx
import { Link, NavLink } from "react-router";

// Plain navigation
<Link to={ROUTES.DASHBOARD}>Go to dashboard</Link>

// Active-state-aware navigation — isActive is provided by NavLink itself,
// never track "is this the current route" manually with useLocation
<NavLink
  to={ROUTES.DASHBOARD}
  className={({ isActive }) =>
    isActive ? navStyles.linkActive : navStyles.link
  }
>
  Dashboard
</NavLink>
```

A raw `<a>` is only correct for a genuinely external link (leaving the app
entirely), never for navigating between this app's own routes.

## Reading Route Data

- **Route params** (`/users/:userId`) — `useParams()`, never parse `window.location`
  manually
- **Query/search params** (`?page=2`) — `useSearchParams()`, which returns a
  `URLSearchParams` instance and a setter, not `useState` synced to
  `window.location.search`

```tsx
import { useParams, useSearchParams } from "react-router";

export const UserPage = (): ReactElement => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? "1";

  const goToNextPage = () => {
    setSearchParams({ page: String(Number(page) + 1) });
  };

  return (
    <div>
      <p>User {userId}, page {page}</p>
      <Button onClick={goToNextPage}>Next page</Button>
    </div>
  );
};
```

## Programmatic Navigation

Use `useNavigate()` for navigation triggered by code (after a form submits, after
an action completes) rather than a `Link` click. Use `useLocation()` to read the
current path/search/state when you need it outside of `useParams`/`useSearchParams`
(e.g. redirecting back to where the user came from):

```tsx
import { useLocation, useNavigate } from "react-router";

export const useProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onSuccess = () => {
    navigate(ROUTES.PRODUCTS);
  };

  const cameFrom = location.state?.from ?? ROUTES.PRODUCTS;

  return { onSuccess, cameFrom };
};
```

Never use `useEffect` + `navigate()` to redirect after a synchronous condition is
already known at render time — this project's `AsyncState<T>`/conditional-render
pattern (`core/10-error-handling.md`) should handle "show this or that" directly;
reach for `navigate()` only for a genuine navigation side effect (after a
successful mutation, after a timed-out session, etc.).

## Shared Layout Routes (distinct from the auth-guard layout route above)

A layout route isn't only for auth guarding — use the same nested-route +
`<Outlet />` pattern for any shared UI (a persistent header/nav wrapping several
sibling pages), so that shared chrome isn't duplicated inside every page
component:

```tsx
// src/components/layout/appShell/AppShell.tsx
import { Outlet } from "react-router";

export const AppShell = (): ReactElement => (
  <div className={appShellStyles.wrapper}>
    <SiteNav />
    <main className={appShellStyles.main}>
      <Outlet />
    </main>
  </div>
);
```

```tsx
// src/config/routes.tsx
<Route element={<AppShell />}>
  <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
  <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
</Route>
```

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

const PageLoader = (): ReactElement => <p>Loading…</p>;

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
- Never use a raw `<a href="...">` for in-app route navigation — use `Link`/`NavLink` (a raw `<a>` is only correct for a same-page anchor jump to a section, e.g. `href="#section-id"`, or a genuinely external link)
- Never track "is this the active route" manually with `useLocation` string comparison — `NavLink`'s own `isActive` render-prop already does this
- Never parse `window.location` or `location.search` manually — use `useParams()`/`useSearchParams()`
