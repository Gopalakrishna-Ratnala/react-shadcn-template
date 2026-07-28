---
description: API service layer — one service per domain, typed returns, error handling, stateless functions. Active when using the API service + data layer pattern.
paths: ["src/services/**/*.ts", "src/hooks/**/*.ts"]
---

# API Services

## Rules

- Always place all service functions in `src/services/<domain>/` — one file per domain (e.g. `productService.ts`)
- Never call a service function directly from a UI component — always go through a hook
- Never hardcode endpoint strings inline — always define them in `src/constants/api.constants.ts`
- Always type every service function's return value explicitly — return `ApiResponse<T>` (defined in `src/types/common.types.ts`)
- Always handle errors in the service layer — do not let raw exceptions surface to the UI
- Always keep service functions pure and stateless — no component state, no JSX, no router logic

## Structure

```text
src/services/
├── apiClient.ts               # Central fetch-based HTTP client (see 01-fetch-client.md)
├── product/
│   ├── productService.ts      # Service functions
│   ├── types.ts               # Raw API response types (DTO)
│   ├── mocks.ts                # Typed mock data (when using data layer pattern)
│   └── index.ts                # Barrel export
├── mappers/
│   └── productMapper.ts
└── index.ts
```

## Pattern

```ts
// src/services/product/types.ts — raw API shape (DTO), matches json-server's db.json shape
export interface ProductDto {
  id: number;
  product_name: string;
  unit_price: number;
}
```

```ts
// src/services/product/productService.ts
import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/constants";
import type { ApiResponse } from "@/types/common.types";
import type { ProductDto } from "./types";

export const getProducts = async (): Promise<ApiResponse<ProductDto[]>> => {
  try {
    const data = await apiClient.get<ProductDto[]>(API_ENDPOINTS.PRODUCTS);
    return { status: 200, data, message: "OK" };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error in getProducts");
  }
};
```

```ts
// src/hooks/useProducts.ts — imports directly from the service file, not a barrel
import { getProducts } from "@/services/product/productService";
import { mapProductDtoToProduct } from "@/services/mappers/productMapper";
import type { Product } from "@/types/product.types";

export const useProducts = () => {
  const fetchProducts = async (): Promise<Product[]> => {
    const response = await getProducts();
    return response.data.map(mapProductDtoToProduct);
  };

  return { fetchProducts };
};
```
