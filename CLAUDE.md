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
| Styling library | shadcn/ui + Tailwind CSS v4 (`@tailwindcss/vite` — not PostCSS) — fixed for this template, not a choice |
| Icon source | `lucide-react` — fixed for this template, already installed |
| State management | Zustand — fixed for this template, not a choice |
| Forms & validation | React Hook Form + Yup or React Hook Form + Zod |
| Data fetching | Fetch-based `apiClient` + json-server (local mock backend) — fixed for this template, not a choice |
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

The `forms/` folder below still contains mutually exclusive files (RHF+Zod vs
RHF+Yup). **Keep only the file matching your chosen library; delete the rest.**
Styling, state management, and data fetching are all fixed for this template, not
choices — see each section below.

### Styling (`.claude/rules/styling/`) — fixed, not a choice

| Strategy | Files | Loaded when editing |
| --- | --- | --- |
| **shadcn/ui + Tailwind CSS v4** | `styling/shadcn/01-tailwind-shadcn-styling.md` — uses `@tailwindcss/vite` (not PostCSS) | `src/**/*.tsx`, `src/**/*.ts`, `src/**/*.css` |

Optional:

| File | Feature | Keep when | Loaded when editing |
| --- | --- | --- | --- |
| `styling/shadcn/02-theming.md` | Dark/light theme toggle via `next-themes` | Project needs theme switching | `src/**/*.tsx`, `src/**/*.ts` |

### Forms (`.claude/rules/forms/`) — pick one

| File | Strategy | Loaded when editing |
| --- | --- | --- |
| `forms/01-rhf-zod.md` | React Hook Form + Zod | `src/**/*.tsx`, `src/hooks/**/*.ts` |
| `forms/02-rhf-yup.md` | React Hook Form + Yup | `src/**/*.tsx`, `src/hooks/**/*.ts` |

### State Management (`.claude/rules/state-management/`) — fixed, not a choice

| File | Strategy | Loaded when editing |
| --- | --- | --- |
| `state-management/01-zustand.md` | Zustand — store structure, async actions, no direct mutation. Fixed for this template — once a project has real stores, never suggest switching. | `src/store/**/*.ts`, `src/hooks/**/*.ts` |

### Data Fetching (`.claude/rules/data-fetching/`) — fixed HTTP client + optional add-ons

| File | Strategy | Loaded when editing |
| --- | --- | --- |
| `data-fetching/01-fetch-client.md` | Fetch-based `apiClient` + json-server local mock backend — central client, typed responses, error handling | `src/services/**/*.ts`, `src/hooks/**/*.ts` |

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
| **Forbidden** | `<div>`, `<span>` | No semantic meaning — always replace with a shadcn/ui primitive or a semantic HTML element |
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
- **apiClient**: no raw `fetch` in UI components, typed responses, mapper usage (`data-fetching/01-fetch-client.md`)
- **Forms (Zod)**: Zod schema, RHF resolver, Controller integration (`forms/01-rhf-zod.md`)
- **Forms (Yup)**: Yup schema, yupResolver, Controller integration (`forms/02-rhf-yup.md`)
- **Testing**: all required test cases, 100% coverage, ThemeProvider in render (`testing/01-vitest-rtl.md`)
- **Accessibility**: aria-labels, keyboard navigation, semantic elements (`core/08-accessibility.md`)
- **Responsive**: mobile-first breakpoint handling required for all projects — use breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`) in `.styles.ts` and `dark:` classes for dark mode (`styling/shadcn/01-tailwind-shadcn-styling.md`)
- **Naming intent**: business-purpose names, not generic labels (`core/02-project-structure.md`)
- **Final validation checklist**: lint, format, test, build all pass (`core/09-anti-patterns-checklist.md`)
- **Dependency security**: run `/dependency-security` to audit, fix, and document vulnerabilities before committing
- **className extraction** *(shadcn/Tailwind only)*: multi-token className strings must be in `.styles.ts` — single-token or `cn()` with imported base only inline (`styling/shadcn/01-tailwind-shadcn-styling.md`)
- **No Tailwind palette classes** *(shadcn/Tailwind only)*: use shadcn/ui semantic tokens (`bg-primary`, `text-muted-foreground`, etc.) never `bg-blue-500` (`styling/shadcn/01-tailwind-shadcn-styling.md`)
- **Barrel exports**: every new file in hooks/, components/, types/, constants/, services/, store/ must be re-exported from sibling `index.ts` (`core/03-coding-principles.md`)
- **`ApiResponse<T>` envelope**: all services must wrap results in `ApiResponse<T>`; hooks unwrap `.data` before storing (`data-fetching/01-fetch-client.md`, full pattern in `data-fetching/03-data-layer.md`)
- **Schema placement**: form validation schemas (Zod or Yup) live in `ComponentName.schema.ts`, never inside `.tsx` or hooks (`forms/01-rhf-zod.md`, `forms/02-rhf-yup.md`)
- **Storybook** *(if enabled)*: `.storybook/main.ts` and `preview.ts` must follow the contract in `features/01-storybook.md`; components use the 6-file contract; if disabled, use 5-file contract and omit `.stories.tsx` everywhere
- **Error handling**: `ErrorBoundary` at root + page level, `AsyncState<T>` for async state, `unknown` in catch blocks (`core/10-error-handling.md`)
- **Performance**: no default `React.memo`/`useMemo`/`useCallback`, stable list keys, lazy pages, virtualize >50-item lists (`core/11-performance.md`)
- **Routing**: all routes in `src/config/routes.tsx`, `ProtectedRoute` with `<Outlet />`, `ROUTES` constants, loading state before redirect (`core/12-routing.md`)
- **Theming** *(if enabled)*: `ThemeProvider` at app root only, `useTheme()` only for runtime value, never for conditional styles (`styling/shadcn/02-theming.md`)
- **Notifications** *(if enabled)*: `toast()` only from hooks, never from UI components; use `toast.promise` for async (`features/02-notifications.md`)
- **i18n** *(if enabled)*: locale files in `public/locales/`, never imported into JS bundle, always loaded via `loadLocale()` (`features/03-internationalization.md`)
- **Animation wrappers** *(if enabled)*: no raw animation code in pages/components, all wrappers in `src/components/animated/`, 6-file contract applies (`features/04-animated-components.md`)

---

# Divami Design System Rules (Theming & Component Sourcing)

This section governs the **3-layer template model** used to reskin this
project for future clients without touching component code. It supplements
everything above — the rules above (structure, hooks, forms, etc.) still
apply in full. Where this section talks about "screens," read that as
`src/pages/`; where it says "components," read `src/components/`. Paths
below are already adapted to this repo's actual `src/`-based Vite layout
(the original draft of this section assumed a Next.js `/app/` layout —
that mapping has been corrected here).

**Core principle: you assemble, the theme styles.** Components in
`src/components/ui/` and `src/components/blocks/` are already wired to the
CSS variables defined in `src/styles/themes/theme.css`. You never apply
colors, fonts, or shadows directly in a screen or component — you only
pick and arrange components. Styling happens automatically through the
theme layer.

## 1. The three layers of this repo (never mix them)

| Layer | Location | Who owns it | Your access |
|---|---|---|---|
| **Design System (components)** | `src/components/ui/` and `src/components/blocks/` | System owner | READ + USE. Never restyle. |
| **Theme (all visual values)** | `src/styles/themes/theme.css` (built from `theme-template.css` in the same folder) | Designer | READ ONLY. Never edit unless explicitly asked. |
| **Screens** | `src/pages/` (including `src/pages/preview/` sample pages) | You + designer | You build these, using Layer 1 only. |

## 2. Component sourcing rules — READ CAREFULLY

### 2a. Component EXISTS in the local design system
Always check `src/components/ui/` and `src/components/blocks/` FIRST.
If the component exists there → import and use it as-is.
- Do NOT re-generate it from memory.
- Do NOT create a local variant or copy.
- Do NOT override its visual styling with extra classes or inline styles.
  Layout-only classes on the wrapper (grid, flex, gap, width, padding
  using spacing utilities) are allowed.

### 2b. Component DOES NOT exist in the local design system
**STOP. Do not build or invent it. Follow this exact workflow:**

**Step 1 — Ask permission.**
Tell the designer:
> "The design system does not have a `<component name>` component.
> May I bring one in from an outside source? Options:
> (a) official shadcn/ui registry (`npx shadcn add <name>`),
> (b) a community/registry source you specify,
> (c) I build a custom one following the token contract,
> (d) skip it / use an existing component differently.
> Which do you prefer?"

Then WAIT for the designer's answer. Do not proceed on assumption.

**Step 2 — Fetch/build from the source THE DESIGNER chose.**
After bringing it in, immediately harden it:
- Replace every hardcoded visual value (colors, fonts, shadows, radius)
  with the matching semantic variable from `theme-template.css`.
- Verify it renders correctly with the current `theme.css`.
- New primitives go in `src/components/ui/` (vendored, CLI-installed
  only); new composite/registry blocks go in `src/components/blocks/`.
  Custom one-offs that don't belong in either follow the existing
  `src/components/shared/` or `src/components/layout/` tiers instead
  (see `core/02-project-structure.md` and `core/05-architecture.md`).

**Step 3 — Ask again: add to the design system?**
Once the component works, ask the designer:
> "The `<component name>` component is working with the theme.
> Should I add it permanently to the local design system
> (`src/components/ui/` or `src/components/blocks/`) so all future
> screens and projects can reuse it?"

- If YES → move it into the appropriate tier, add it to the component
  index below, and note it in the changelog section.
- If NO → keep it local to the current screen's folder and clearly
  comment it as `// PROJECT-LOCAL COMPONENT — not part of design system`.

Never skip Step 1 or Step 3. Both confirmations are required, every time.

## 3. Styling rules (hard rules — zero exceptions)

1. **No raw visual values in screens or components.** Never write:
   - hex/rgb/hsl colors (`#E71E0E`, `rgb(...)`) → use `var(--primary)` etc.
   - raw Tailwind palette classes (`bg-red-500`, `text-gray-600`,
     `shadow-md`, `rounded-lg` with hardcoded intent) → use semantic
     classes wired to tokens (`bg-primary`, `text-muted-foreground`).
   - arbitrary values (`bg-[#ff0000]`, `shadow-[0_2px_...]`, `text-[13px]`).
2. **No inline `style={{ color: ... }}`** for any visual property.
3. **Fonts** only via `var(--font-sans)`, `var(--font-display)`,
   `var(--font-mono)` and the `--text-*` scale.
4. **Icons** only through `lucide-react` (installed by `shadcn init`) as
   used inside vendored `src/components/ui/` components. Never import a
   second icon library directly into a screen.
5. **If a screen needs a visual value that no token provides:**
   do not inline it. Tell the designer:
   > "This needs a new token (`--<suggested-name>`). It should be added
   > to the theme contract. Shall I propose it?"

## 4. Building new screens

1. Start from the closest sample page pattern under `src/pages/preview/`
   once those reference pages exist (dashboard-type, list/table-type,
   form-type — see the default template pages design prompt).
2. Compose ONLY from Layer 1 components (`src/components/ui/`,
   `src/components/blocks/`).
3. Use real, sensible content — no lorem ipsum unless asked.
4. Responsive by default (mobile → desktop), keyboard focus visible,
   respect `prefers-reduced-motion`.
5. Both light and dark mode must work (the theme defines both —
   never assume light-only).

## 5. Self-check before finishing ANY task

Run this checklist and fix violations before presenting work:

- [ ] No raw hex/rgb/hsl values outside `src/styles/`
- [ ] No arbitrary Tailwind values (`[...]`) for visual properties
- [ ] No raw palette classes (`*-red-*`, `*-gray-*`, `*-slate-*`, etc.)
- [ ] No inline visual styles
- [ ] Every component imported from `src/components/`, none re-implemented
- [ ] No direct icon library imports in screens (beyond `lucide-react`
      already used by vendored `src/components/ui/`)
- [ ] New components (if any) went through the Section 2b permission flow

## 6. Component index

> Keep this list updated whenever a component is added (Section 2b, Step 3).

**`src/components/ui/`** (primitives — vendored via `npx shadcn add`)
- accordion, alert, alert-dialog, aspect-ratio, attachment, avatar, badge,
  breadcrumb, bubble, button, button-group, calendar, card, carousel,
  chart, checkbox, collapsible, combobox, command, context-menu, dialog,
  direction, drawer, dropdown-menu, empty, field, hover-card, input,
  input-group, input-otp, item, kbd, label, marker, menubar, message,
  message-scroller, native-select, navigation-menu, pagination, popover,
  progress, radio-group, resizable, scroll-area, select, separator,
  sheet, sidebar, skeleton, slider, sonner, spinner, switch, table,
  tabs, textarea, toggle, toggle-group, tooltip
  <!-- update whenever `npx shadcn add <name>` installs a new primitive -->

**`src/components/blocks/`** (composites)
- *(empty — populate as shadcn registry blocks or larger composite
  patterns are added; update as blocks are created)*

## 7. Changelog of design-system additions

> Append one line per component added via the Section 2b flow:
> `YYYY-MM-DD — <component> — source: <shadcn/registry/custom> — approved by: <designer>`
