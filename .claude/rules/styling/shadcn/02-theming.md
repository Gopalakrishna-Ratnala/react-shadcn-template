---
description: Dark/light theme toggle — next-themes ThemeProvider wiring, useTheme() usage rules, ThemeToggle component. Active when project supports theme switching with shadcn/ui.
paths: ["src/**/*.tsx", "src/**/*.ts", "src/styles/**/*.css"]
---

# Theming (Dark / Light Mode Toggle)

## Stack

- This project uses **`next-themes`** for theme switching. Note this is shadcn/ui's official recommendation for **Next.js** specifically — shadcn's own Vite dark-mode guide (ui.shadcn.com/docs/dark-mode/vite) instead ships a hand-rolled `ThemeProvider` built on React Context + `localStorage`, with no `next-themes` dependency. `next-themes` is framework-agnostic and works fine in a Vite app (this project relies on that), but don't describe it as "the official shadcn/ui solution" in general — it's official for Next.js, and a project choice for Vite.
- Always use Tailwind's `dark:` strategy for dark mode styles — never use JS-based conditional styling for theme variants
- Always define color tokens as CSS variables in the project's theme file (`src/styles/themes/theme.css` here)

## Wiring

Always wrap the app with `ThemeProvider` in `App.tsx` — never inside a page or layout component:

```tsx
// src/App.tsx
import { ThemeProvider } from "next-themes";

export const App = (): ReactElement => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* router and other providers */}
    </ThemeProvider>
  );
};
```

- Always set `attribute="class"` — required for Tailwind's class-based dark mode strategy
- Always set `defaultTheme="system"` unless a product requirement specifies otherwise

## When to Use `useTheme()`

Only import `useTheme()` when the resolved theme value is needed at runtime (e.g. wiring a third-party component or building the theme toggle button). **Never use `useTheme()` to conditionally apply styles — use `dark:` Tailwind classes instead.**

```tsx
// ✅ Valid — third-party component needs the resolved theme value
import { useTheme } from "next-themes";

export const RootToaster = (): ReactElement => {
  const { resolvedTheme } = useTheme();
  return <Toaster theme={resolvedTheme as "light" | "dark"} />;
};

// ❌ Invalid — use dark: Tailwind class instead
const { resolvedTheme } = useTheme();
return <section className={resolvedTheme === "dark" ? "bg-card" : "bg-background"}></section>;

// ✅ Correct replacement
return <section className="bg-background dark:bg-card"></section>;
```

## Theme Toggle Component

Build `ThemeToggle` in `src/components/shared/themeToggle/` following the component file contract (5-file — Storybook is fixed off for this template). It calls `setTheme()` only — no other logic:

```tsx
// src/components/shared/themeToggle/ThemeToggle.tsx
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { toggleButtonStyles } from "./ThemeToggle.styles";

export const ThemeToggle = (): ReactElement => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className={toggleButtonStyles}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Icon from public/assets/icons/ or lucide-react per project icon choice */}
    </Button>
  );
};
```

## CSS Variable Tokens

Always define light and dark token values in the project's theme file under `:root` and `.dark`. Always reference tokens via Tailwind semantic classes — never raw CSS variable values in component files.

shadcn/ui's current default theme (Tailwind v4) uses `oklch()` color values, bridged to Tailwind via `@theme inline`:

```css
/* shadcn/ui's current default token format */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
}
```

Any valid CSS color works here (hex, rgb, oklch) — this project's own `theme-template.css` uses hex deliberately, for designer readability. What matters is that every token is defined for both `:root` and `.dark`, never renamed, and only ever consumed through the semantic Tailwind classes (`bg-primary`, etc.), never as a raw `var(--primary)` in component files.
