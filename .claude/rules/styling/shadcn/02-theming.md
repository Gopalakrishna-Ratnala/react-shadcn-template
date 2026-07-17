---
description: Dark/light theme toggle — next-themes ThemeProvider wiring, useTheme() usage rules, ThemeToggle component. Active when project supports theme switching with shadcn/ui.
paths: ["src/**/*.tsx", "src/**/*.ts", "src/styles/**/*.css"]
---

# Theming (Dark / Light Mode Toggle)

## Stack

- Always use **`next-themes`** for theme switching — it is the official shadcn/ui theme solution
- Always use Tailwind's `dark:` strategy for dark mode styles — never use JS-based conditional styling for theme variants
- Always define color tokens as CSS variables in `src/styles/globals.css`

## Wiring

Always wrap the app with `ThemeProvider` in `App.tsx` — never inside a page or layout component:

```tsx
// src/App.tsx
import { ThemeProvider } from "next-themes";

export function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* router and other providers */}
    </ThemeProvider>
  );
}
```

- Always set `attribute="class"` — required for Tailwind's class-based dark mode strategy
- Always set `defaultTheme="system"` unless a product requirement specifies otherwise

## When to Use `useTheme()`

Only import `useTheme()` when the resolved theme value is needed at runtime (e.g. wiring a third-party component or building the theme toggle button). **Never use `useTheme()` to conditionally apply styles — use `dark:` Tailwind classes instead.**

```tsx
// ✅ Valid — third-party component needs the resolved theme value
import { useTheme } from "next-themes";

export function RootToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster theme={resolvedTheme as "light" | "dark"} />;
}

// ❌ Invalid — use dark: Tailwind class instead
const { resolvedTheme } = useTheme();
return <section className={resolvedTheme === "dark" ? "bg-card" : "bg-background"}></section>;

// ✅ Correct replacement
return <section className="bg-background dark:bg-card"></section>;
```

## Theme Toggle Component

Build `ThemeToggle` in `src/components/shared/themeToggle/` following the component file contract (6-file with Storybook, 5-file without). It calls `setTheme()` only — no other logic:

```tsx
// src/components/shared/themeToggle/ThemeToggle.tsx
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { toggleButtonStyles } from "./ThemeToggle.styles";

export function ThemeToggle() {
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
}
```

## CSS Variable Tokens

Always define light and dark token values in `src/styles/globals.css` under `:root` and `.dark`. Always reference tokens via Tailwind semantic classes — never raw CSS variable values in component files:

```css
/* src/styles/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
}
```
