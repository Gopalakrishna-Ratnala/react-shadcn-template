---
description: MUI styling rules — styled() API, theme tokens, forbidden patterns, responsive rules. Active when using MUI as the UI library.
paths: ["src/**/styles.ts", "src/**/*.tsx"]
---

# Styling Rules (MUI Strategy)

## Absolute Styling Requirements

- **ALWAYS** define component styling in `styles.ts`
- **ALWAYS** use MUI `styled()` API
- **ALWAYS** use theme tokens
- **ALWAYS** use MUI utility/layout components such as `Box`, `Stack`, `Grid`, `Container`, `Paper`
- **ALWAYS** use `Typography` for text
- **ALWAYS** place responsive styling in `styles.ts`
- **ALWAYS** use `shouldForwardProp` when custom style props are introduced

## Forbidden Styling Patterns

- ❌ hardcoded hex, rgb, rgba, hsl
- ❌ hardcoded `"16px"`, `"14px"`, `"1rem"` in component styling unless already tokenized by theme primitives
- ❌ raw numeric dimensions (e.g., `width: 368`, `minHeight: 64`, `maxWidth: 1152`) — use `theme.spacing(n)` first; only create a new custom token if the value cannot be expressed via existing theme APIs
- ❌ raw numeric values in MUI component JSX props that control visual dimensions (e.g., `<Skeleton width={40} height={40} />`, `<Avatar sx={{ width: 32 }}>`) — create a styled component in `styles.ts` with `theme.spacing()` instead. This applies to **any** prop on **any** MUI component that sets a width, height, size, margin, padding, or gap.
- ❌ bare `0` as a value — always use `theme.spacing(0)` instead of raw `0` for `minWidth`, `flexShrink`, `margin`, `padding`, etc.
- ❌ `margin: "0 auto"` — split into `marginLeft: "auto"` + `marginRight: "auto"` to avoid the raw `0`
- ❌ inline `style` attribute — even for one-off layout adjustments, create a styled component in `styles.ts`
- ❌ production `sx`
- ❌ CSS modules
- ❌ Tailwind
- ❌ `<div>`, `<span>`, `<p>`, `<h1>`-`<h6>` — **MUI override**: use `Typography` for all text; use MUI layout primitives (`Box`, `Stack`, `Grid`) for structure. This overrides the core HTML policy that permits `<p>` and headings — when using MUI, those elements are also forbidden.
- ❌ redundant CSS resets already handled by MUI `CssBaseline` (e.g., `margin: 0` on body)

## Correct Pattern

```typescript
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const StyledRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  ...theme.typography.body1,
}));
```

## Responsive Rules

- Base styles first
- Adjust with `theme.breakpoints.up()` / `down()` / `between()`
- No raw media query strings in component files
