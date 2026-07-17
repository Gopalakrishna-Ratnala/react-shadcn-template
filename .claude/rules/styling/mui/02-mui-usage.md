---
description: MUI component usage rules — prefer primitives, wrap before use, styled() extension, forbidden sx/inline patterns. Active when using MUI as the UI library.
paths: ["src/**/*.tsx", "src/**/styles.ts"]
---

# MUI Usage Rules

## Mandatory MUI Practices

- Prefer MUI primitives before creating custom wrappers
- Wrap custom variants through project components only when reuse is justified
- Use `Box`, `Stack`, `Grid`, `Paper`, `Container`, `Typography`, `Button`, `IconButton`, `TextField`, `Dialog`, and other semantic MUI primitives appropriately
- Extend via `styled()` in `styles.ts`
- Ensure theme compatibility at all times

## MUI Component Wrapping Rule (MANDATORY)

**Never use MUI components directly inside other components or pages.** Every MUI component must be wrapped in a project component under `src/components/` before use.

### Required Pattern

1. Create a wrapper component in `src/components/shared/<componentName>/` following the component file contract (6-file with Storybook, 5-file without)
2. The wrapper must accept and forward all relevant parent props via a typed `props` interface in `types.ts`
3. Style overrides must be applied via `styled()` in `styles.ts` — never via `sx` or inline `style`
4. The wrapper is then the only import used across pages and other components

### Example

```tsx
// ✅ Correct — wrap first, then use the wrapper
// src/components/shared/appButton/AppButton.tsx
import { ButtonProps } from "./types";
import { StyledButton } from "./styles";

export const AppButton = ({ label, onClick, variant }: ButtonProps) => (
  <StyledButton variant={variant} onClick={onClick}>{label}</StyledButton>
);

// src/pages/someFeature/SomeFeaturePage.tsx
import { AppButton } from "@/components/shared/appButton";

// ❌ Wrong — MUI Button used directly in a page or component
import { Button } from "@mui/material";
```

### Why

- Centralises all style overrides in one place — changes propagate everywhere automatically
- Prevents scattered `sx` / inline style usage across the codebase
- Enforces consistent prop contracts and accessibility attributes project-wide

## Forbidden MUI Practices

- ❌ `sx` in production component code
- ❌ ad-hoc theme bypasses
- ❌ inconsistent custom prop names
- ❌ styling in JSX
- ❌ unwrapped icon-only buttons without `aria-label`
