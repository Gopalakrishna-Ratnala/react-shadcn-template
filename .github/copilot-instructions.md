# STRICT COMPLIANCE REQUIRED

Every instruction in this file and all `.claude/rules/*.md` files is REQUIRED, not optional. Violations should be treated as code rejection conditions.

# Frontend Engineering Guidelines

All guidelines are organized into `rules` (contextual guidance) and `hooks` (automated enforcement).

## Default Behavior

- Follow these instructions by default for every task.
- Treat manual rules the same as automated rules unless the user explicitly asks to change repository policy.
- Load and obey the relevant `.claude/rules/*.md` files before proposing or generating code.
- Prefer refactoring to compliance over shipping code that only partially matches the repository rules.

## Rules (`.claude/rules/`)

### Always loaded (apply to every task)

| File | Domain |
| --- | --- |
| `01-tech-stack.md` | Tech stack, bootstrap checklist |
| `02-project-structure.md` | Folder structure, component contract, naming rules |
| `03-coding-principles.md` | General coding guidelines, core principles, non-negotiable rules |
| `04-execution-flow.md` | Required execution flow, reuse guidelines |
| `05-architecture.md` | Separation of concerns, directory intent |
| `15-anti-patterns-checklist.md` | Auto-reject patterns, refactor rules, final validation checklist |

### Conditionally loaded (load when editing matching files)

| File | Domain | Loaded when editing |
| --- | --- | --- |
| `06-styling.md` | Styling rules, forbidden patterns, theme tokens, responsive rules | `src/**/styles.ts`, `src/**/*.tsx` |
| `07-typescript.md` | TypeScript strict mode, enforcement rules | `src/**/*.ts`, `src/**/*.tsx` |
| `08-axios-services.md` | Axios architecture, service patterns, error handling | `src/services/**/*.ts`, `src/hooks/**/*.ts` |
| `09-zustand-state.md` | Zustand usage, store structure, async actions | `src/store/**/*.ts`, `src/hooks/**/*.ts` |
| `10-react-hooks.md` | Component responsibilities, hooks requirements | `src/**/*.tsx`, `src/hooks/**/*.ts` |
| `11-forms.md` | React Hook Form + Zod rules | `src/**/*.tsx`, `src/hooks/**/*.ts` |
| `13-testing.md` | Testing rules, coverage requirements | `src/**/*.test.ts`, `src/**/*.test.tsx` |
| `14-accessibility.md` | Accessibility requirements | `src/**/*.tsx` |

## Hooks (`.claude/hooks/`) - Automated Enforcement

These hooks run as pre/post write checks:

| Hook | Enforces | Blocks |
| --- | --- | --- |
| `check-no-any.sh` | No explicit `any` in .ts/.tsx | Yes |
| `check-no-div-span.sh` | No `<div>`, `<span>`, `<p>`, `<h1>`-`<h6>` in .tsx | Yes |
| `check-no-sx-prop.sh` | No `sx={}` prop in production .tsx | Yes |
| `check-no-inline-style.sh` | No inline `style={}` in .tsx | Yes |
| `check-no-hardcoded-colors.sh` | No hardcoded hex/rgb/rgba/hsl in styles.ts and .tsx | Yes |
| `check-no-raw-dimensions.sh` | No raw px strings in styles.ts, no raw numeric dimension props in .tsx | Yes |
| `check-component-files.sh` | Component folder has all 6 required files | Warning only |
| `check-tsc.sh` | `tsc --noEmit` after .ts/.tsx writes in src/ | Warning only |

All hooks skip test files, story files, and theme files as configured in `.claude/settings.json`.

## Rules Not Covered by Hooks (Manual Compliance Required)

- Separation of concerns - Components vs Pages vs Store vs Services vs Hooks (`05-architecture.md`)
- Reuse existing building blocks before creating new ones (`04-execution-flow.md`)
- Zustand: no direct state mutation, domain-focused stores (`09-zustand-state.md`)
- Axios: no raw Axios in UI components, typed responses, mapper usage (`08-axios-services.md`)
- Forms: Zod validation, RHF resolver, Controller integration (`11-forms.md`)
- Testing: all required test cases, ThemeProvider in render, expected coverage requirements (`13-testing.md`)
- Accessibility: aria-labels, keyboard navigation, semantic elements (`14-accessibility.md`)
- Responsive behavior: breakpoint-based styling in `styles.ts` (`06-styling.md`)
- Naming intent: business-purpose names, not generic labels (`02-project-structure.md`)
- Final validation checklist: lint, format, test, build all pass (`15-anti-patterns-checklist.md`)

## Implementation Expectations

- Inspect existing related files before generating new code.
- Reuse existing components, hooks, stores, services, types, and utilities first.
- Do not use `any`, inline styles, raw dimensions, hardcoded colors, or non-semantic JSX blocked by repo policy.
- Keep styling in `styles.ts`, typing in `types.ts`, and exports in `index.ts`.
- When creating a reusable component, include the full required component contract:
  - `ComponentName.tsx`
  - `styles.ts`
  - `types.ts`
  - `ComponentName.stories.tsx`
  - `ComponentName.test.tsx`
  - `index.ts`

## Verification Expectations

Before considering code complete:

- Run or account for `tsc --noEmit`
- Run or account for `npm run lint`
- Run or account for `npm run test`
- Run or account for `npm run build`
- Confirm relevant `.claude/rules/*.md` guidance has been followed, not just the automated hooks
