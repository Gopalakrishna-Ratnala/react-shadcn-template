---
description: Data layer architecture — mock → service → mapper → hook → UI flow, DTOs, domain models, ApiResponse<T> end-to-end. Active when using the API service + data layer pattern.
paths: ["src/services/**/*.ts", "src/hooks/**/*.ts", "src/types/**/*.ts"]
---

# Data Layer Architecture

## Purpose

Decouples the UI from the API response shape. Mock APIs can be replaced with real APIs without touching any UI code — only the service and mapper need updating.

## Layer Flow

```
Mocks  →  Service Layer  →  Mapper Layer  →  Hook  →  UI
```

| Layer | Location | Responsibility |
|---|---|---|
| **Mocks** | `src/services/<domain>/mocks.ts` | Typed static objects simulating API responses |
| **Service** | `src/services/<domain>/` | Returns mock (or real) data as `ApiResponse<T>` |
| **Mapper** | `src/services/mappers/` | Transforms raw DTO into a stable domain model |
| **Hook** | `src/hooks/` | Calls service → passes to mapper → returns domain model to UI |
| **UI** | `src/components/`, `src/pages/` | Consumes domain model only — never raw DTO |

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
│   ├── auth/
│   │   ├── authService.ts      # Returns ApiResponse<AuthDto>
│   │   ├── types.ts            # AuthDto (raw API shape / DTO)
│   │   ├── mocks.ts            # Typed mock data
│   │   └── index.ts
│   ├── mappers/
│   │   └── authMapper.ts       # AuthDto → AuthUser
│   └── index.ts
├── types/
│   ├── common.types.ts         # ApiResponse<T>, AsyncState<T>
│   ├── auth.types.ts           # AuthUser (domain model — UI-facing)
│   └── index.ts
```

## Rules

- Always store mock data as typed constants in `src/services/<domain>/mocks.ts` — never inline them in service files
- Always type mock responses using the `ApiResponse<T>` wrapper
- Always define raw API shapes in `services/<domain>/types.ts` (DTO types)
- Always define domain model types in `src/types/` — these are what the UI sees
- Always write a mapper that converts the DTO → domain model in `src/services/mappers/`
- Never let a raw DTO reach a UI component or hook return value
- Never duplicate mapping logic — one mapper per domain, reused everywhere

## Full Pattern

```ts
// src/types/auth.types.ts — stable domain model (UI-facing)
export interface AuthUser {
  id: string;
  name: string;
  token: string;
}
```

```ts
// src/services/auth/types.ts — raw API shape (DTO)
export interface AuthDto {
  user_id: string;
  display_name: string;
  access_token: string;
}
```

```ts
// src/services/auth/mocks.ts
import type { ApiResponse } from "@/types/common.types";
import type { AuthDto } from "./types";

export const mockAuthResponse: ApiResponse<AuthDto> = {
  status: 200,
  data: { user_id: "u_001", display_name: "Jane Doe", access_token: "mock-token-xyz" },
  message: "Login successful",
};
```

```ts
// src/services/auth/authService.ts
import type { ApiResponse } from "@/types/common.types";
import type { AuthDto } from "./types";

import { mockAuthResponse } from "./mocks";

export const loginUser = async (): Promise<ApiResponse<AuthDto>> => {
  return mockAuthResponse; // swap with real apiClient call when ready
};
```

```ts
// src/services/mappers/authMapper.ts
import type { AuthDto } from "@/services/auth/types";
import type { AuthUser } from "@/types/auth.types";

export const mapAuthDtoToUser = (dto: AuthDto): AuthUser => ({
  id: dto.user_id,
  name: dto.display_name,
  token: dto.access_token,
});
```

```ts
// src/hooks/useAuth.ts
import { loginUser } from "@/services/auth/authService";
import { mapAuthDtoToUser } from "@/services/mappers/authMapper";
import type { AuthUser } from "@/types/auth.types";

export const useAuth = () => {
  const login = async (): Promise<AuthUser> => {
    const response = await loginUser();
    return mapAuthDtoToUser(response.data); // unwrap envelope — UI always gets AuthUser, never AuthDto
  };

  return { login };
};
```

## Swapping Mock → Real API

1. Update `src/services/<domain>/<domainService>.ts` — replace mock return with a real `apiClient` call
2. If the real API shape differs from the DTO, update `services/<domain>/types.ts` and `services/mappers/<domainMapper>.ts`
3. UI components and hooks require **no changes**
