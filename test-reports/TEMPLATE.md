# Feature Test Report — Tester <N>

**Feature task assigned:** (paste the assignment number and its description from the SKILL.md table)
**Your Node version:**
**Date:**

## Setup

- [ ] Clone completed without error
- [ ] `npm install` succeeded (note any warnings/vulnerabilities if relevant)
- [ ] `npm run mock-api` started successfully, if the task needed it

## The feature-building session

Paste or summarize what Claude Code actually did, briefly — not a full transcript,
just enough that someone reading this later understands the shape of what happened
(what files it created/touched, roughly in what order).

---

## Generated code — the most important section, do not skip or summarize

**Why this matters:** a self-assessment of "this follows the rules" is not
sufficient on its own — reviewing this needs to independently verify compliance
against the real rule files by reading the actual code, not by trusting a summary.
An agent auditing its own work can miss its own subtle violations.

Paste the **full content** of every new or meaningfully-changed file under `src/`
(the feature component(s), any new service/store/mapper/type file, `db.json`
changes, the routes file) below, one fenced code block per file, each clearly
labeled with its path:

```
### src/pages/products/... (label each file path exactly like this)

<paste full file content here>
```

---

## Rule compliance self-check

Go through this list against the code pasted above. Check what's actually true,
don't assume — this is a starting point for review, not a replacement for it.

**Component tiers (`core/02-project-structure.md`)**
- [ ] New components placed in the correct tier (feature-scoped under
      `pages/<page>/components/`, or promoted to `shared`/`blocks` only if
      genuinely reused elsewhere)
- [ ] No component created that duplicates one that already exists
- [ ] Every component folder has its required files (component, `.styles.ts`,
      `types.ts` if it has props, `.test.tsx`, `index.ts`)

**Styling (`styling/shadcn/01-tailwind-shadcn-styling.md`,
`styling/shadcn/04-composition-patterns.md`)**
- [ ] No hardcoded hex/rgb/rgba colors or Tailwind palette classes (`bg-blue-500`
      etc.) — semantic tokens only
- [ ] No inline `style` prop
- [ ] Multi-token `className`s extracted to `.styles.ts`, not inline in JSX
- [ ] Composition uses Base UI's `render` prop where needed, never `asChild`
- [ ] `Field`/`FieldGroup`/`FieldLabel` used for any form field — no raw `<div>` +
      `Label` + `Input` wrapper
- [ ] `Dialog`/`Sheet`/`Drawer` (if used) has a `Title` component, `sr-only` if
      hidden visually
- [ ] `Card` (if used) composed with its real sub-components
      (`CardHeader`/`CardTitle`/`CardContent`/etc.), not everything dumped in one
- [ ] `Avatar` (if used) has an `AvatarFallback`
- [ ] `TabsTrigger` (if used) is inside a `TabsList`
- [ ] Icons inside a `Button` alongside text have `data-icon`; no manual `size-*`
      sizing on icons inside vendored components
- [ ] Button loading states (if any) use `Spinner` + `data-icon` + `disabled`, not
      an `isLoading`/`isPending` prop
- [ ] `SelectItem`/`DropdownMenuItem`/`CommandItem` (if used) are inside their
      required `Group` component

**Data fetching (`data-fetching/01-fetch-client.md`, `02-api-services.md`,
`03-data-layer.md`)**
- [ ] No raw `fetch` calls in a component — always through `apiClient` via a
      service
- [ ] Service functions return `ApiResponse<T>`; hooks unwrap `.data`
- [ ] DTO → domain model mapping goes through a mapper, not inline in the component

**State management (`state-management/01-zustand.md`)**
- [ ] No direct store state mutation
- [ ] Store is domain-focused, not a catch-all
- [ ] Only necessary slices selected in components (not the whole store object)

**Forms (`forms/01-rhf-zod.md`)**
- [ ] Zod schema in a co-located `.schema.ts`, not inline in the component or hook
- [ ] `data-invalid`/`aria-invalid` wired from RHF's `formState.errors`

**Theme versioning (`styling/shadcn/03-theme-versioning.md`) — if this task
touched theming**
- [ ] Candidate filenames match the naming convention
      (`YYYY-MM-DD_<round>_v<N>-<descriptor>.css`)
- [ ] Every candidate has a matching `THEME-LOG.json` entry
- [ ] Promoted candidate's content copied verbatim into `theme.css`; the losing
      candidate(s) still exist in `history/`, not deleted

**Testing**
- [ ] Every new component/hook/service has a co-located test file
- [ ] Tests assert real behavior (render, interaction, error states), not just
      "renders without crashing"

## Hook behavior observed

Fill in one row per hook that actually fired (blocked or warned) during the
session. Leave blank / write "none fired" if nothing did.

| Hook | What triggered it | Correct block/warning, or false positive? | Notes |
|---|---|---|---|
| | | | |

## Anything that should have been caught by a hook, but wasn't

Describe any case where the code (per the self-check above) violates a rule but no
hook caught it. Be specific — quote the actual code/pattern.

## Rule/`CLAUDE.md`/`AGENTS.md` guidance gaps

Anywhere the written rules were unclear, missing, or contradicted what actually
made sense for this task. Include what was done instead (guessed, picked something
inconsistent with docs).

## Final verification

| Check | Result |
|---|---|
| `npm run lint` | |
| `npx tsc -b` | |
| `npm run test` | |
| `npm run build` | |

## Workflow steps followed, in order (Round 2 / theme-versioning repeatability runs only)

If this report is a `tester-4-repeat-*` run, list exactly what was done, as a plain
numbered list (e.g. "1. Created file X. 2. Added log entry with status candidate.
3. ..."), so this can be compared line-by-line against other repeat runs. Leave this
section out entirely for Round 1 assignments (1–6, non-repeat).

## Assumptions made

If this ran via the `run-feature-test` skill (autonomous, no questions asked), list
every judgment call it made where something was ambiguous — what it chose and why.
Write "N/A, ran interactively" if a human worked through this and decided things
live instead.

## Anything else worth flagging

Free-form — anything that doesn't fit above but seems worth knowing when this
report gets reviewed.
