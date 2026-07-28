# STRICT COMPLIANCE REQUIRED

Every instruction in this file and all `.claude/rules/**/*.md` files is REQUIRED, not optional. Violations should be treated as code rejection conditions.

# Frontend Engineering Guidelines

All guidelines are organized into `rules` (contextual guidance) and `hooks` (automated enforcement).

## Default Behavior

- Follow these instructions by default for every task.
- Treat manual rules the same as automated rules unless the user explicitly asks to change repository policy.
- Load and obey the relevant `.claude/rules/**/*.md` files before proposing or generating code.
- Prefer refactoring to compliance over shipping code that only partially matches the repository rules.

## Rules (`.claude/rules/`)

### Always loaded — `core/` (apply to every task)

| File | Domain |
| --- | --- |
| `core/01-tech-stack.md` | Tech stack, bootstrap checklist |
| `core/02-project-structure.md` | Folder structure, component contract, naming rules |
| `core/03-coding-principles.md` | General coding guidelines, core principles, non-negotiable rules |
| `core/04-execution-flow.md` | Required execution flow, reuse guidelines |
| `core/05-architecture.md` | Separation of concerns, directory intent |
| `core/06-typescript.md` | TypeScript strict mode, enforcement rules |
| `core/07-react-hooks.md` | Component responsibilities, hooks requirements |
| `core/08-accessibility.md` | Accessibility requirements |
| `core/09-anti-patterns-checklist.md` | Auto-reject patterns, refactor rules, final validation checklist |
| `core/10-error-handling.md` | Error boundaries, `AsyncState<T>`, action error returns |
| `core/11-performance.md` | Memoization, lazy loading, list keys, bundle size |
| `core/12-routing.md` | React Router v8 data mode, `ProtectedLayout`, `ROUTES` constants |
| `core/13-environment.md` | Environment variables, typed config module |
| `core/14-security.md` | XSS prevention, token storage, secrets policy |

### Conditionally loaded (load when editing matching files)

| File | Domain | Loaded when editing |
| --- | --- | --- |
| `styling/shadcn/01-tailwind-shadcn-styling.md` | shadcn/ui + Tailwind CSS v4 styling rules, forbidden patterns, theme tokens | `src/**/*.styles.ts`, `src/**/*.tsx`, `src/**/*.css` |
| `styling/shadcn/02-theming.md` | Dark/light theme toggle via `next-themes` *(if enabled)* | `src/**/*.tsx`, `src/**/*.ts` |
| `styling/shadcn/04-composition-patterns.md` | shadcn/ui composition patterns — always active | `src/**/*.tsx` |
| `data-fetching/01-fetch-client.md` | Fetch-based `apiClient` + json-server, service patterns, error handling | `src/services/**/*.ts`, `src/hooks/**/*.ts` |
| `data-fetching/02-api-services.md` | Structured service layer, typed DTOs *(if enabled)* | `src/services/**/*.ts`, `src/hooks/**/*.ts` |
| `data-fetching/03-data-layer.md` | Full mock/mapper/DTO data architecture *(if enabled)* | `src/services/**/*.ts`, `src/hooks/**/*.ts`, `src/types/**/*.ts` |
| `state-management/01-zustand.md` | Zustand store structure, async actions — fixed for this template | `src/store/**/*.ts`, `src/hooks/**/*.ts` |
| `forms/01-rhf-zod.md` | React Hook Form + Zod, `Field`/`FieldGroup` composition | `src/**/*.tsx`, `src/hooks/**/*.ts` |
| `testing/01-vitest-rtl.md` | Vitest + React Testing Library rules, coverage requirements | `src/**/*.test.ts`, `src/**/*.test.tsx` |
| `features/02-notifications.md` | Toast notifications *(if enabled)* | `src/hooks/**/*.ts`, `src/components/**/*.tsx`, `src/pages/**/*.tsx` |
| `features/03-internationalization.md` | i18n, runtime locale loading *(if enabled)* | `src/**/*.ts`, `src/**/*.tsx` |
| `features/04-animated-components.md` | Animation wrappers *(if enabled)* | `src/components/**/*.tsx`, `src/pages/**/*.tsx` |

## Hooks (`.claude/hooks/`) - Automated Enforcement

These hooks run as pre/post write checks:

| Hook | Enforces | Blocks |
| --- | --- | --- |
| `check-no-any.sh` | No explicit `any` in .ts/.tsx | Yes |
| `check-no-inline-style.sh` | No inline `style={}` in .tsx | Yes |
| `check-no-hardcoded-colors.sh` | No hardcoded hex/rgb/rgba/hsl and no Tailwind palette classes in styles.ts and .tsx | Yes |
| `check-no-raw-dimensions.sh` | No raw px strings in styles.ts, no raw numeric dimension props in .tsx | Yes |
| `check-component-duplicate.sh` | Warns before creating a new component if one already exists in `layout/`, `shared/`, `blocks/`, or a page's feature-scoped `components/` | Warning only |
| `check-component-files.sh` | Component folder has all 5 required files (4 for logic-only components) — no Storybook | Warning only |
| `check-no-inline-classnames.sh` | Multi-token className strings inlined in .tsx must be extracted to `.styles.ts` | Warning only |
| `check-barrel-exports.sh` | New module not re-exported from sibling `index.ts` | Warning only |
| `check-tsc.sh` | `tsc --noEmit` after .ts/.tsx writes in src/ | Warning only |
| `check-dependency-security.sh` | Blocks `git commit` when `npm audit` finds any vulnerability | Yes |

All hooks skip test files, story files, and theme files as configured in `.claude/settings.json`.

`<div>`/`<span>` are allowed — the idiomatic layout building blocks on this
shadcn/ui + Tailwind stack. Prefer a shadcn/ui primitive or a genuinely-fitting
semantic element first; never force one that doesn't actually apply. See
`core/03-coding-principles.md`'s HTML Element Policy.

## Rules Not Covered by Hooks (Manual Compliance Required)

- Component tier placement — `components/shared/`, `components/blocks/`, `components/layout/`, `components/animated/` *(if enabled)*, or a page's feature-scoped `components/` folder (`core/02-project-structure.md`)
- Separation of concerns - Components vs Pages vs Store vs Services vs Hooks (`core/05-architecture.md`)
- Reuse existing building blocks before creating new ones (`core/04-execution-flow.md`)
- Zustand: no direct state mutation, domain-focused stores, route-tied data stays in the loader, never duplicated into a store (`state-management/01-zustand.md`)
- `apiClient`: no raw fetch in UI components, typed responses, mapper usage (`data-fetching/01-fetch-client.md`)
- Forms: Zod validation, RHF resolver, `Field`/`FieldGroup` composition (`forms/01-rhf-zod.md`)
- Testing: all required test cases, `ThemeProvider` wrapper only when the component under test calls `useTheme()`, loader/action testing conventions, expected coverage requirements (`testing/01-vitest-rtl.md`)
- Accessibility: aria-labels, keyboard navigation, semantic elements used intentionally (`core/08-accessibility.md`)
- Responsive behavior: breakpoint-based styling in `.styles.ts` (`styling/shadcn/01-tailwind-shadcn-styling.md`)
- Naming intent: business-purpose names, not generic labels (`core/02-project-structure.md`)
- Routing: React Router v8 data mode, `createBrowserRouter`/`RouterProvider`, `ProtectedLayout` loader-based redirect (`core/12-routing.md`)
- Final validation checklist: lint, format, test, build all pass (`core/09-anti-patterns-checklist.md`)

## Implementation Expectations

- Inspect existing related files before generating new code.
- Reuse existing components, hooks, stores, services, types, and utilities first.
- Do not use `any`, inline styles, raw dimensions, or hardcoded colors.
- Keep styling in `ComponentName.styles.ts`, typing in `types.ts`, and exports in `index.ts`.
- When creating a reusable component, include the full required component contract (5 files — no Storybook):
  - `ComponentName.tsx`
  - `ComponentName.styles.ts`
  - `types.ts`
  - `ComponentName.test.tsx`
  - `index.ts`
  - Logic-only components (no visual UI) use a 4-file contract instead — no `.styles.ts`.

## Verification Expectations

Before considering code complete:

- Run or account for `tsc --noEmit` (or `tsc -b`)
- Run or account for `npm run lint`
- Run or account for `npm run test`
- Run or account for `npm run build`
- Confirm relevant `.claude/rules/**/*.md` guidance has been followed, not just the automated hooks
