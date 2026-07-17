---
description: Error handling — ErrorBoundary placement, AsyncState<T> pattern, service-layer error handling. Always loaded.
---

# Error Handling

## Rules

- Always place an `ErrorBoundary` at the root of the app in `App.tsx` and at page-level boundaries
- Never let raw caught errors surface to the UI — always map to a typed error message
- Always handle async errors in the service layer — catch, transform, and rethrow as typed errors
- Never swallow errors silently — always log or surface them in a controlled way
- Always use discriminated union state for async operations: `idle | loading | success | error`
- Never use `any` in catch blocks — type caught errors as `unknown` and narrow before use

## Error Boundary Placement

```text
App.tsx                    ← root boundary (catches render errors across the whole app)
  └── pages/               ← optional page-level boundary (isolates per-route failures)
        └── components/    ← do not add boundaries here unless the component is truly isolated
```

## Async State Pattern

Add `AsyncState<T>` to `src/types/common.types.ts` alongside `ApiResponse<T>`:

```ts
// src/types/common.types.ts
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

```ts
// src/hooks/useUserProfile.ts
import { useState } from "react";
import { getUserProfile } from "@/services/user/userService";
import { mapUserDto } from "@/services/mappers/userMapper";
import type { AsyncState } from "@/types/common.types";
import type { UserProfile } from "@/types/user.types";

export const useUserProfile = () => {
  const [state, setState] = useState<AsyncState<UserProfile>>({ status: "idle" });

  const loadProfile = async (id: string) => {
    setState({ status: "loading" });
    try {
      const response = await getUserProfile(id);
      setState({ status: "success", data: mapUserDto(response.data) });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setState({ status: "error", message });
    }
  };

  return { state, loadProfile };
};
```

## Service Layer Error Handling

```ts
// src/services/user/userService.ts
import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/constants";
import type { ApiResponse } from "@/types/common.types";
import type { UserDto } from "./types";

export const getUserProfile = async (id: string): Promise<ApiResponse<UserDto>> => {
  try {
    const response = await apiClient.get<UserDto>(`${API_ENDPOINTS.USER_PROFILE}/${id}`);
    return { status: response.status, data: response.data, message: "OK" };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error in getUserProfile");
  }
};
```

## ErrorBoundary Component

Place in `src/components/shared/errorBoundary/` following the component file contract (6-file with Storybook, 5-file without):

```tsx
// src/components/shared/errorBoundary/ErrorBoundary.tsx
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { hasError: true, message };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <p role="alert">{this.state.message}</p>;
    }
    return this.props.children;
  }
}
```
