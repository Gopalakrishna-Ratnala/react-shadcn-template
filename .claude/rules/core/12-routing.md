---
description: Routing — React Router v8 data mode (createBrowserRouter/RouterProvider), loader-based route protection, lazy loading, ROUTES constants. Always loaded.
---

# Routing & Protected Routes

## Stack

- Always use **React Router v8** (`react-router`) in **data mode** for all
  client-side navigation — `createBrowserRouter([...])` + `<RouterProvider>`,
  not the declarative `<BrowserRouter>` + JSX `<Routes>`/`<Route>` API. Confirm
  the installed version in `package.json` before writing version-specific
  code, since the API has changed across major versions
- Always define all routes centrally in `src/config/routes.tsx` as a
  `RouteObject[]` — never scatter route definitions across pages or components
- Always lazy-load page components (and their `loader`/`action`, when they
  have one) via each route's own `lazy: () => import(...)` — never eagerly
  import pages, and never use `React.lazy` + `Suspense` for this (data mode's
  route-level `lazy` replaces that adapter; see `core/10-error-handling.md`
  and `docs/PROJECT-CONTEXT.md` Section 25 for the full migration rationale)

## Router Setup in App.tsx

`createBrowserRouter` builds the router once, at module scope, in
`src/config/routes.tsx`; `App.tsx` renders it with `<RouterProvider>` — there
is no `<BrowserRouter>` wrapper in data mode, and `RouterProvider` replaces it
as the single router root:

```tsx
// src/config/routes.tsx
import { createBrowserRouter } from "react-router";
import { ROUTES } from "@/constants";
import { HydrateFallback } from "./routeFallback";
import type { RouteObject } from "react-router";

const routes: RouteObject[] = [
  {
    path: ROUTES.PRODUCTS,
    lazy: async () => {
      const { ProductsPage, productsLoader, productsAction } = await import("@/pages/products");
      return { Component: ProductsPage, loader: productsLoader, action: productsAction };
    },
    HydrateFallback,
  },
];

export const router = createBrowserRouter(routes);
```

```tsx
// src/App.tsx
import { RouterProvider } from "react-router";
import { router } from "@/config/routes";

export const App = (): ReactElement => {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
};
```

- Only one `router`/`<RouterProvider>` per app, built once at module scope —
  never inside a component or recreated on render
- Global providers that aren't part of the routed page tree (theme, toasts,
  the app-level `ErrorBoundary`) sit as siblings around `<RouterProvider>`,
  not inside any route — they don't belong to any single route's subtree
- Give every route with a `loader`/`action` a `HydrateFallback` (first-load
  pending UI) and an `ErrorBoundary` (per `core/10-error-handling.md`) — a
  route with neither doesn't need either

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

Route params/search params are also directly available inside a `loader`/
`action` via that function's own `params`/`request` arguments — prefer reading
them there when the value decides *what data to fetch or mutate* (as
`ProductsPage.loader.ts` does with its `?q=` search param), and reserve
`useParams()`/`useSearchParams()` in the component for values that only affect
rendering/interaction, not data fetching.

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

Inside a `loader`/`action` itself, use `redirect()` (or `throw redirect()` when
the redirect needs to happen before any data is returned — see Protected
Routes below) instead of `useNavigate()`, which is a component-only hook and
isn't available in that context.

Never use `useEffect` + `navigate()` to redirect after a synchronous condition is
already known at render time — this project's `AsyncState<T>`/conditional-render
pattern (`core/10-error-handling.md`) should handle "show this or that" directly;
reach for `navigate()` only for a genuine navigation side effect (after a
successful mutation, after a timed-out session, etc.).

## Shared Layout Routes (distinct from the auth-guard layout route below)

A layout route isn't only for auth guarding — use the same nested-route +
`<Outlet />` pattern for any shared UI (a persistent header/nav wrapping several
sibling pages), so that shared chrome isn't duplicated inside every page
component. In data mode this is a parent `RouteObject` with a `children` array,
not JSX `<Route>` nesting:

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
{
  lazy: async () => {
    const { AppShell } = await import("@/components/layout/appShell");
    return { Component: AppShell };
  },
  children: [
    { path: ROUTES.PRODUCTS, lazy: async () => {/* ... */} },
    { path: ROUTES.SETTINGS, lazy: async () => {/* ... */} },
  ],
},
```

## Route Types

| Type | Description |
|---|---|
| **Public route** | Accessible to anyone — no auth required (e.g. Login, Signup) |
| **Protected route** | Requires authenticated session — redirects to login if unauthenticated |

## Protected Route Pattern

Data mode's idiomatic guard is a **layout route whose own `loader` checks auth
and redirects before anything renders** — not a component that renders
`<Navigate>` after the fact. This is a genuine improvement over the old
render-time check: there's no flash of protected content while a component
mounts and decides whether to redirect, since the redirect happens in the
`loader`, before the route's `Component` is ever rendered.

Build `ProtectedLayout` in `src/components/layout/protectedLayout/` — it has
no visual UI of its own beyond `<Outlet />`, so it skips `.styles.ts` like any
logic-only component, plus its own `.loader.ts` since it owns a route
`loader`:

```text
protectedLayout/
├── ProtectedLayout.tsx
├── ProtectedLayout.loader.ts
├── types.ts
├── ProtectedLayout.test.tsx
└── index.ts
```

```tsx
// src/components/layout/protectedLayout/ProtectedLayout.tsx
import { Outlet } from "react-router";

export const ProtectedLayout = (): ReactElement => <Outlet />;
```

```ts
// src/components/layout/protectedLayout/ProtectedLayout.loader.ts
import { redirect } from "react-router";
import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants";
import type { LoaderFunctionArgs } from "react-router";

export const protectedLayoutLoader = async ({
  request,
}: LoaderFunctionArgs): Promise<null> => {
  // Adapt to your chosen auth/session mechanism — await it here if the
  // session needs to be rehydrated (e.g. from a cookie or localStorage). The
  // router's own pending state (HydrateFallback / navigation loading UI)
  // covers this wait; there's no separate "isLoading" render branch to write,
  // since the check happens before render rather than inside it.
  const { user } = useAuthStore.getState();

  if (!user) {
    const from = new URL(request.url).pathname;
    throw redirect(`${ROUTES.LOGIN}?from=${encodeURIComponent(from)}`);
  }

  return null;
};
```

Wire it as a parent route wrapping every protected child:

```tsx
// src/config/routes.tsx
{
  lazy: async () => {
    const { ProtectedLayout, protectedLayoutLoader } = await import("@/components/layout/protectedLayout");
    return { Component: ProtectedLayout, loader: protectedLayoutLoader };
  },
  children: [
    { path: ROUTES.DASHBOARD, lazy: async () => {/* ... */} },
    { path: ROUTES.SETTINGS, lazy: async () => {/* ... */} },
  ],
},
```

After a successful login, redirect back to wherever the guard sent the user
from, using the `?from=` param the loader set:

```tsx
// src/pages/login/LoginPage.tsx (sketch — adapt to the actual login action)
const [searchParams] = useSearchParams();
const from = searchParams.get("from") ?? ROUTES.DASHBOARD;
// on successful login: navigate(from, { replace: true });
```

## Route Config Pattern

```tsx
// src/config/routes.tsx
import { createBrowserRouter } from "react-router";
import { ROUTES } from "@/constants";
import { HydrateFallback } from "./routeFallback";
import type { RouteObject } from "react-router";

const routes: RouteObject[] = [
  // Public route
  {
    path: ROUTES.LOGIN,
    lazy: async () => {
      const { LoginPage } = await import("@/pages/login");
      return { Component: LoginPage };
    },
    HydrateFallback,
  },

  // Protected routes — all children require auth
  {
    lazy: async () => {
      const { ProtectedLayout, protectedLayoutLoader } = await import("@/components/layout/protectedLayout");
      return { Component: ProtectedLayout, loader: protectedLayoutLoader };
    },
    children: [
      {
        path: ROUTES.DASHBOARD,
        lazy: async () => {
          const { DashboardPage } = await import("@/pages/dashboard");
          return { Component: DashboardPage };
        },
        HydrateFallback,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
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

- Always build the router once, at module scope, with `createBrowserRouter` —
  never recreate it inside a component or on render
- Always render it with a single `<RouterProvider>` at the app root — never a
  `<BrowserRouter>`/`<Routes>`/`<Route>` tree
- Always use `<Outlet />` in a layout route's component (`ProtectedLayout`,
  `AppShell`, etc.) — never render children directly
- Always guard protected routes with a parent route's `loader` throwing
  `redirect()` — never a component that checks auth state and conditionally
  renders `<Navigate>` after mount (that reintroduces the flash-of-protected-
  content problem the loader-based guard exists to avoid)
- Never check auth state directly inside a page component — delegate to the
  protected layout route's `loader`
- Never put redirect-for-auth logic inside a hook or `useEffect` — it belongs
  in the route guard's `loader`
- Always place the auth guard as a layout route (with a `children` array)
  wrapping all protected paths — never repeat the guard per page
- Never use `useEffect` + `navigate()` inside a page to guard it — use the
  protected layout route instead
- Never duplicate route path strings — always import from `ROUTES` constants
- Never use a raw `<a href="...">` for in-app route navigation — use `Link`/`NavLink` (a raw `<a>` is only correct for a same-page anchor jump to a section, e.g. `href="#section-id"`, or a genuinely external link)
- Never track "is this the active route" manually with `useLocation` string comparison — `NavLink`'s own `isActive` render-prop already does this
- Never parse `window.location` or `location.search` manually — use `useParams()`/`useSearchParams()` in components, or a loader's/action's own `params`/`request` when the value drives data fetching or mutation
