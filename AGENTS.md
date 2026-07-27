# AGENTS.md — Fast-Read Compliance Checklist

**Authoritative source: `CLAUDE.md` and all `.claude/rules/**/*.md` files.**
This file is the agent-optimised summary. When in doubt, consult `CLAUDE.md`.

Every instruction below is REQUIRED. Violations cause code rejection.

---

## Before You Write Code

Follow this order on every task:

1. Inspect existing files in `src/components/layout`, `src/components/shared`, `src/store`, `src/services`, `src/hooks`, `src/utils`, and `src/lib`
2. Reuse an existing pattern if one exists — do not duplicate
3. List which files must be created or updated
4. Implement code
5. Verify all non-negotiable rules (see checklist below)
6. Run `tsc --noEmit` — must exit 0
7. Run final validation checks

If anything is unclear:

- Find a similar component in `src/components/shared/**` or `src/components/layout/**` and mirror it
- Find a similar store in `src/store/**` and mirror it
- Find a similar service in `src/services/**` and mirror it
- If nothing exists, ask and propose one approach before writing

---

## Project Setup Reference

Every row below is fixed for this template — nothing to ask the user about or
choose between for any of these:

| Decision | What's fixed |
| --- | --- |
| Styling library | shadcn/ui + Tailwind CSS v4 (`@tailwindcss/vite` — not PostCSS) |
| Icon source | `lucide-react` — already installed |
| State management | Zustand |
| Forms & validation | React Hook Form + Zod |
| Data fetching | Fetch-based `apiClient` + json-server (local mock backend) |
| Testing framework | Vitest + React Testing Library — already installed and configured |

For the genuinely optional, still-ask-the-user features (Storybook is fixed OFF;
toast notifications, i18n, animation wrappers remain a real per-project choice),
see `CLAUDE.md`'s "Step 2 — Optional features" and `.claude/rules/features/README.md`.

---

## Active Tech Stack

| Slot | Library |
| --- | --- |
| Framework | React 19.x |
| Language | TypeScript strict mode |
| UI Library | shadcn/ui + Tailwind CSS v4 (`@tailwindcss/vite` — NOT PostCSS) |
| State | Zustand |
| HTTP | Fetch-based `apiClient` + json-server (local mock) |
| Forms | React Hook Form + Zod |
| Router | React Router DOM v7 |
| Testing | Vitest + React Testing Library |
| Storybook | Fixed OFF for this template |
| Icons | ask user — `public/assets/icons/` (SVG sprites) or `lucide-react` |

---

## Non-negotiable Rules

- **NEVER** use explicit `any` *(hook-enforced — blocked)*
- **NEVER** use `<div>` or `<span>` — they have no semantic meaning; replace with a shadcn/ui primitive or a semantic HTML element *(hook-enforced — blocked)*
- **NEVER** use library-specific inline style props (e.g. `sx`) *(hook-enforced — blocked)*
- **NEVER** use inline `style={}` attribute — even for one-off values; use a Tailwind class extracted to `.styles.ts` *(hook-enforced — blocked)*
- **NEVER** hardcode CSS colors (`#hex`, `rgb()`, `rgba()`, `hsl()`) *(hook-enforced — blocked)*
- **NEVER** use Tailwind palette colour classes (`bg-blue-500`, `text-slate-700`, etc.) — use shadcn/ui semantic tokens (`bg-primary`, `text-muted-foreground`, `border-border`, etc.) *(hook-enforced — blocked)*
- **NEVER** write raw px dimensions in `.styles.ts` or raw numeric dimension props in `.tsx` *(hook-enforced — blocked)*
- **NEVER** inline a multi-token `className` string in JSX — extract to `ComponentName.styles.ts`; only a single-token utility or a `cn()` call whose base is imported from `.styles.ts` is allowed inline *(hook-enforced — warning)*
- **NEVER** use template literals in `className` — use `cn()` with base classes imported from `.styles.ts`
- **NEVER** skip required files for a component or page
- **NEVER** create a new file in `hooks/`, `components/`, `types/`, `constants/`, `services/`, or `store/` without adding a re-export to the sibling `index.ts` *(hook-enforced — warning)*
- **NEVER** return a raw domain model from a service — wrap in `ApiResponse<T>`
- **NEVER** place a Zod schema inside a `.tsx` file or a hook — use a co-located `ComponentName.schema.ts`
- **NEVER** duplicate existing utilities, hooks, store patterns, service clients, constants, or types
- **NEVER** call APIs directly inside UI components
- **NEVER** place business logic inside presentational elements
- **NEVER** mutate store state directly
- **NEVER** create untyped HTTP responses
- **NEVER** omit accessibility attributes
- **ALWAYS** use shadcn/ui semantic CSS-variable tokens for all colours
- **ALWAYS** extract all multi-token Tailwind strings to `ComponentName.styles.ts`
- **ALWAYS** use `cn()` from `src/lib/utils.ts` for conditional or composed class strings
- **ALWAYS** separate UI, state, service, and mapping concerns
- **ALWAYS** use design tokens — no raw numbers for dimensions
- **ALWAYS** include `dark:` counterpart classes with every light-mode Tailwind class
- **ALWAYS** reuse existing building blocks from `src/lib`, `src/utils`, `src/hooks`, `src/types`, `src/constants`, `src/services`, `src/store` before creating new ones
- **ALWAYS** type API requests, responses, store state, actions, component props, and mapper outputs
- **ALWAYS** ensure accessibility: semantic controls, valid labels, alt text, keyboard support

---

## Component Tiers

| Tier | Folder | Rule |
| --- | --- | --- |
| Primitives | `components/ui/` | shadcn CLI only — never edit, no stories/tests required |
| Layout | `components/layout/` | Page-framing wrappers with no business data — 5-file contract (fixed, no Storybook) |
| Shared | `components/shared/` | ALL custom components regardless of how many pages use them — 5-file contract (fixed, no Storybook) |

**Pages NEVER own components.** Every custom component lives in `shared/` or `layout/`.

## Required File Contracts

### Component — `layout/` and `shared/` (6 files — all required)

```text
componentName/
├── ComponentName.tsx
├── ComponentName.styles.ts
├── types.ts
├── ComponentName.stories.tsx
├── ComponentName.test.tsx
└── index.ts
```

### Page (6 files — schema only required when page has a form)

```text
pageName/
├── PageName.tsx
├── PageName.styles.ts
├── types.ts
├── PageName.schema.ts      ← required when page has a form
├── PageName.test.tsx
└── index.ts
```

### Hook (2 files — both required)

```text
hooks/
├── useFeatureName.ts
└── useFeatureName.test.ts  ← required for every hook
```

---

## Active Hooks (Automated Enforcement)

| Hook | What it blocks/warns | Exit |
| --- | --- | --- |
| `check-no-any.sh` | Explicit `any` in .ts/.tsx | 2 (block) |
| `check-no-div-span.sh` | `<div>` or `<span>` in .tsx | 2 (block) |
| `check-no-sx-prop.sh` | `sx={}` prop in .tsx | 2 (block) |
| `check-no-inline-style.sh` | `style={}` attribute in .tsx | 2 (block) |
| `check-no-hardcoded-colors.sh` | CSS hex/rgb/hsl colors AND Tailwind palette classes (`bg-blue-500` etc.) | 2 (block) |
| `check-no-raw-dimensions.sh` | Raw px strings in `.styles.ts`, raw numeric dimension props in .tsx | 2 (block) |
| `check-component-files.sh` | Missing required component files (PostToolUse) | 0 (warn) |
| `check-no-inline-classnames.sh` | Multi-token className inlined in .tsx (PostToolUse) | 0 (warn) |
| `check-barrel-exports.sh` | New module not exported from sibling index.ts (PostToolUse) | 0 (warn) |
| `check-tsc.sh` | TypeScript errors after .ts/.tsx writes (PostToolUse) | 0 (warn) |
| `check-dependency-security.sh` | Blocks `git commit` when `npm audit` finds any vulnerability — run `/dependency-security` to fix | 2 (block) |

All hooks skip `*.test.*`, `*.stories.*`, and `*/theme/*` files.

---

## HTML Element Policy

| Tier | Elements | Rule |
| --- | --- | --- |
| **Forbidden** | `<div>`, `<span>` | Always replace with a shadcn/ui primitive or semantic HTML |
| **Allowed** | `<main>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`, `<nav>` | When no shadcn/ui primitive fits |
| **Allowed** | `<ul>`, `<ol>`, `<li>` | When no shadcn/ui primitive fits |
| **Allowed** | `<h1>`–`<h6>`, `<p>`, `<em>`, `<strong>`, `<small>`, `<mark>`, `<time>`, `<abbr>`, `<code>`, `<kbd>` | When no shadcn/ui primitive fits |
| **Allowed** | `<figure>`, `<figcaption>`, `<img>` | When no shadcn/ui primitive fits |

---

## Mock Service API Envelope

Every service method must return `ApiResponse<T>` (from `src/types/common.types.ts`):

```ts
interface ApiResponse<T> {
  status: number
  data: T
  message: string
  error?: string
}
```

The calling hook unwraps `.data` before storing in Zustand. Never return the raw model.

---

**Storybook is fixed OFF for this template** — 5-file component contract
everywhere, no `.storybook/` config, no Storybook scripts in `package.json`. (This
section previously referenced a `core/16-storybook.md` file that never existed
under that name in this repo's actual folder structure — a pre-reorg stale
reference, moot now that Storybook is fixed off entirely.)

---

## Before You Mark the Task Complete

- [ ] `npm run lint` exits 0
- [ ] `npm run format` completes
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] `tsc --noEmit` exits 0
- [ ] No explicit `any`
- [ ] No `<div>` or `<span>`
- [ ] No hardcoded CSS colors or Tailwind palette classes
- [ ] No inline `style={}` or `sx={}`
- [ ] No raw px/numeric dimensions
- [ ] No multi-token className strings inlined in JSX
- [ ] No template literals in `className`
- [ ] All new modules barrel-exported from sibling `index.ts`
- [ ] All component folders have all 6 required files
- [ ] Every hook has a co-located `.test.ts`
- [ ] Every form page has a co-located `.schema.ts`
- [ ] All services return `ApiResponse<T>`
- [ ] Semantic HTML used intentionally — not as a layout convenience
- [ ] Accessibility verified (aria-labels, alt text, keyboard support)
- [ ] Responsive behaviour verified (dark mode + breakpoints)
- [ ] All new types, services, stores, hooks, components, stories, and tests follow project structure
