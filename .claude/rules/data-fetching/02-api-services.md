---
description: API service layer — one service per domain, typed returns, error handling, stateless functions. Active when using the API service + data layer pattern.
paths: ["src/services/**/*.ts", "src/hooks/**/*.ts"]
---

# API Services

## Rules

- Always place all service functions in `src/services/<domain>/` — one file per domain (e.g. `authService.ts`)
- Never call a service function directly from a UI component — always go through a hook
- Never hardcode endpoint strings inline — always define them in `src/constants/api.constants.ts`
- Always type every service function's return value explicitly — return `ApiResponse<T>` (defined in `src/types/common.types.ts`)
- Always handle errors in the service layer — do not let raw exceptions surface to the UI
- Always keep service functions pure and stateless — no component state, no JSX, no router logic

## Structure

```text
src/services/
├── apiClient.ts              # Central Axios instance
├── auth/
│   ├── authService.ts        # Service functions
│   ├── types.ts              # Raw API response types (DTO)
│   ├── mocks.ts              # Typed mock data (when using data layer pattern)
│   └── index.ts              # Barrel export
├── mappers/
│   └── authMapper.ts
└── index.ts
```

## Pattern

```ts
// src/services/auth/types.ts — raw API shape (DTO)
export interface AuthDto {
  user_id: string;
  display_name: string;
  access_token: string;
}
```

```ts
// src/services/auth/authService.ts
import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/constants";
import type { ApiResponse } from "@/types/common.types";
import type { AuthDto } from "./types";

export const loginUser = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthDto>> => {
  try {
    const response = await apiClient.post<AuthDto>(API_ENDPOINTS.LOGIN, { email, password });
    return { status: response.status, data: response.data, message: "OK" };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error in loginUser");
  }
};
```

```ts
// src/hooks/useAuth.ts — imports directly from the service file, not a barrel
import { loginUser } from "@/services/auth/authService";
import { mapAuthDtoToUser } from "@/services/mappers/authMapper";
import type { AuthUser } from "@/types/auth.types";

export const useAuth = () => {
  const login = async (email: string, password: string): Promise<AuthUser> => {
    const response = await loginUser(email, password);
    return mapAuthDtoToUser(response.data);
  };

  return { login };
};
```
