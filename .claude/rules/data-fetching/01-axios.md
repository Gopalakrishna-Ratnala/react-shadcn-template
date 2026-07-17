---
description: Axios architecture — central API client setup, typed requests, error handling. Loaded when editing services.
paths: ["src/services/**/*.ts", "src/hooks/**/*.ts"]
---

# Axios Rules

## Mandatory Axios Architecture

All API communication MUST go through reusable service modules in `src/services/**`.

UI components MUST NOT:

- instantiate Axios directly
- hardcode endpoints
- transform raw response shapes inline
- handle repeated auth/header setup

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

## Axios Client Requirements

- Create and reuse a central Axios instance
- Configure:
  - `baseURL`
  - default headers
  - timeout
  - interceptors if project convention already supports them
- Type all request and response payloads
- Normalize and surface API errors consistently
- Avoid leaking raw backend shapes into UI code

## Example Pattern

```typescript
import axios, { type AxiosInstance } from "axios";
import { env } from "@/config/env";

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
```

## Service Requirements

- One feature service per domain or feature area
- Return typed data wrapped in `ApiResponse<T>` — defined in `src/types/common.types.ts`
- Delegate DTO-to-domain transformation to mappers in `src/services/mappers/`
- Do not return raw `AxiosResponse` to components or hooks
- See `02-api-services.md` for full service rules and `03-data-layer.md` for the mock/mapper/DTO architecture (when those features are enabled)

## Error Handling Rules

- Do not silently swallow errors
- Convert transport/backend errors into app-usable error messages or typed error objects
- Prefer shared error parsers when available
- Components should render user-facing states, not decode Axios internals
