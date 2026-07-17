---
description: Required execution flow before making changes — inspect, reuse, implement, verify. Always loaded.
---

# Required Execution Flow

Before making changes, the agent MUST:

1. Inspect existing related files in `src/components/layout`, `src/components/shared`, `src/store`, `src/services`, `src/hooks`, and `src/utils`
2. Reuse an existing pattern if one exists
3. List which files must be created or updated
4. Implement code
5. Verify all non-negotiable rules
6. Scan all style files and component files for raw numeric values — every dimension must use a design token from your chosen UI library's theme system.
7. **Never copy Figma output layout values blindly** — Figma-generated code reflects Figma's rendering model, not your UI library's component behavior. Always validate each layout property against how your actual UI components behave
8. Run `tsc --noEmit` and confirm zero TypeScript errors
9. Run final validation checks
10. Refuse to mark the task complete if any required file, test, or rule is missing

---

## If Anything Is Unclear (MANDATORY behavior)

Before writing code, Agent MUST:

1. Locate an existing similar component in `src/components/shared/**` or `src/components/layout/**` and mirror patterns.
2. Locate an existing similar store in `src/store/**` and mirror state/action structure.
3. Locate an existing similar API client/service in `src/services/**` and mirror HTTP client usage.
4. If none exists, ask for clarification and propose one recommended approach aligned with these rules.

---

## Reuse Existing Building Blocks (MANDATORY)

Search and reuse existing modules first from:

- `src/components/shared` — custom components already built for this app
- `src/components/layout` — structural wrappers already built for this app
- `src/lib` — framework-agnostic helpers; `utils.ts` contains the `cn()` helper *(shadcn/Tailwind projects)* and other pure utilities
- `src/utils`
- `src/hooks`
- `src/types`
- `src/constants`
- `src/services`
- `src/store`
- Existing feature-level validation files

Prefer extending an existing utility, type, hook, store slice, service, or shared/layout component over adding a duplicate with a different name.

**NEVER create a new reusable component if one that satisfies the need already exists in `src/components/shared/**` or `src/components/layout/**`** — extend or reuse it instead.

Introduce a new shared helper or component only when:

- no existing abstraction fits, and
- the behavior is reusable across multiple call sites
