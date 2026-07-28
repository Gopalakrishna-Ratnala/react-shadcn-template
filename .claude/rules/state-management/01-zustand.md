---
description: Zustand state management — store structure, domain-focused stores, async actions, no direct mutation. Fixed for this template, always active when editing stores.
paths: ["src/store/**/*.ts", "src/hooks/**/*.ts"]
---

# Zustand Rules

Zustand is fixed for this template — not a per-project choice. See
`state-management/README.md` for why. **Once a project has real stores using it,
never suggest switching to a different state management library** — that decision
is made once, at project start, and kept for the project's lifetime.

## Mandatory Zustand Usage Principles

Use Zustand for:

- client-side shared UI state
- filters *(the filter/search-input value itself — not the filtered data a
  route's loader already fetched; see the boundary below)*
- modal/drawer state
- lightweight cross-component state
- cached view state when appropriate

Do not use Zustand for:

- local one-component-only state
- uncontrolled form field state already owned by RHF
- duplicating backend response state without purpose
- **route-tied server data that a route's own `loader` already fetched** —
  read it via `useLoaderData()`/`useRouteLoaderData()` instead of copying it
  into a store (see "The Loader/Store Boundary" below)

## Store Structure Requirements

Each store MUST define:

- state type
- actions type
- initial state
- typed selectors where useful
- no direct mutation
- no unrelated mixed concerns in one store

## Recommended Store File Pattern

```text
src/store/
├── featureName/
│   ├── featureStore.ts
│   ├── types.ts
│   └── index.ts
└── index.ts              # Root barrel export
```

## Store Rules

- Keep stores focused by domain
- Prefer small stores over one giant global store
- Select only required slices in components
- Avoid selecting the whole store object
- Use derived selectors when repeated
- Persist state only when justified and approved by project conventions
- Async actions may call services, but UI components should not duplicate that logic

## Example Pattern

```typescript
import { create } from "zustand";

import type { UserModel } from "@/types/user.types";

interface UserState {
  user: UserModel | null;
  isLoading: boolean;
  errorMessage: string | null;
  setUser: (user: UserModel | null) => void;
  setLoading: (isLoading: boolean) => void;
  setErrorMessage: (errorMessage: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  errorMessage: null,
  setUser: (user) => {
    set({ user });
  },
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  setErrorMessage: (errorMessage) => {
    set({ errorMessage });
  },
}));
```

This shape (state a route's `loader` doesn't already own — e.g. the current
user's session, established once at login and read across many pages
regardless of which route loaded) is exactly what Zustand is for. Contrast
with the boundary below for state a `loader` *does* already own.

## The Loader/Store Boundary

If a route has its own `loader`, the data that `loader` fetches lives in
`useLoaderData()` — never copy it into a Zustand store "just in case" another
component needs it too. Duplicating it means two sources of truth that can
drift out of sync, and the router already handles revalidation (after a
`fetcher`/`Form` submission, on navigation) for the loader's copy — a
store's copy wouldn't get that for free.

What *does* belong in a store, even on a loader-backed page, is UI state that
isn't itself server data — a search/filter input's live value, for instance.
This is the actual pattern used for the Products catalog (`src/store/
productFilters/`, `src/pages/products/`):

```typescript
// src/store/productFilters/productFiltersStore.ts
import { create } from "zustand";
import type { ProductFiltersStore } from "./types";

// Holds only the transient search-input text — NOT the fetched products
// themselves, which live in ProductsPage.loader.ts's useLoaderData().
export const useProductFiltersStore = create<ProductFiltersStore>((set) => ({
  searchTerm: "",
  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  },
  clearSearchTerm: () => {
    set({ searchTerm: "" });
  },
}));
```

```tsx
// src/pages/products/ProductsPage.tsx
export const ProductsPage = (): ReactElement => {
  // Server data: read from the loader, never duplicated into Zustand.
  const { products, searchTerm } = useLoaderData<typeof productsLoader>();
  // UI state: the store, since it's not itself server data.
  const storeSearchTerm = useProductFiltersStore((state) => state.searchTerm);
  const setSearchTerm = useProductFiltersStore((state) => state.setSearchTerm);
  // ...
};
```

```typescript
// ❌ WRONG — the loader already owns this; a store copy is a second,
// driftable source of truth that the router's revalidation won't keep in sync
interface ProductsState {
  products: Product[]; // ← duplicates ProductsPage.loader.ts's useLoaderData()
  setProducts: (products: Product[]) => void;
}
```

## Async Zustand Action Guidance

When async actions are placed inside stores:

- call typed services only
- set loading/error states explicitly
- reset stale error state before request
- never update unrelated store branches
- never embed JSX or router logic in store actions
- if the async data would also be needed on a route's initial load, it likely
  belongs in that route's `loader` instead of a store action — see the
  boundary above
