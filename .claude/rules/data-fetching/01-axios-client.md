---
description: Axios-based HTTP client architecture — central apiClient, typed requests, error handling, json-server as the local mock backend. Loaded when editing services.
paths: ["src/services/**/*.ts", "src/hooks/**/*.ts"]
---

# Axios Client + json-server Rules

This project is fully local and frontend-only for now. **json-server** serves a real
local REST API from `data/mockData/db.json` (a genuine HTTP server, not synchronous
mock functions), and the app talks to it over **axios** — a single shared
`axios.create()` instance, not per-call raw `axios.get()`/`axios.post()` calls.

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

- call `axios` directly
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

`src/services/apiClient.ts` is the one place that creates an axios instance and calls
`axiosInstance.request()`. It:

- Reads the base URL from `env.apiBaseUrl` (`src/config/env.ts`) — never hardcodes it,
  and passes it as `axios.create()`'s `baseURL` (never as a per-call string
  concatenation)
- Sets `Content-Type: application/json` on the shared instance, not per call
- Applies a request timeout via axios's own `timeout` config (default 10s) — no manual
  `AbortController`/`setTimeout` needed, though an external `AbortSignal` (e.g. from a
  component unmounting) can still be passed through per-request via axios's own
  `signal` option
- Normalizes every failure — non-2xx response, network error, or timeout — into a
  thrown `ApiError` (`{ message, status, body }`) via `axios.isAxiosError()` — callers
  never handle a raw `AxiosError` or inspect `error.response` directly
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
- Let `ApiError` propagate from the service to the caller (a route `loader`/`action`,
  or a hook for non-route-tied fetches); the caller decides how to surface it to the
  UI (toast, inline error state, route `ErrorBoundary`, etc.) — never decode `ApiError`
  internals inside a component
- Prefer a shared error-message mapper over inspecting `error.status` ad hoc in every
  caller, once more than one needs the same status-to-message logic

## Testing apiClient

Mock `axios` itself (`vi.mock("axios", ...)`, mocking `axios.create` to return an
object with a `request` mock), not `global.fetch` — see `apiClient.test.ts` for the
full pattern, including how a mocked `AxiosError`-shaped rejection (`{ isAxiosError:
true, response, code }`) is used to exercise the non-2xx, network-error, and
timeout (`code: "ECONNABORTED"`) branches.
