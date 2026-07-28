---
description: Error handling — ErrorBoundary placement (app-level and per-route), AsyncState<T> pattern, service-layer error handling, action error returns. Always loaded.
---

# Error Handling

## Rules

- Always place an app-level `ErrorBoundary` at the root of the app in `App.tsx`
  (catches render errors anywhere, as a last-resort safety net)
- Always give a route with a `loader`/`action` its own `errorElement`/
  `ErrorBoundary` on the `RouteObject` — this catches loader/action failures
  *and* render errors in that route's subtree, closer to the failure than the
  app-level boundary, without replacing it
- Never let raw caught errors surface to the UI — always map to a typed error
  message
- Always handle async errors in the service layer — catch, transform, and
  rethrow as typed errors
- Never swallow errors silently — always log or surface them in a controlled
  way
- Use `AsyncState<T>` only for fetches that aren't tied to a route's own
  `loader` (e.g. a dialog's on-demand fetch, a modal's search-as-you-type) —
  route-tied fetching gets its pending/error state from the router itself
  (`useNavigation()` for navigation-triggered loads, `useFetcher().state` for
  non-navigating fetches/mutations), not a component-level `AsyncState<T>`
- An `action` should return `{ ok: boolean; error?: string }` (or similar) for
  *known* failures (e.g. the API rejected the request) rather than throwing —
  a failed mutation should surface as an inline message (e.g. a toast) next to
  the form, not send the user to the route's `ErrorBoundary`. Reserve
  throwing/letting an error propagate for genuinely unexpected failures, where
  the route-level `ErrorBoundary` is the right place for it to land
- Never use `any` in catch blocks — type caught errors as `unknown` and narrow
  before use

## Error Boundary Placement

```text
App.tsx                    ← app-level boundary (catches render errors across the whole app)
  └── routes                ← per-route errorElement/ErrorBoundary (catches that route's
                                loader/action errors + render errors in its subtree)
        └── components/     ← do not add boundaries here unless the component is truly isolated
```

Both boundaries coexist — the per-route one is not a replacement for the
app-level one. A route without its own `loader`/`action` (e.g. a purely
static page) doesn't need its own `errorElement`; the app-level boundary
already covers it.

## Per-Route Error Handling (data mode)

Every route with a `loader` or `action` gets an `ErrorBoundary` (or
`errorElement`) on its `RouteObject`, wired in `src/config/routes.tsx`:

```tsx
// src/config/routes.tsx
{
  path: ROUTES.PRODUCTS,
  lazy: async () => {
    const { ProductsPage, productsLoader, productsAction } = await import("@/pages/products");
    return { Component: ProductsPage, loader: productsLoader, action: productsAction };
  },
  HydrateFallback,
  ErrorBoundary: RouteErrorFallback,
},
```

`RouteErrorFallback` (`src/components/blocks/routeErrorFallback/`) is a
generic, reusable fallback — not tied to any one route's domain data — so the
same component wires into every route needing one:

```tsx
// src/components/blocks/routeErrorFallback/RouteErrorFallback.tsx
import { isRouteErrorResponse, useRouteError } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const getErrorMessage = (error: unknown): string => {
  if (isRouteErrorResponse(error)) {
    return error.data?.message ?? error.statusText ?? "Something went wrong";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

export const RouteErrorFallback = ({ title = "This page failed to load" }: RouteErrorFallbackProps) => {
  const error = useRouteError();
  return (
    <div className={styles.wrapper}>
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{getErrorMessage(error)}</AlertDescription>
      </Alert>
    </div>
  );
};
```

`isRouteErrorResponse()` distinguishes a thrown `Response`/`data()` result
(e.g. a loader doing `throw new Response("Not Found", { status: 404 })`) from
a plain thrown `Error` — handle both, since either can reach a route's
boundary.

## Action Error Returns vs Throwing (mutations)

A mutation's `action` distinguishes *known* failures (surfaced inline, next
to the form) from genuinely unexpected ones (let the route's `ErrorBoundary`
handle it):

```ts
// src/pages/products/ProductsPage.action.ts
export interface ProductsActionData {
  ok: boolean;
  error?: string;
}

export const productsAction = async ({ request }: ActionFunctionArgs): Promise<ProductsActionData> => {
  try {
    const formData = await request.formData();
    switch (request.method) {
      case "POST": {
        await createProduct(parseProductInput(formData));
        return { ok: true };
      }
      // ...PATCH, DELETE similarly
      default:
        return { ok: false, error: `Unsupported method: ${request.method}` };
    }
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong" };
  }
};
```

The component consuming this via `useFetcher()` reacts to `fetcher.data` once
`fetcher.state` returns to `"idle"`:

```tsx
useEffect(() => {
  if (fetcher.state !== "idle" || !fetcher.data) return;
  if (fetcher.data.ok) {
    toast.success("Product created");
  } else {
    toast.error(fetcher.data.error ?? "Something went wrong");
  }
}, [fetcher.state, fetcher.data]);
```

This keeps a failed mutation from ever hitting the route's `ErrorBoundary` —
the user stays on the form with a clear, local error message instead of
losing their in-progress edits to a full route-level error screen.

## Async State Pattern (non-route-tied fetches only)

`AsyncState<T>` is for fetches a `loader` doesn't already cover — an
on-demand fetch inside a modal, a search-as-you-type lookup, anything not
triggered by a route navigation. Add it to `src/types/common.types.ts`
alongside `ApiResponse<T>`:

```ts
// src/types/common.types.ts
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

```ts
// src/hooks/useUserSearch.ts — an on-demand lookup, not tied to any route's loader
import { useState } from "react";
import { getUserProfile } from "@/services/user/userService";
import { mapUserDto } from "@/services/mappers/userMapper";
import type { AsyncState } from "@/types/common.types";
import type { UserProfile } from "@/types/user.types";

export const useUserSearch = () => {
  const [state, setState] = useState<AsyncState<UserProfile>>({ status: "idle" });

  const search = async (id: string) => {
    setState({ status: "loading" });
    try {
      const response = await getUserProfile(id);
      setState({ status: "success", data: mapUserDto(response.data) });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setState({ status: "error", message });
    }
  };

  return { state, search };
};
```

If the same data would also be needed on initial page load (i.e. it's really
route-tied), it belongs in a `loader` instead — don't reach for `AsyncState<T>`
just because a hook is a familiar shape.

## Service Layer Error Handling

```ts
// src/services/user/userService.ts
import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/constants";
import type { ApiResponse } from "@/types/common.types";
import type { UserDto } from "./types";

export const getUserProfile = async (id: string): Promise<ApiResponse<UserDto>> => {
  try {
    const response = await apiClient.get<UserDto>(`${API_ENDPOINTS.USER_PROFILE}/${id}`);
    return { status: response.status, data: response.data, message: "OK" };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error in getUserProfile");
  }
};
```

## ErrorBoundary Component (app-level)

Place in `src/components/shared/errorBoundary/` following the component file
contract (5-file — Storybook is fixed off for this template):

```tsx
// src/components/shared/errorBoundary/ErrorBoundary.tsx
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { hasError: true, message };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <p role="alert">{this.state.message}</p>;
    }
    return this.props.children;
  }
}
```

This app-level boundary is a React class component (`getDerivedStateFromError`
requires it) and only catches render errors — it can't catch loader/action
errors, which is exactly why every data-fetching route also needs its own
`errorElement`/`ErrorBoundary` above.
