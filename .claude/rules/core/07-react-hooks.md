---
description: React component responsibilities and hooks requirements — presentational vs container, hook coordination rules. Loaded when editing components or hooks.
paths: ["src/**/*.tsx", "src/hooks/**/*.ts"]
---

# React and Hooks Rules

## Component Responsibilities

### Presentational Components

- receive props
- render UI
- contain minimal local UI behavior only
- do not fetch data directly
- do not own shared business state

### Container or Feature Orchestration Components

- may consume hooks, stores, services through hooks
- prepare data and handlers for presentational children
- remain thin and readable

## Hooks Requirements

Shared hooks belong in `src/hooks/**` when reused or feature-significant.

Hooks may coordinate:

- store selectors/actions
- route behavior
- form wiring
- API orchestration
- memoized transformations

Hooks MUST NOT:

- render JSX
- hide critical side effects unexpectedly
- return unstable anonymous structures when avoidable
- duplicate store/service behavior already implemented elsewhere

## useEffect Rules

- Never use `useEffect` to compute derived state — use `useMemo` instead
- Never use `useEffect` to respond to a user event — handle it in the event callback directly
- Always return a cleanup function when registering subscriptions, timers, or event listeners inside `useEffect`
- Always keep the dependency array exhaustive — include every value from the component scope that the effect reads
- Never omit the dependency array to run the effect on every render — this is almost always a bug
- Prefer encapsulating `useEffect` logic inside a custom hook rather than writing it directly in a component

```ts
// WRONG — useEffect for derived state
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// CORRECT — useMemo for derived state
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);

// WRONG — no cleanup for a subscription
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, [handleResize]);

// CORRECT — cleanup returned
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [handleResize]);
```

## Examples

### Correct: page load data fetching — a route `loader`, not a hook

If a page needs this data as soon as it loads (the common case for a list
page, a detail page, anything shown on first render), it belongs in that
route's `loader`, not a `useEffect`-driven hook. Fetching starts the moment
the route matches — before the component even mounts — and the page reads it
back with `useLoaderData()`:

```typescript
// src/pages/products/ProductsPage.loader.ts
import type { LoaderFunctionArgs } from "react-router";
import { mapProductDtoToProduct } from "@/services/mappers/productMapper";
import { getProducts } from "@/services/product";
import type { Product } from "@/types/product.types";

export interface ProductsLoaderData {
  products: Product[];
  searchTerm: string;
}

export const productsLoader = async ({ request }: LoaderFunctionArgs): Promise<ProductsLoaderData> => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q") ?? "";
  const response = await getProducts(searchTerm || undefined);
  return { products: response.data.map(mapProductDtoToProduct), searchTerm };
};
```

```tsx
// src/pages/products/ProductsPage.tsx
export const ProductsPage = (): ReactElement => {
  const { products, searchTerm } = useLoaderData<typeof productsLoader>();
  const navigation = useNavigation(); // pending state, instead of AsyncState<T>
  // ...
};
```

Wire the loader into the route in `src/config/routes.tsx` (see
`core/12-routing.md`). No `useEffect`, no `AsyncState<T>`, no data-fetching
hook needed for this case — the router itself owns the fetch lifecycle.

### Correct: genuinely shared, not-page-load-tied state — still a hook + store

Reach for a hook coordinating a Zustand store when the state **isn't tied to
a single route's load** but needs to be read across many pages regardless of
navigation — the current user's session is the standard example, since it's
established once (e.g. at login) and then read everywhere, not re-fetched
each time a page loads:

```typescript
import { useCallback } from "react";

import { useUserStore } from "@/store/user";
import { getUser } from "@/services/user/userService";
import { mapUserDtoToUser } from "@/services/mappers/userMapper";
import type { AsyncState } from "@/types/common.types";
import type { UserModel } from "@/types/user.types";

interface UseUserResult {
  state: AsyncState<UserModel>;
  fetchUser: (id: string) => Promise<void>;
}

export const useUser = (): UseUserResult => {
  const state = useUserStore((state) => state.userState);
  const setState = useUserStore((state) => state.setUserState);

  const fetchUser = useCallback(async (id: string): Promise<void> => {
    setState({ status: "loading" });
    try {
      const response = await getUser(id);
      setState({ status: "success", data: mapUserDtoToUser(response.data) });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setState({ status: "error", message });
    }
  }, [setState]);

  return { state, fetchUser };
};
```

### Correct: an on-demand fetch that isn't tied to any route's load

A modal's search-as-you-type, a "load more" button, anything triggered by a
user action rather than a navigation — this is `AsyncState<T>`'s actual remit
now (see `core/10-error-handling.md`). Keep it page-local `useState` unless
it's also genuinely needed elsewhere:

```typescript
import { useCallback, useState } from "react";

import { getUser } from "@/services/user/userService";
import { mapUserDtoToUser } from "@/services/mappers/userMapper";
import type { AsyncState } from "@/types/common.types";
import type { UserModel } from "@/types/user.types";

interface UseUserLookupResult {
  state: AsyncState<UserModel>;
  lookupUser: (id: string) => Promise<void>;
}

export const useUserLookup = (): UseUserLookupResult => {
  const [state, setState] = useState<AsyncState<UserModel>>({ status: "idle" });

  const lookupUser = useCallback(async (id: string): Promise<void> => {
    setState({ status: "loading" });
    try {
      const response = await getUser(id);
      setState({ status: "success", data: mapUserDtoToUser(response.data) });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setState({ status: "error", message });
    }
  }, []);

  return { state, lookupUser };
};
```

### Wrong: Hook that duplicates store logic

```typescript
// ❌ BAD — duplicates store selectors inline and makes raw HTTP calls
export const useUser = () => {
  const [user, setUser] = useState(null);      // duplicates store state
  useEffect(() => {
    fetch("/users/1").then((r) => r.json()).then(setUser); // raw HTTP call in hook
  }, []);
  return user;
};
```

### Wrong: a data-fetching hook for data the page needs on first load

```typescript
// ❌ BAD — this data is needed the moment the page loads; it belongs in a
// route loader (see above), not a useEffect-driven hook with its own
// loading/error state that duplicates what the router already tracks
export const useProducts = () => {
  const [state, setState] = useState<AsyncState<Product[]>>({ status: "idle" });
  useEffect(() => {
    setState({ status: "loading" });
    getProducts().then((response) => setState({ status: "success", data: response.data }));
  }, []);
  return state;
};
```
