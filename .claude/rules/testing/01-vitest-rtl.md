---
description: Testing rules — required coverage, provider setup, store/service/hook test patterns. Loaded when editing test files.
paths: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/*.spec.ts", "src/**/*.spec.tsx"]
---

# Testing Rules

## Every Component MUST Have Tests

Required coverage:

- renders correctly with default props
- renders variants and states
- handles interactions
- supports keyboard interaction
- includes accessibility assertions
- handles edge cases and error states
- 100% code coverage

### Mandatory Test Case Matrix — Components

For every `ComponentName.test.tsx`, ALL of the following MUST be covered:

- [ ] **Default render** — all primary content is present
- [ ] **Each meaningful prop variant** — e.g. `disabled`, `empty`, `loading`, `error`
- [ ] **Every user interaction that triggers a callback** — click, change, submit
- [ ] **Conditional rendering branches** — e.g. empty state, error state, loading state

### Mandatory Test Case Matrix — Pages

For every `PageName.test.tsx`, ALL of the following MUST be covered:

- [ ] **Renders without crashing** with mocked hooks
- [ ] **Each named section / heading** is present
- [ ] **Each interactive element** (button, link, form submit) is present and labelled correctly
- [ ] **Error state and loading state** render correctly
- [ ] **If the route has a `loader`/`action`**: the page test renders it via
      `createMemoryRouter` with the *real* `loader`/`action` wired in (not a
      stubbed page component) — mock only the service layer underneath, so the
      test proves the actual data-fetching/mutation wiring, not just that a
      mock function got called. The `loader`/`action` themselves also get
      their own dedicated test file — see "Testing Loaders and Actions" below.

### Mandatory Test Case Matrix — Hooks

Every hook MUST have a co-located `useHookName.test.ts` file. Missing test = incomplete hook.

For every `useHookName.test.ts`, ALL of the following MUST be covered:

- [ ] **Initial state values** are correct
- [ ] **Each exported action** mutates state as expected
- [ ] **Async actions** handle both success and error paths

## Required Render Setup

Wrap all renders with your app's root providers (theme provider, etc.):

```tsx
import { type ReactElement } from "react";
import { render } from "@testing-library/react";

// Wrap with your chosen UI library's provider and any other root providers
// e.g. ThemeProvider, QueryClientProvider
const renderWithProviders = (ui: ReactElement) =>
  render(<AppProviders>{ui}</AppProviders>);
```

**For anything using router context** (a page reading `useLoaderData()`, a
component calling `useFetcher()`/`useNavigate()`, etc.) — don't wrap with a
generic router provider; build a `createMemoryRouter` with the actual route
shape (`path`, `loader`, `action`, `Component`) and render that with
`RouterProvider`. See "Testing Loader-Backed Pages" below for the full
pattern — a bare `<MemoryRouter>` wrapper doesn't give these hooks anything to
read from.

## Testing Loaders and Actions

A route's `loader`/`action` is a plain async function — test it directly by
calling it with a real `Request` (and `FormData` for actions), mocking the
service layer underneath. No component, no router, needed for this test file:

```typescript
// src/pages/products/ProductsPage.loader.test.ts
import { describe, expect, it, vi } from "vitest";
import { getProducts } from "@/services/product";
import { productsLoader } from "./ProductsPage.loader";

vi.mock("@/services/product", () => ({ getProducts: vi.fn() }));

describe("productsLoader", () => {
  it("passes the ?q= param through to the service and echoes it back", async () => {
    vi.mocked(getProducts).mockResolvedValueOnce({ status: 200, data: [], message: "OK" });

    const result = await productsLoader({
      request: new Request("http://localhost/products?q=lamp"),
      params: {},
      context: {} as never,
    });

    expect(getProducts).toHaveBeenCalledWith("lamp");
    expect(result).toEqual({ searchTerm: "lamp", products: [] });
  });
});
```

```typescript
// src/pages/products/ProductsPage.action.test.ts
import { describe, expect, it, vi } from "vitest";
import { createProduct } from "@/services/product";
import { productsAction } from "./ProductsPage.action";

vi.mock("@/services/product", () => ({ createProduct: vi.fn() /* ... */ }));

describe("productsAction", () => {
  it("POST creates a product from the form fields", async () => {
    vi.mocked(createProduct).mockResolvedValueOnce({ status: 201, data: /* ... */, message: "Created" });

    const body = new URLSearchParams({ name: "Desk", category: "Furniture", price: "99", inStock: "true" });
    const result = await productsAction({
      request: new Request("http://localhost/products", { method: "POST", body }),
      params: {},
      context: {} as never,
    });

    expect(createProduct).toHaveBeenCalledWith({ name: "Desk", category: "Furniture", price: 99, inStock: true });
    expect(result).toEqual({ ok: true });
  });
});
```

Cover the error path too — a mocked service rejection should produce the
action's `{ ok: false, error }` return (per `core/10-error-handling.md`), not
an uncaught throw.

## Testing Loader-Backed Pages

Use `createMemoryRouter` with the route's real `loader`/`action` and the page
`Component`, mocking only the service layer (the actual network boundary) —
this exercises the real `useLoaderData()`/`useFetcher()` wiring, not a stub:

```tsx
// src/pages/products/ProductsPage.test.tsx
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { getProducts } from "@/services/product";
import { ProductsPage } from "./ProductsPage";
import { productsAction } from "./ProductsPage.action";
import { productsLoader } from "./ProductsPage.loader";

vi.mock("@/services/product", () => ({ getProducts: vi.fn(), createProduct: vi.fn() /* ... */ }));

const renderProductsPage = () => {
  const router = createMemoryRouter(
    [{ path: "/products", loader: productsLoader, action: productsAction, Component: ProductsPage }],
    { initialEntries: ["/products"] },
  );
  return render(<RouterProvider router={router} />);
};

describe("ProductsPage", () => {
  it("renders every fetched product", async () => {
    vi.mocked(getProducts).mockResolvedValueOnce({ status: 200, data: [/* ... */], message: "OK" });
    renderProductsPage();
    expect(await screen.findByText(/* product name */)).toBeInTheDocument();
  });
});
```

For a component that uses `useFetcher()` but isn't itself the routed page
(e.g. a dialog rendered inside it, like `ProductFormDialog`), give the test's
`createMemoryRouter` a route whose `action` is the real function under test —
not a bare `vi.fn()` returning `{ ok: true }` — so the assertions cover the
actual `FormData`/HTTP method the component sends, not just that some mock
was called:

```tsx
const router = createMemoryRouter(
  [{ path: ROUTES.PRODUCTS, action: productsAction, Component: () => <ProductFormDialog open onOpenChange={vi.fn()} mode="create" /> }],
  { initialEntries: [ROUTES.PRODUCTS] },
);
```

A route with an `errorElement`/`ErrorBoundary` should also get a test that
forces its `loader` to throw and asserts the fallback renders — see
`RouteErrorFallback.test.tsx` for the pattern (per `core/10-error-handling.md`).

## Additional Testing Requirements

### For Store Consumers

- reset store state between tests if needed
- do not leak state across test cases
- test selector-driven UI updates
- if the store only holds UI state alongside a loader-backed page (e.g. a
  search input's live value, per `state-management/01-zustand.md`'s
  loader/store boundary), the page test resets it the same way — see
  `productFiltersStore`'s `afterEach` reset in `ProductsPage.test.tsx`

### For Service/HTTP Logic

- mock service layer or network boundary consistently
- do not hit real endpoints
- verify success, loading, and failure behaviors

### For Hooks

- test observable behavior, not implementation details
- verify async transitions explicitly
