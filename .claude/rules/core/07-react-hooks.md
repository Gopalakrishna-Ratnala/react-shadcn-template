---
description: React component responsibilities and hooks requirements — presentational vs container, hook coordination rules. Loaded when editing components or hooks.
paths: ["src/**/*.tsx", "src/hooks/**/*.ts"]
---

# React and Hooks Rules

## Component Responsibilities

### Presentational Components

- receive props
- render UI
- contain minimal local UI behavior only
- do not fetch data directly
- do not own shared business state

### Container or Feature Orchestration Components

- may consume hooks, stores, services through hooks
- prepare data and handlers for presentational children
- remain thin and readable

## Hooks Requirements

Shared hooks belong in `src/hooks/**` when reused or feature-significant.

Hooks may coordinate:

- store selectors/actions
- route behavior
- form wiring
- API orchestration
- memoized transformations

Hooks MUST NOT:

- render JSX
- hide critical side effects unexpectedly
- return unstable anonymous structures when avoidable
- duplicate store/service behavior already implemented elsewhere

## useEffect Rules

- Never use `useEffect` to compute derived state — use `useMemo` instead
- Never use `useEffect` to respond to a user event — handle it in the event callback directly
- Always return a cleanup function when registering subscriptions, timers, or event listeners inside `useEffect`
- Always keep the dependency array exhaustive — include every value from the component scope that the effect reads
- Never omit the dependency array to run the effect on every render — this is almost always a bug
- Prefer encapsulating `useEffect` logic inside a custom hook rather than writing it directly in a component

```ts
// WRONG — useEffect for derived state
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// CORRECT — useMemo for derived state
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);

// WRONG — no cleanup for a subscription
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, [handleResize]);

// CORRECT — cleanup returned
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [handleResize]);
```

## Examples

### Correct: Hook coordinating store + service with error handling

**Use this shape only when the state is genuinely needed by more than one
page/component** (e.g. the current user's session, used across many pages) —
per `state-management/01-zustand.md`, Zustand is explicitly NOT for local,
one-component/one-page-only state. If this hook's state is only ever consumed
by a single page, use the local-state variant below instead, even though the
overall shape (service → mapper → `AsyncState`) is identical either way.

```typescript
import { useCallback } from "react";

// Adapt imports to your chosen state management and HTTP client libraries
import { useUserStore } from "@/store/user";
import { getUser } from "@/services/user/userService";
import { mapUserDtoToUser } from "@/services/mappers/userMapper";
import type { AsyncState } from "@/types/common.types";
import type { UserModel } from "@/types/user.types";

interface UseUserResult {
  state: AsyncState<UserModel>;
  fetchUser: (id: string) => Promise<void>;
}

export const useUser = (): UseUserResult => {
  const state = useUserStore((state) => state.userState);
  const setState = useUserStore((state) => state.setUserState);

  const fetchUser = useCallback(async (id: string): Promise<void> => {
    setState({ status: "loading" });
    try {
      const response = await getUser(id);
      setState({ status: "success", data: mapUserDtoToUser(response.data) });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setState({ status: "error", message });
    }
  }, [setState]);

  return { state, fetchUser };
};
```

### Correct: the same shape, but with page-local state (the more common case)

Most data-fetching hooks (a single page's list, a single page's detail view) only
ever have one consumer — this is the default to reach for unless you already know
the state needs to be shared:

```typescript
import { useCallback, useState } from "react";

import { getUser } from "@/services/user/userService";
import { mapUserDtoToUser } from "@/services/mappers/userMapper";
import type { AsyncState } from "@/types/common.types";
import type { UserModel } from "@/types/user.types";

interface UseUserResult {
  state: AsyncState<UserModel>;
  fetchUser: (id: string) => Promise<void>;
}

export const useUser = (): UseUserResult => {
  const [state, setState] = useState<AsyncState<UserModel>>({ status: "idle" });

  const fetchUser = useCallback(async (id: string): Promise<void> => {
    setState({ status: "loading" });
    try {
      const response = await getUser(id);
      setState({ status: "success", data: mapUserDtoToUser(response.data) });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setState({ status: "error", message });
    }
  }, []);

  return { state, fetchUser };
};
```

### Wrong: Hook that duplicates store logic

```typescript
// ❌ BAD — duplicates store selectors inline and makes raw HTTP calls
export const useUser = () => {
  const [user, setUser] = useState(null);      // duplicates store state
  useEffect(() => {
    fetch("/users/1").then((r) => r.json()).then(setUser); // raw HTTP call in hook
  }, []);
  return user;
};
```
