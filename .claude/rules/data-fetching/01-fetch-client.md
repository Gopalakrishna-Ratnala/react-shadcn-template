---
description: Fetch-based HTTP client architecture — central apiClient, typed requests, error handling, json-server as the local mock backend. Loaded when editing services.
paths: ["src/services/**/*.ts", "src/hooks/**/*.ts"]
---

# Fetch Client + json-server Rules

This project is fully local and frontend-only for now. **json-server** serves a real
local REST API from `data/mockData/db.json` (a genuine HTTP server, not synchronous
mock functions), and the app talks to it over native `fetch` — no HTTP library
dependency (no Axios).

## Local mock backend

- `data/mockData/db.json` is the "database." Each top-level key becomes a REST
  resource automatically: `{"products": [...]}` → `GET/POST /products`,
  `GET/PATCH/PUT/DELETE /products/:id`.
- Run it with `npm run mock-api` (separate terminal from `npm run dev`) — starts on the
  port configured in `VITE_API_BASE_URL` (`.env.example` default: `http://localhost:3001`).
- `--watch` is enabled, so editing `data/mockData/db.json` while the server is running
  picks up changes without a restart.
- json-server is **stable v0.17.x**, not the v1.0.0 beta line (still marked "expect
  breaking changes" upstream) — do not upgrade to a `1.0.0-*` version without deliberately
  re-checking its breaking changes (all IDs become strings, `_limit` → `_per_page`, etc.).

## Mandatory apiClient Architecture

All API communication MUST go through reusable service modules in `src/services/**`.

UI components MUST NOT:

- call `fetch` directly
- hardcode endpoints
- transform raw response shapes inline
- handle repeated header/timeout setup

## Required Structure

```text
src/services/
├── apiClient.ts
├── feature-name/
│   ├── featureService.ts
│   ├── types.ts
│   └── index.ts
├── mappers/
│   └── featureMapper.ts
└── index.ts
```

## apiClient Requirements

`src/services/apiClient.ts` is the one place that calls `fetch`. It:

- Reads the base URL from `env.apiBaseUrl` (`src/config/env.ts`) — never hardcodes it
- Sets `Content-Type: application/json` on every request
- Applies a request timeout via `AbortController` (default 10s)
- Normalizes every failure — non-2xx response, network error, or timeout — into a
  thrown `ApiError` (`{ message, status, body }`) — callers never handle raw `fetch`
  rejections or inspect `Response` objects directly
- Exposes typed methods matching json-server's REST verbs: `get`, `post`, `patch`,
  `put`, `del`

```typescript
// src/services/apiClient.ts (already provided by this template — do not recreate)
import { apiClient } from "@/services/apiClient";

const products = await apiClient.get<Product[]>("/products");
const created = await apiClient.post<Product>("/products", newProduct);
```

## Service Requirements

- One feature service per domain or feature area
- Return typed data wrapped in `ApiResponse<T>` — defined in `src/types/common.types.ts`
- Delegate DTO-to-domain transformation to mappers in `src/services/mappers/`
- Do not return the raw `apiClient` result directly to components or hooks — always
  wrap it in `ApiResponse<T>` at the service boundary
- See `02-api-services.md` for full service rules and `03-data-layer.md` for the
  mock/mapper/DTO architecture (when those features are enabled)

## Error Handling Rules

- Do not silently swallow errors
- Let `ApiError` propagate from the service to the hook; the hook decides how to
  surface it to the UI (toast, inline error state, etc.) — never decode `ApiError`
  internals inside a component
- Prefer a shared error-message mapper over inspecting `error.status` ad hoc in every
  hook, once more than one hook needs the same status-to-message logic
