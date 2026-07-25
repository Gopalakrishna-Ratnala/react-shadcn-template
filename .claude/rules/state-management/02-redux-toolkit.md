---
description: Redux Toolkit state management — slice structure, async thunks, typed hooks, no direct mutation. Loaded when editing stores.
paths: ["src/store/**/*.ts", "src/hooks/**/*.ts"]
---

# Redux Toolkit Rules

## Mandatory Redux Toolkit Usage Principles

Use Redux Toolkit for:

- global shared application state
- complex state with many interdependent slices
- state that requires time-travel debugging or Redux DevTools
- cross-feature state synchronisation

Do not use Redux Toolkit for:

- local one-component-only state — use `useState` instead
- uncontrolled form field state already owned by RHF
- server-cache state — use a data-fetching layer (`apiClient` service + hook) instead

## Store Structure Requirements

Each slice MUST define:

- `initialState` with an explicit type
- `reducers` with no direct mutation outside Immer-managed blocks
- exported actions and the reducer as default export
- async logic in `createAsyncThunk`, not inside reducers

## Required File Pattern

```text
src/store/
├── index.ts                  # configureStore + RootState + AppDispatch exports
├── featureName/
│   ├── featureSlice.ts       # createSlice definition
│   ├── featureThunks.ts      # createAsyncThunk definitions
│   ├── types.ts              # State and payload types
│   └── index.ts              # Barrel export
```

## Typed Hook Requirements

Always use typed wrappers — never call `useSelector` or `useDispatch` directly:

```typescript
// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import userReducer from "./user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Slice Pattern

```typescript
// src/store/user/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { UserModel } from "@/types/user.types";

import { fetchUserThunk } from "./userThunks";

interface UserState {
  user: UserModel | null;
  isLoading: boolean;
  errorMessage: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  errorMessage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserModel | null>) {
      state.user = action.payload;
    },
    clearError(state) {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message ?? "Unknown error";
      });
  },
});

export const { setUser, clearError } = userSlice.actions;
export default userSlice.reducer;
```

## Async Thunk Pattern

```typescript
// src/store/user/userThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

import { getUser } from "@/services/users/userService";
import { mapUserDtoToUser } from "@/services/mappers/userMapper";
import type { UserModel } from "@/types/user.types";

export const fetchUserThunk = createAsyncThunk<UserModel, string>(
  "user/fetchUser",
  async (userId) => {
    const response = await getUser(userId);
    return mapUserDtoToUser(response.data);
  }
);
```

## Store Rules

- Never mutate state outside an Immer-managed reducer block
- Never call `useSelector` or `useDispatch` directly — always use `useAppSelector` / `useAppDispatch`
- Keep slices focused by domain — no unrelated state in one slice
- Async logic belongs in thunks, not reducers or UI components
- Never embed JSX or router logic inside thunks or reducers
