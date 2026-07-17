# 🚨 STRICT COMPLIANCE REQUIRED

## Skills

### design-tokens

- **design-tokens** (`.claude/skills/design-tokens/SKILL.md`) — Convert design tokens from any format into `src/styles/globals.css`. Trigger: `/design-tokens`

When the user types `/design-tokens`, invoke the Skill tool with `skill: "design-tokens"` before doing anything else.

---

**MANDATORY: Every instruction in this document and all `.claude/rules/**/*.md` files is REQUIRED, not optional. Violations will cause code rejection.**

---

## Template Setup — Read Before Starting

This repository is a **clean project template**. It ships with a minimal placeholder screen and an empty directory scaffold — no demo code, no loose dependencies.

### What is pre-configured

- All rules, hooks, and guidelines in `.claude/`
- Empty directory scaffold matching the required project structure (`src/components/ui/`, `src/components/layout/`, `src/components/shared/`, `src/pages/`, `src/hooks/`, `src/store/`, `src/services/`, `src/utils/`, `src/types/`, `src/constants/`)
- A placeholder entry screen (`src/App.tsx`) — **replace it entirely** for your project; it has no imports or dependencies, so deletion is safe

### Getting started

1. **Choose one strategy per category** in each `.claude/rules/` strategy folder and delete the files you are not using
2. **Install your chosen dependencies** — UI library, state management, HTTP client, form library, testing libraries
3. **Replace `src/App.tsx`** with your root component and set up providers
4. **Replace `src/styles/globals.css`** with your UI library's global reset if needed
5. **Follow the bootstrap checklist** in `core/01-tech-stack.md` before writing any feature code

---

## Project Setup — Required User Prompts

**When starting a new project from this template, ask the user for every choice below before writing any code.** Do not assume defaults.

### Step 1 — Mandatory choices (pick one per row)

| Decision | Options |
| --- | --- |
| Styling library | MUI (Material UI) or shadcn/ui + Tailwind CSS v4 (`@tailwindcss/vite` — not PostCSS) |
| Icon source | `public/assets/icons/` (SVG sprites) or `lucide-react` library |
| State management | Zustand or Redux Toolkit |
| Forms & validation | React Hook Form + Yup or React Hook Form + Zod |
| Data fetching | Axios or other (TanStack Query, SWR, native fetch) |
| Testing framework | Vitest + React Testing Library or Jest + React Testing Library |

### Step 2 — Optional features (ask yes/no for each)

| Feature | Yes → keep | No → delete |
| --- | --- | --- |
| Storybook component docs | `features/01-storybook.md` | Delete the file; skip `.stories.tsx`; omit Storybook scripts from `package.json` |
| API service + data layer pattern (structured DTOs, mappers, mocks) | `data-fetching/02-api-services.md` + `data-fetching/03-data-layer.md` | Delete both files |
| Dark/light theme toggle *(shadcn/ui only)* | `styling/shadcn/02-theming.md` | Delete the file |
| Toast notifications | `features/02-notifications.md` | Delete the file |
| Internationalization (i18n / multi-language) | `features/03-internationalization.md` | Delete the file |
| Animation wrappers (`src/components/animated/`) | `features/04-animated-components.md` | Delete the file; do **not** create `src/components/animated/` |

After collecting all answers:

1. Delete the strategy files you are **not** using from each `.claude/rules/` subfolder
2. Delete the optional feature files the user said **No** to
3. Update `core/01-tech-stack.md` with the chosen libraries
4. Update `core/01-tech-stack.md` Tech Stack section to reflect confirmed choices
5. Install chosen dependencies before writing any feature code

---

## Frontend Engineering Guidelines

All guidelines have been organized into **rules** (contextual guidance) and **hooks** (automated enforcement).

Rules are split into three categories:

- **`core/`** — always loaded, apply to every task, not swappable
- **Strategy folders** (`styling/`, `forms/`, `state-management/`, `data-fetching/`, `testing/`) — pick one option per folder; delete the files you are not using
- **`features/`** — optional features; include or exclude based on project needs (see setup prompts above)

---

## Core Rules (`.claude/rules/core/`) — Always Required

| File | Domain |
| --- | --- |
| `core/01-tech-stack.md` | Tech stack, bootstrap checklist |
| `core/02-project-structure.md` | Folder structure, component contract, naming rules |
| `core/03-coding-principles.md` | General coding guidelines, core principles, non-negotiable rules |
| `core/04-execution-flow.md` | Required execution flow, reuse guidelines |
| `core/05-architecture.md` | Separation of concerns, directory intent |
| `core/06-typescript.md` | TypeScript strict mode, enforcement rules |
| `core/07-react-hooks.md` | Component responsibilities, hooks requirements |
| `core/08-accessibility.md` | Accessibility requirements and semantic element reference |
| `core/09-anti-patterns-checklist.md` | Auto-reject patterns, refactor rules, final validation checklist |
| `core/10-error-handling.md` | ErrorBoundary placement, AsyncState\<T\> pattern, service-layer error handling |
| `core/11-performance.md` | Memoization rules, lazy loading, list keys, virtualization, bundle size |
| `core/12-routing.md` | React Router v7, ProtectedRoute, ROUTES constants, lazy loading pages |
| `core/13-environment.md` | Environment variables, VITE_ prefix, typed config module, secrets policy |
| `core/14-security.md` | XSS prevention, token storage, input sanitization, secrets policy |

---

## Strategy Rules — Conditionally Loaded (scoped by `paths`)

Each folder below contains mutually exclusive strategy files. **Keep only the file matching your chosen library; delete the rest.**

### Styling (`.claude/rules/styling/`) — pick one + optional

| Strategy | Files to keep | Files to delete | Loaded when editing |
| --- | --- | --- | --- |
| **MUI (Material UI)** | `styling/mui/01-mui-styling.md` + `styling/mui/02-mui-usage.md` | `styling/shadcn/` | `src/**/styles.ts`, `src/**/*.tsx` |
| **shadcn/ui + Tailwind CSS v4** | `styling/shadcn/01-tailwind-shadcn-styling.md` — uses `@tailwindcss/vite` (not PostCSS) | `styling/mui/` | `src/**/*.tsx`, `src/**/*.ts`, `src/**/*.css` |

Optional (shadcn/ui only):

| File | Feature | Keep when | Loaded when editing |
| --- | --- | --- | --- |
| `styling/shadcn/02-theming.md` | Dark/light theme toggle via `next-themes` | Project needs theme switching | `src/**/*.tsx`, `src/**/*.ts` |

### Forms (`.claude/rules/forms/`) — pick one

| File | Strategy | Loaded when editing |
| --- | --- | --- |
| `forms/01-rhf-zod.md` | React Hook Form + Zod | `src/**/*.tsx`, `src/hooks/**/*.ts` |
| `forms/02-rhf-yup.md` | React Hook Form + Yup | `src/**/*.tsx`, `src/hooks/**/*.ts` |

### State Management (`.claude/rules/state-management/`) — pick one

| File | Strategy | Loaded when editing |
| --- | --- | --- |
| `state-management/01-zustand.md` | Zustand — store structure, async actions, no direct mutation | `src/store/**/*.ts`, `src/hooks/**/*.ts` |
| `state-management/02-redux-toolkit.md` | Redux Toolkit — slices, async thunks, typed hooks, no direct mutation | `src/store/**/*.ts`, `src/hooks/**/*.ts` |

### Data Fetching (`.claude/rules/data-fetching/`) — pick one + optional add-ons

| File | Strategy | Loaded when editing |
| --- | --- | --- |
| `data-fetching/01-axios.md` | Axios — central API client, typed responses, error handling | `src/services/**/*.ts`, `src/hooks/**/*.ts` |

Optional (works alongside any HTTP client):

| File | Feature | Keep when | Loaded when editing |
| --- | --- | --- | --- |
| `data-fetching/02-api-services.md` | Structured service layer — typed DTOs, stateless functions, error handling | Project uses a formal service pattern | `src/services/**/*.ts`, `src/hooks/**/*.ts` |
| `data-fetching/03-data-layer.md` | Full data architecture — mocks → mapper → domain model → hook → UI | Project needs mock/DTO/mapper separation | `src/services/**/*.ts`, `src/hooks/**/*.ts`, `src/types/**/*.ts` |

### Testing (`.claude/rules/testing/`) — pick one

| File | Strategy | Loaded when editing |
| --- | --- | --- |
| `testing/01-vitest-rtl.md` | Vitest + React Testing Library — coverage, setup, test patterns | `src/**/*.test.ts`, `src/**/*.test.tsx` |

---

## Optional Feature Rules (`.claude/rules/features/`) — Include or Exclude

Delete any file whose feature the project does not need. See setup prompts above.

| File | Feature | Loaded when editing |
| --- | --- | --- |
| `features/01-storybook.md` | Storybook v8 — configuration contract, story file rules, 6-file vs 5-file component contract | `src/**/*.stories.tsx`, `.storybook/**/*.ts` |
| `features/02-notifications.md` | Toast notifications — hook-only usage, severity variants, async patterns | `src/hooks/**/*.ts`, `src/components/**/*.tsx`, `src/pages/**/*.tsx` |
| `features/03-internationalization.md` | i18n — runtime locale loading, `loadLocale()`, no bundled strings | `src/**/*.ts`, `src/**/*.tsx` |
| `features/04-animated-components.md` | Animation wrappers — `src/components/animated/`, component contract, no raw animation in pages | `src/components/**/*.tsx`, `src/pages/**/*.tsx` |

---

## Hooks (`.claude/hooks/`) — Automated Enforcement

These hooks run as PreToolUse/PostToolUse checks on Write and Edit operations:

| Hook | Enforces | Blocks |
| --- | --- | --- |
| `check-no-any.sh` | No explicit `any` in .ts/.tsx | Yes (exit 2) |
| `check-no-div-span.sh` | No `<div>` or `<span>` in .tsx — use semantic HTML or UI library primitives instead | Yes (exit 2) |
| `check-no-sx-prop.sh` | No `sx={}` prop in production .tsx | Yes (exit 2) |
| `check-no-inline-style.sh` | No inline `style={}` in .tsx | Yes (exit 2) |
| `check-no-hardcoded-colors.sh` | No hardcoded hex/rgb/rgba/hsl and no Tailwind palette classes (e.g. `bg-blue-500`) in .styles.ts and .tsx | Yes (exit 2) |
| `check-no-raw-dimensions.sh` | No raw px strings in styles.ts, no raw numeric dimension props in .tsx | Yes (exit 2) |
| `check-component-duplicate.sh` | Never create a new reusable component if one already exists — warns and lists existing components in `components/shared/` or `components/layout/` when a new component folder is created (PreToolUse on Write\|Edit) | Warning only |
| `check-component-files.sh` | Component folder has all required files including `ComponentName.styles.ts` — 6-file (Storybook on), 5-file (Storybook off), 4-file (logic-only) (PostToolUse on Write\|Edit) | Warning only |
| `check-no-inline-classnames.sh` | No multi-token className strings inlined in .tsx — must be extracted to `.styles.ts` (PostToolUse on Write\|Edit) | Warning only |
| `check-barrel-exports.sh` | New .ts/.tsx files in hooks/, components/, types/, constants/, services/, store/ must be re-exported from sibling index.ts (PostToolUse on Write) | Warning only |
| `check-tsc.sh` | `tsc --noEmit` after .ts/.tsx writes in src/ (PostToolUse, debounced 30s) | Warning only |
| `check-dependency-security.sh` | Blocks `git commit` when `npm audit` finds any vulnerability — run `/dependency-security` to fix | Yes (exit 2) |

All hooks skip test files (`*.test.*`), story files (`*.stories.*`), and theme files (`*/theme/*`).

Hook configuration is in `.claude/settings.json`.

### HTML Element Policy (Two-Tier)

| Tier | Elements | Rule |
| --- | --- | --- |
| **Forbidden** | `<div>`, `<span>` | No semantic meaning — always replace with a UI library primitive (shadcn/ui or MUI) or a semantic HTML element |
| **Allowed** | Structural: `<main>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`, `<nav>` | Permitted when no UI library primitive satisfies the semantic need |
| **Allowed** | Lists: `<ul>`, `<ol>`, `<li>` | Permitted when no UI library primitive satisfies the semantic need |
| **Allowed** | Typography: `<h1>`–`<h6>`, `<p>`, `<em>`, `<strong>`, `<small>`, `<mark>`, `<time>`, `<abbr>`, `<code>`, `<kbd>` | Permitted when no UI library primitive satisfies the semantic need |
| **Allowed** | Media: `<figure>`, `<figcaption>`, `<img>` | Permitted when no UI library primitive satisfies the semantic need |

The `check-no-div-span.sh` hook enforces the **Forbidden** tier automatically. Allowed elements must still be used intentionally — not as a convenience shortcut.

---

## Rules Not Covered by Hooks (Manual Compliance Required)

- **Component tier placement** — all custom components go in `components/shared/`, `components/layout/`, or `components/animated/` *(if enabled)*; pages NEVER own components (`core/02-project-structure.md`)
- **Separation of concerns** — Components vs Pages vs Store vs Services vs Hooks (`core/05-architecture.md`)
- **Reuse existing building blocks** before creating new ones (`core/04-execution-flow.md`)
- **Zustand**: no direct state mutation, domain-focused stores (`state-management/01-zustand.md`)
- **Redux Toolkit**: no direct mutation, typed hooks only, async logic in thunks (`state-management/02-redux-toolkit.md`)
- **Axios**: no raw Axios in UI components, typed responses, mapper usage (`data-fetching/01-axios.md`)
- **Forms (Zod)**: Zod schema, RHF resolver, Controller integration (`forms/01-rhf-zod.md`)
- **Forms (Yup)**: Yup schema, yupResolver, Controller integration (`forms/02-rhf-yup.md`)
- **Testing**: all required test cases, 100% coverage, ThemeProvider in render (`testing/01-vitest-rtl.md`)
- **Accessibility**: aria-labels, keyboard navigation, semantic elements (`core/08-accessibility.md`)
- **Responsive**: mobile-first breakpoint handling required for all projects — shadcn/Tailwind: use breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`) in `.styles.ts` and `dark:` classes for dark mode (`styling/shadcn/01-tailwind-shadcn-styling.md`); MUI: use theme breakpoints via `styled()` and theme palette for dark mode (`styling/mui/01-mui-styling.md`)
- **Naming intent**: business-purpose names, not generic labels (`core/02-project-structure.md`)
- **Final validation checklist**: lint, format, test, build all pass (`core/09-anti-patterns-checklist.md`)
- **Dependency security**: run `/dependency-security` to audit, fix, and document vulnerabilities before committing
- **className extraction** *(shadcn/Tailwind only)*: multi-token className strings must be in `.styles.ts` — single-token or `cn()` with imported base only inline (`styling/shadcn/01-tailwind-shadcn-styling.md`)
- **No Tailwind palette classes** *(shadcn/Tailwind only)*: use shadcn/ui semantic tokens (`bg-primary`, `text-muted-foreground`, etc.) never `bg-blue-500` (`styling/shadcn/01-tailwind-shadcn-styling.md`)
- **Barrel exports**: every new file in hooks/, components/, types/, constants/, services/, store/ must be re-exported from sibling `index.ts` (`core/03-coding-principles.md`)
- **`ApiResponse<T>` envelope**: all mock services must wrap results in `ApiResponse<T>`; hooks unwrap `.data` before storing (`data-fetching/01-axios.md`, full pattern in `data-fetching/03-data-layer.md`)
- **Schema placement**: form validation schemas (Zod or Yup) live in `ComponentName.schema.ts`, never inside `.tsx` or hooks (`forms/01-rhf-zod.md`, `forms/02-rhf-yup.md`)
- **Storybook** *(if enabled)*: `.storybook/main.ts` and `preview.ts` must follow the contract in `features/01-storybook.md`; components use the 6-file contract; if disabled, use 5-file contract and omit `.stories.tsx` everywhere
- **Error handling**: `ErrorBoundary` at root + page level, `AsyncState<T>` for async state, `unknown` in catch blocks (`core/10-error-handling.md`)
- **Performance**: no default `React.memo`/`useMemo`/`useCallback`, stable list keys, lazy pages, virtualize >50-item lists (`core/11-performance.md`)
- **Routing**: all routes in `src/config/routes.tsx`, `ProtectedRoute` with `<Outlet />`, `ROUTES` constants, loading state before redirect (`core/12-routing.md`)
- **Theming** *(if enabled)*: `ThemeProvider` at app root only, `useTheme()` only for runtime value, never for conditional styles (`styling/shadcn/02-theming.md`)
- **Notifications** *(if enabled)*: `toast()` only from hooks, never from UI components; use `toast.promise` for async (`features/02-notifications.md`)
- **i18n** *(if enabled)*: locale files in `public/locales/`, never imported into JS bundle, always loaded via `loadLocale()` (`features/03-internationalization.md`)
- **Animation wrappers** *(if enabled)*: no raw animation code in pages/components, all wrappers in `src/components/animated/`, 6-file contract applies (`features/04-animated-components.md`)
