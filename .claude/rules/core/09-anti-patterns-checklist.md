---
description: Anti-patterns checklist, refactor rules, and final validation — always loaded for every task.
---

# Anti-patterns (auto-reject)

- `console.log`, `console.warn`, or `console.error` left in committed source files
- commented-out code blocks left in committed files
- unused imports, variables, or functions
- API call inside reusable button/card/modal component
- raw HTTP calls in UI component files
- giant store for unrelated concerns
- raw backend DTO rendered directly in UI
- duplicated fetch logic across components
- business logic in style files
- UI state mixed into service modules
- hardcoded theme values
- missing tests
- missing `types.ts` or `index.ts`
- using `<div>` or `<span>` anywhere in JSX — both are forbidden; replace with a UI library primitive or a semantic HTML element
- using local form state alongside a form library for the same field
- creating a custom component when a UI library primitive already satisfies the need
- placing a component inside a page folder — all custom components belong in `components/shared/` or `components/layout/`
- placing business-data components in `components/layout/` — layout is for page structure only

---

## Refactor-Specific Rule (Structure-Only)

During refactoring:

- UI, behavior, and responsiveness must remain **exactly the same**
- Refactor only structure, not logic or visuals
- Refactor **one component at a time**
- Any visible change = task failed

---

# Final Validation Checklist

> Items marked *(hook-enforced)* are automatically blocked by `.claude/hooks/` on Write/Edit. The checklist below covers both automated and manual checks.

- [ ] `npm run lint` exits with 0 errors
- [ ] `npm run format` completes successfully
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] `tsc --noEmit` exits with 0 errors *(hook-enforced — warning)*
- [ ] no explicit `any` *(hook-enforced)*
- [ ] no hardcoded design values *(hook-enforced)* — scan every style file and every component file for raw numbers (widths, heights, margins, padding, line-heights, max-widths, min-heights) and verify each references a design token
- [ ] no library-specific inline style props (e.g. `sx`) *(hook-enforced)*
- [ ] no inline `style` attribute *(hook-enforced)*
- [ ] no hardcoded colors or Tailwind palette classes *(hook-enforced)* — no `bg-blue-500` etc., use semantic tokens instead
- [ ] no multi-token className strings inlined in .tsx — extracted to `.styles.ts` *(shadcn/Tailwind — hook-enforced — warning)*
- [ ] no template literals in `className` — use `cn()` with imported base *(shadcn/Tailwind only)*
- [ ] no raw HTTP calls in UI components
- [ ] no direct state mutation in store
- [ ] all required files exist *(hook — warning)*
- [ ] every new module barrel-exported from sibling `index.ts` *(hook-enforced — warning)*
- [ ] all mock services return `ApiResponse<T>`; hooks unwrap `.data` before storing
- [ ] every form page has a co-located `ComponentName.schema.ts`
- [ ] no `<div>` or `<span>` in any .tsx file *(hook-enforced)*
- [ ] semantic HTML used intentionally — structural/typography/list/media elements chosen for meaning, not as a layout convenience
- [ ] accessibility verified
- [ ] responsive behavior verified (breakpoints; dark mode via `dark:` Tailwind classes)
- [ ] all new types, services, stores, hooks, components, and tests follow project structure
- [ ] no `console.log`, `console.warn`, or `console.error` left in source files
- [ ] no commented-out code blocks
- [ ] no unused imports or variables
- [ ] all environment variables accessed through `src/config/env.ts` — no direct `import.meta.env.*` in components or services
- [ ] API endpoint strings defined in `src/constants/api.constants.ts` — not hardcoded in service files
