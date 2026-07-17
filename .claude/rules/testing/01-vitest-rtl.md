---
description: Testing rules — required coverage, provider setup, store/service/hook test patterns. Loaded when editing test files.
paths: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/*.spec.ts", "src/**/*.spec.tsx"]
---

# Testing Rules

## Every Component MUST Have Tests

Required coverage:

- renders correctly with default props
- renders variants and states
- handles interactions
- supports keyboard interaction
- includes accessibility assertions
- handles edge cases and error states
- 100% code coverage

### Mandatory Test Case Matrix — Components

For every `ComponentName.test.tsx`, ALL of the following MUST be covered:

- [ ] **Default render** — all primary content is present
- [ ] **Each meaningful prop variant** — e.g. `disabled`, `empty`, `loading`, `error`
- [ ] **Every user interaction that triggers a callback** — click, change, submit
- [ ] **Conditional rendering branches** — e.g. empty state, error state, loading state

### Mandatory Test Case Matrix — Pages

For every `PageName.test.tsx`, ALL of the following MUST be covered:

- [ ] **Renders without crashing** with mocked hooks
- [ ] **Each named section / heading** is present
- [ ] **Each interactive element** (button, link, form submit) is present and labelled correctly
- [ ] **Error state and loading state** render correctly

### Mandatory Test Case Matrix — Hooks

Every hook MUST have a co-located `useHookName.test.ts` file. Missing test = incomplete hook.

For every `useHookName.test.ts`, ALL of the following MUST be covered:

- [ ] **Initial state values** are correct
- [ ] **Each exported action** mutates state as expected
- [ ] **Async actions** handle both success and error paths

## Required Render Setup

Wrap all renders with your app's root providers (theme provider, router, etc.):

```tsx
import { type ReactElement } from "react";
import { render } from "@testing-library/react";

// Wrap with your chosen UI library's provider and any other root providers
// e.g. ThemeProvider, BrowserRouter, QueryClientProvider
const renderWithProviders = (ui: ReactElement) =>
  render(<AppProviders>{ui}</AppProviders>);
```

## Additional Testing Requirements

### For Store Consumers

- reset store state between tests if needed
- do not leak state across test cases
- test selector-driven UI updates

### For Service/HTTP Logic

- mock service layer or network boundary consistently
- do not hit real endpoints
- verify success, loading, and failure behaviors

### For Hooks

- test observable behavior, not implementation details
- verify async transitions explicitly
