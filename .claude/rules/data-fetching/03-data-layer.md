---
description: Data layer architecture — db.json → service → mapper → hook → UI flow, DTOs, domain models, ApiResponse<T> end-to-end. Active when using the API service + data layer pattern.
paths: ["src/services/**/*.ts", "src/hooks/**/*.ts", "src/types/**/*.ts"]
---

# Data Layer Architecture

## Purpose

Decouples the UI from the API response shape. json-server (a real local HTTP server,
not synchronous mock functions — see `01-fetch-client.md`) can be swapped for a real
production backend without touching any UI code — only the service and mapper need
updating, since both already speak in `ApiResponse<T>` and a stable domain model.

## Layer Flow

```
db.json (via json-server)  →  Service Layer  →  Mapper Layer  →  Hook  →  UI
```

| Layer | Location | Responsibility |
|---|---|---|
| **Seed/fixture data** | `db.json` (root) — served live by json-server; `src/services/<domain>/mocks.ts` — typed fixtures for unit tests | `db.json` is the actual runtime data source in dev; `mocks.ts` is test-only, never imported at runtime |
| **Service** | `src/services/<domain>/` | Calls `apiClient` (real async HTTP against json-server), returns `ApiResponse<T>` |
| **Mapper** | `src/services/mappers/` | Transforms raw DTO into a stable domain model |
| **Hook** | `src/hooks/` | Calls service → passes to mapper → returns domain model to UI |
| **UI** | `src/components/`, `src/pages/` | Consumes domain model only — never raw DTO |

**Important shift from a purely-mocked architecture:** `mocks.ts` is no longer where
runtime data comes from — it's test-only fixture data for unit tests that mock
`fetch` (see `apiClient.test.ts` for the pattern). The actual data the app sees while
developing comes from a real network call to json-server, which is itself backed by
`db.json`. This means loading states, network errors, and timeouts are all genuinely
exercised during development, not just simulated.

## ApiResponse\<T\> Contract

All services return `ApiResponse<T>` defined in `src/types/common.types.ts`:

```ts
// src/types/common.types.ts
export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
  error?: string;
}
```

Hooks unwrap `.data` before storing in state. Raw `ApiResponse<T>` never reaches UI components.

## Directory Structure

```text
src/
├── services/
│   ├── product/
│   │   ├── productService.ts   # Calls apiClient, returns ApiResponse<ProductDto[]>
│   │   ├── types.ts            # ProductDto (raw API shape / DTO, matches db.json)
│   │   ├── mocks.ts            # Typed fixtures for unit tests only
│   │   └── index.ts
│   ├── mappers/
│   │   └── productMapper.ts    # ProductDto -> Product
│   └── index.ts
├── types/
│   ├── common.types.ts         # ApiResponse<T>, AsyncState<T>
│   ├── product.types.ts        # Product (domain model — UI-facing)
│   └── index.ts
```

## Rules

- Always define `db.json`'s resource shape to match `services/<domain>/types.ts` (DTO types) — the DTO is a contract with the mock backend, not an arbitrary type
- Always store test fixtures as typed constants in `src/services/<domain>/mocks.ts` — used only by that domain's tests, never imported by app code
- Always define domain model types in `src/types/` — these are what the UI sees
- Always write a mapper that converts the DTO → domain model in `src/services/mappers/`
- Never let a raw DTO reach a UI component or hook return value
- Never duplicate mapping logic — one mapper per domain, reused everywhere

## Full Pattern

```ts
// src/types/product.types.ts — stable domain model (UI-facing)
export interface Product {
  id: number;
  name: string;
  priceInCents: number;
}
```

```ts
// src/services/product/types.ts — raw API shape (DTO), matches db.json's "products" key
export interface ProductDto {
  id: number;
  product_name: string;
  unit_price: number;
}
```

```json
// db.json (excerpt) — this is what json-server actually serves at GET /products
{
  "products": [
    { "id": 1, "product_name": "Desk Lamp", "unit_price": 24.99 }
  ]
}
```

```ts
// src/services/product/productService.ts
import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/constants";
import type { ApiResponse } from "@/types/common.types";
import type { ProductDto } from "./types";

export const getProducts = async (): Promise<ApiResponse<ProductDto[]>> => {
  const data = await apiClient.get<ProductDto[]>(API_ENDPOINTS.PRODUCTS);
  return { status: 200, data, message: "OK" };
};
```

```ts
// src/services/mappers/productMapper.ts
import type { ProductDto } from "@/services/product/types";
import type { Product } from "@/types/product.types";

export const mapProductDtoToProduct = (dto: ProductDto): Product => ({
  id: dto.id,
  name: dto.product_name,
  priceInCents: Math.round(dto.unit_price * 100),
});
```

```ts
// src/hooks/useProducts.ts
import { getProducts } from "@/services/product/productService";
import { mapProductDtoToProduct } from "@/services/mappers/productMapper";
import type { Product } from "@/types/product.types";

export const useProducts = () => {
  const fetchProducts = async (): Promise<Product[]> => {
    const response = await getProducts();
    return response.data.map(mapProductDtoToProduct); // UI always gets Product[], never ProductDto[]
  };

  return { fetchProducts };
};
```

## Swapping json-server → a Real Backend

1. Update `.env.local`'s `VITE_API_BASE_URL` to point at the real backend
2. Update `src/services/<domain>/<domainService>.ts` if the real API shape differs from
   the DTO — update `services/<domain>/types.ts` and
   `services/mappers/<domainMapper>.ts` accordingly
3. UI components and hooks require **no changes** — they only ever saw the domain model
