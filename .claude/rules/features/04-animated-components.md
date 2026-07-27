---
description: Animation wrappers — reusable components in src/components/animated/, no raw animation code in pages or business components. Active when project uses animation wrappers.
paths: ["src/components/**/*.tsx", "src/pages/**/*.tsx"]
---

# Animated Components

## Rules

- Never write raw animation library code directly inside a page or business component — always extract to a reusable wrapper
- Never duplicate animation presets inline — define them once in the wrapper component and reuse via props
- Always place reusable animation wrappers in `src/components/animated/` and export them from the folder's `index.ts`
- Always follow the component file contract — 5-file (`ComponentName.tsx`, `ComponentName.styles.ts`, `types.ts`, `ComponentName.test.tsx`, `index.ts`) — Storybook is fixed off for this template
- Never place business logic inside an animated wrapper — it wraps visual transitions only
- Create a new animated wrapper only when:
  - The same animation pattern appears in more than one place
  - The animation requires unique physics or timing that warrants its own component
  - The pattern is semantically distinct (e.g. shimmer loader, slide-in panel, success pop-in)

## Component Tier

`animated/` is a fourth tier inside `src/components/`, sitting alongside `ui/`, `layout/`, and `shared/`:

| Tier | Folder | What belongs here |
|---|---|---|
| Primitives | `ui/` | Vendored UI library primitives — never modified |
| Layout | `layout/` | Page-framing structural wrappers |
| Shared | `shared/` | Custom business components |
| **Animated** | **`animated/`** | Reusable animation wrapper components only |

## Directory Structure

```text
src/components/animated/
├── fadeIn/
│   ├── FadeIn.tsx
│   ├── FadeIn.styles.ts
│   ├── types.ts
│   ├── FadeIn.test.tsx
│   └── index.ts
├── slideUp/
│   ├── SlideUp.tsx
│   ├── SlideUp.styles.ts
│   ├── types.ts
│   ├── SlideUp.test.tsx
│   └── index.ts
└── index.ts               # Barrel export for all animated components
```

## Pattern

```ts
// src/components/animated/fadeIn/types.ts
import type { ReactNode } from "react";

export interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}
```

```tsx
// src/components/animated/fadeIn/FadeIn.tsx
import type { FadeInProps } from "./types";
// import from your chosen animation library

export function FadeIn({ children, delay = 0, duration = 0.3 }: FadeInProps) {
  // wrap children with animation — library-specific implementation here
  return <>{children}</>;
}
```

```ts
// src/components/animated/index.ts
export { FadeIn } from "./fadeIn";
export { SlideUp } from "./slideUp";
```

```tsx
// ✅ Correct — use the wrapper
import { FadeIn } from "@/components/animated";

<FadeIn delay={0.1}>
  <ProfileCard user={user} />
</FadeIn>

// ❌ Wrong — raw animation code in a page or business component
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, delay: 0.1 }}
>
  <ProfileCard user={user} />
</motion.div>
```
