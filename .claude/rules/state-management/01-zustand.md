---
description: Zustand state management — store structure, domain-focused stores, async actions, no direct mutation. Fixed for this template, always active when editing stores.
paths: ["src/store/**/*.ts", "src/hooks/**/*.ts"]
---

# Zustand Rules

Zustand is fixed for this template — not a per-project choice. See
`state-management/README.md` for why. **Once a project has real stores using it,
never suggest switching to a different state management library** — that decision
is made once, at project start, and kept for the project's lifetime.

## Mandatory Zustand Usage Principles

Use Zustand for:

- client-side shared UI state
- filters
- modal/drawer state
- lightweight cross-component state
- cached view state when appropriate

Do not use Zustand for:

- local one-component-only state
- uncontrolled form field state already owned by RHF
- duplicating backend response state without purpose

## Store Structure Requirements

Each store MUST define:

- state type
- actions type
- initial state
- typed selectors where useful
- no direct mutation
- no unrelated mixed concerns in one store

## Recommended Store File Pattern

```text
src/store/
├── featureName/
│   ├── featureStore.ts
│   ├── types.ts
│   └── index.ts
└── index.ts              # Root barrel export
```

## Store Rules

- Keep stores focused by domain
- Prefer small stores over one giant global store
- Select only required slices in components
- Avoid selecting the whole store object
- Use derived selectors when repeated
- Persist state only when justified and approved by project conventions
- Async actions may call services, but UI components should not duplicate that logic

## Example Pattern

```typescript
import { create } from "zustand";

import type { UserModel } from "@/types/user.types";

interface UserState {
  user: UserModel | null;
  isLoading: boolean;
  errorMessage: string | null;
  setUser: (user: UserModel | null) => void;
  setLoading: (isLoading: boolean) => void;
  setErrorMessage: (errorMessage: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  errorMessage: null,
  setUser: (user) => {
    set({ user });
  },
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  setErrorMessage: (errorMessage) => {
    set({ errorMessage });
  },
}));
```

## Async Zustand Action Guidance

When async actions are placed inside stores:

- call typed services only
- set loading/error states explicitly
- reset stale error state before request
- never update unrelated store branches
- never embed JSX or router logic in store actions
