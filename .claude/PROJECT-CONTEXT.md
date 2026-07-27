# Project Context — Read This First, Every New Session

This file exists because chat sessions don't persist. If you're Claude, starting fresh
with this repo and no memory of prior conversation: **read this file completely before
doing anything else.** It is the source of truth for intent, decisions made, and what's
still open. Keep it updated as work progresses — this is a living document, not a
one-time snapshot.

---

## 1. What this repo actually is, and why the rules matter more than usual

This is Divami's boilerplate for spinning up new React + shadcn/ui projects. But the
critical thing that makes this different from a normal boilerplate:

**Designers will prompt Claude directly to build the app — not developers.** The
workflow is: client + PO + designer discuss requirements → designer prompts Claude with
the design/feature intent → Claude generates the code → little to no developer review
in between. No Figma-first handoff; the designer's prompts *are* the spec.

This means `.claude/rules/`, `.claude/hooks/`, and `CLAUDE.md`/`AGENTS.md` aren't just
"nice conventions" — **they are the substitute for code review.** A hardcoded hex value,
a stray `<div>`, an `asChild` used where Base UI needs `render`, a duplicate component —
none of that gets caught by a human unless the rules/hooks catch it first. Every rule
audit, every hook fix, matters more here than in a normal project because there may be
no other backstop.

Standard expected throughout: **no duplicate code, no dead code, full consistency, and
every dependency's own idiomatic conventions actually followed** (not just "looks like
shadcn" but verified against shadcn's real current docs; same bar for every other lib).

---

## 2. Repo identity (established via direct evidence, not assumption)

- Built by **Divami** (Divami Design Labs) — confirmed via `CLAUDE.md`'s "Divami Design
  System Rules" heading and via actual git commit author email (`vinay@divami.com`) on
  the components-listing branch.
- Origin (original template repo): `https://github.com/divamidesignlabs/shadcn-template.git`
  — we do **not** have push access to this and should not attempt to push there. This is
  still the `origin` remote configured on this actual working directory (never
  repointed) — do NOT assume `git push origin ...` reaches our own repo.
- Our own working copy for this effort: `https://github.com/Gopalakrishna-Ratnala/react-shadcn-template.git`
  — single branch, `main`, is the source of truth there (feature branches were
  consolidated and deleted per user request). **This is not configured as a remote on
  this working directory at all.** Every push so far was done via a *separate throwaway
  clone* with a temporary `staging` remote (token embedded in the URL, pushed once,
  remote removed immediately after) — never by changing this checkout's `origin`. If a
  future session wants to push again, either repeat that throwaway-clone pattern, or
  deliberately add a permanent second remote (e.g. `git remote add fork <url>`) if that's
  preferred going forward — don't assume one already exists.
  Push access requires a fresh, narrowly
  scoped, short-lived fine-grained PAT each time (Contents: Read/write only) — generate,
  use once, revoke immediately after. Never assume a previously-used token still works;
  always ask before reusing.
- `components.json` → `"style": "base-nova"` → **Base UI** backend, NOT Radix UI. This
  matters: composition uses the `render` prop, never `asChild`. Confirmed directly in
  vendored `button.tsx` (wraps `ButtonPrimitive` from `@base-ui/react/button`, no
  `asChild` handling).
- Scope, confirmed by user: **pure frontend, fully local, no deployment, no real
  backend for now.** Mock data layer will use **json-server** (not yet wired up — see
  Section 5, open item).

---

## 3. Commit history framing — IMPORTANT, do not violate this

On the working repo (`Gopalakrishna-Ratnala/react-shadcn-template`), current `main`:

```
014edb1  chore: remove MUI rules and guardrails, shadcn-only
12ab3dd  docs: refresh shadcn styling rules against current official docs
916f6a2  feat: combined dev check branchs
053d50a  made components list page
117d42e  shadcn/ui components setup and rules were updated   <-- real baseline ends here
e1ce00b  Initial commit                                        <-- real baseline starts here
```

**Only the first two commits (`e1ce00b`, `117d42e`) are the real, standardized
boilerplate baseline.** Everything after that — the components-listing/theming-v2
work, `ComponentsGalleryPage`, the `blocks/` components (FilterBar, PageHeader,
StatCard, StatusBadge), the `pages/preview/*` demo app (dashboard/listing/details/form),
`useProjects`, the mock services, the shadcn-rules-refresh commit, the MUI-removal
commit — **all of it was research/exploration/validation work.** It was useful for
proving things out (e.g. we used it to verify the hooks actually catch violations in
real generated code — they did, near-perfectly), but it is **not** to be treated as
settled precedent or extended as-is going forward.

**Git housekeeping — executed, pending final confirmation (see Section 6 for full
detail):**
- `reference/research-exploration` branch created at the old `main` tip — everything
  preserved permanently, browsable, never deleted.
- `standardize/clean-baseline` branch built fresh from `117d42e`, with only the
  validated infra/standardization commits cherry-picked on top (rules refresh, MUI
  removal, this context file, Prettier+Figma fix, hook fix, context update) — research
  commits and the research-only formatting commit deliberately excluded.
- Validating this in isolation surfaced two real, previously-hidden baseline bugs
  (missing `src/hooks/use-mobile.ts` and `src/test/setup.ts` — both restored, see
  Section 6). Full validation (install, format, typecheck, lint, test, **build**) all
  pass on this branch now.
- **Not yet done:** replacing `main` with this branch, or touching the remote. Holding
  for explicit confirmation since this rewrites already-pushed history.

---

## 4. Decisions made so far (locked in, don't re-litigate without reason)

### Styling / component library
- **shadcn/ui + Tailwind CSS v4 only.** MUI fully removed (rules folder, `check-no-sx-prop.sh`
  hook, all doc references) — this was completed and committed (`014edb1`). Confirmed
  via `package.json`: no MUI deps ever existed. `src/theme/` (MUI-only empty scaffold)
  also deleted.
- Composition pattern: Base UI `render` prop, not Radix `asChild`. Documented in
  `styling/shadcn/01-tailwind-shadcn-styling.md`.
- CSS variable tokens: this project's own theme files intentionally use **hex**, not
  oklch (documented choice, for designer readability) — this is fine, not a bug.
  shadcn's *current* default theme uses oklch; both are valid CSS, just noted the
  difference so nobody "fixes" this project's hex values thinking they're stale.
- Dark/light theming: uses `next-themes`, which is the project's pragmatic choice —
  NOT literally shadcn's "official" recommendation for Vite (shadcn's actual Vite
  dark-mode doc uses a hand-rolled Context+localStorage provider; `next-themes` is
  officially prescribed for Next.js specifically). Doc corrected to state this
  accurately rather than overclaim.

### Theme iteration / versioning workflow (planned, not yet built)
Problem being solved: designers arrive with **specific values already in mind** (their
own design sense / inspiration, not values Claude invents) and need Claude to *apply*
them correctly. Client then picks a winner among candidates, shown via the **local Vite
dev server** (hot-reload makes live A/B comparison trivial — no deploy, no runtime
multi-theme switcher needed, no new app code required for the comparison step itself).

Requirement, confirmed by user: **(a)** the app only ever runs one active theme at
runtime (no architectural multi-theme-at-once complexity needed in the app itself), but
**(c)** this same candidate-comparison process repeats for future feature work too, not
just the one initial design round. Multiple theme *versions* must persist as real files
in the repo (not just transient overwrites, not just git history) — because the process
recurs indefinitely.

**Agreed structure (not yet implemented):**
```
src/styles/themes/
  theme.css                          <- ALWAYS the one active theme; what the app imports
  theme-template.css                 <- existing blank starter, unchanged
  history/
    THEME-LOG.json                   <- structured log, see schema below
    2026-07-24_initial-design_v1-navy-corporate.css
    2026-07-24_initial-design_v2-warm-earth.css
    2026-07-24_initial-design_v3-bold-tech.css      <- e.g. client-approved one
    2026-08-10_reporting-feature_v1-dense-data.css
```
- Naming: `YYYY-MM-DD_<round-or-feature-slug>_v<N>-<short-descriptor>.css`
- `THEME-LOG.json` chosen over markdown **specifically because of future enhancement
  potential** — a "theme history" tab could eventually be built into a component
  showcase page, and JSON is directly consumable by that; also more mechanically
  validatable by a future hook (e.g. "every candidate file has a matching log entry").
  Schema:
  ```json
  {
    "date": "2026-07-24",
    "round": "initial-design",
    "file": "2026-07-24_initial-design_v3-bold-tech.css",
    "status": "approved",
    "notes": "Client preferred stronger accent contrast over v1/v2"
  }
  ```
  `status` values: `"candidate"` | `"rejected"` | `"approved"`.
- Promotion: when a candidate is approved, its contents get copied verbatim into the
  real `theme.css`; the log entry updates to `"approved"`.
- **Rejected candidates are NEVER auto-deleted.** User will manually delete if/when they
  want to tidy up. Hooks/checks must treat everything under `history/` as intentional
  archive, not dead code to flag.
- Still needed: a new rule file (proposed name `styling/shadcn/03-theme-versioning.md`)
  documenting this entire flow for Claude — how to create a candidate, name it, log it,
  and promote it. **Now implemented — see Section 6 for full detail.**

### Other repo-wide standing rules from earlier work (already fixed, stay fixed)
- shadcn rule docs refreshed against current official docs (chart/sidebar tokens added,
  `globals.css` path references corrected to actual `src/styles/themes/theme.css`,
  `next-themes` claim corrected, oklch example updated) — commit `12ab3dd`.

---

## 5. Known open problems — not yet fixed, need attention

Roughly in the order Claude suggested tackling them (user has not yet confirmed which
to start with):

**A. Rules still stale or undecided, need the same audit shadcn/MUI already got:**
- ~~`data-fetching/` — currently assumes Axios...~~ **DONE.** See Section 6 for full
  detail — rewritten around json-server + a fetch-based `apiClient`, real HTTP calls,
  real `db.json`, real async loading states.
- `forms/` (RHF+Zod vs RHF+Yup — package.json only has zod, no yup — the "pick one"
  decision was never actually finalized in the docs)
- `testing/`, `core/` — haven't had a "verify against current official docs" pass yet
  the way shadcn did.
- Every remaining "pick one, delete the rest" placeholder (state management: Zustand vs
  Redux Toolkit — neither installed yet) needs an actual decision made, not left open.

**B. ~~Three hooks have a real, unfixed bug~~ — FIXED.** `check-barrel-exports.sh`,
`check-component-duplicate.sh`, `check-no-inline-classnames.sh` previously printed a
warning to stderr then unconditionally `exit 0`. Claude Code silently discards
`PostToolUse` hook output on exit 0 — so these warnings never reached a live session.
Fixed: kept `exit 0`, but now emit
`{"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": "..."}}`
as JSON on stdout instead of plain stderr text (confirmed against Claude Code's actual
docs). Validated by direct invocation with synthetic `tool_input` JSON for every branch
of every hook — all produce valid, well-formed JSON with correct escaping, and clean/
no-violation cases still produce zero output with exit 0 as before.

**C. ~~Component tier system needs to be made explicit and unambiguous~~ — DONE.**
`core/02-project-structure.md` rewritten with:
- `blocks/` formalized as a real tier (it already existed as a scaffolded folder with
  zero documentation — a real gap). Distinguished precisely from `shared/`: `blocks/`
  components carry no domain-specific data (generic props only — would work unmodified
  in a different project); `shared/` components reference this app's actual domain
  entities.
- A new **feature-scoped tier** (`pages/{page}/components/`) for components used by
  exactly one page — this didn't exist before; the old rule said "pages NEVER own
  components," which forced every single custom component into `shared/` regardless of
  whether it was ever going to be reused, which is itself a duplication-risk pattern
  (no natural place for "not proven reusable yet" led to either premature promotion or
  people ignoring the rule).
- An explicit **Promotion Rule**: a feature-scoped component MUST be moved (not
  copy-pasted) to `shared/` or `blocks/` the moment a second page/feature needs it — no
  duplicate, no re-export shim left behind.
- Full six-way decision tree (ui → layout → animated → feature-scoped → blocks →
  shared), walked in order, stop at first match.

**Two more real, previously-hidden hook bugs surfaced and fixed while validating this:**
- `check-component-duplicate.sh` only ever checked `layout/` and `shared/` — `blocks/`
  (despite being a real folder) and the new feature-scoped `pages/*/components/` tier
  were completely unchecked. Rewritten to cover all four locations generically (derives
  the tier name and base dir from the path itself rather than hardcoding two branches).
- `check-barrel-exports.sh` was **actively misfiring** on vendored `ui/` files — it would
  tell Claude to create a barrel export for shadcn CLI primitives, directly contradicting
  "ui/ is never manually edited" and the fact that shadcn's CLI never creates a barrel
  file there (each primitive is imported by direct path). Fixed with an explicit skip.

Both hooks re-tested directly (same method as item B — synthetic `tool_input` JSON
covering every branch) after the rewrite: `blocks/` duplicate-detection, feature-scoped
`pages/*/components/` duplicate-detection (including correct page-name extraction),
`ui/` no-longer-misfiring, and regression tests on the pre-existing `layout/`/`hooks/`
branches all confirmed still correct.

**Known follow-up, not yet done:** `check-barrel-exports.sh`'s tracked-directory
matching still won't catch a missing barrel file inside `pages/{page}/components/{name}/`
(it only matches `/src/components/` as a path substring, which doesn't appear in that
nested path). Lower priority than the two fixes above since each component folder's own
file-contract check already requires an `index.ts` regardless — this hook is a secondary
backstop, not the only enforcement. Worth fixing if it becomes a real gap in practice.

**D. Theme-versioning system** — planned in full above (Section 4), not yet built.

**E. A real, from-scratch component showcase page** — same *purpose* as the research
branch's `ComponentsGalleryPage` (living reference of every primitive + theme preview),
rebuilt clean against the finalized tier system (C) and theme-versioning setup (D), not
extended from the exploratory version per the Section 3 framing.

**F. `.github/copilot-instructions.md` has broader staleness** beyond the MUI mentions
already cleaned up — it references a rule-file numbering scheme
(`06-styling.md`, `08-axios-services.md`, `09-zustand-state.md`) that doesn't match the
current folder structure (`styling/`, `data-fetching/`, `state-management/`) at all —
leftover from before the v0.1.0 reorg. Only the MUI-specific lines were fixed so far;
the rest of this file still needs a full refresh.

**Claude's suggested next step (not yet confirmed by user):** start with A + B — pure
rules/hooks hygiene, zero new features, lowest risk, raises the reliability bar for
everything built after. Then C (tier system), since D and E both depend on it being
settled first.

---

## 6. Updates since this file was first written

- **Baseline (commits 1-2) validated** against React/TS ecosystem standards. Config
  (tsconfig, eslint.config.js, vite.config.ts) confirmed solid and current — closely
  matches Vite's and shadcn's own official scaffolds. Three gaps found, later resolved
  (see below for a correction to how one of these was tracked):
  1. `vite.config.ts` referenced `src/test/setup.ts` — **this really was missing from
     the true baseline.** An earlier note here incorrectly said this was "already fixed
     by the research-branch work" — that check was run against `main`, which already
     had the research commits (which happened to add this file for their own reasons)
     sitting on top, masking the gap. Validating the baseline in true isolation (see
     git housekeeping below) proved it out: `tsc -b` fails immediately on a clean
     checkout of commits 1-2 alone. Properly fixed now — see below.
  2. No Prettier/`.editorconfig` anywhere — fixed: added `.prettierrc` +
     `.prettierignore` (excludes vendored `src/components/ui/`) + `prettier-plugin-tailwindcss`
     pointed at `src/index.css` as the Tailwind v4 stylesheet entry, plus `format`/
     `format:check` npm scripts.
  3. `core/02-project-structure.md`'s naming rule told Claude to derive names from "the
     Figma design's frame name" — contradicts the actual Figma-less workflow. Fixed to
     reference business purpose from the prompt/discussion instead.
- **Section 5 item B (hook bug) — FIXED.** See Section 5 above for detail.
- **Git housekeeping (the "still pending" item from before) — executed:**
  - `reference/research-exploration` branch created, pointing at the old `main` tip
    (everything preserved permanently: `ComponentsGalleryPage`, the `blocks/`
    components, the `pages/preview/*` demo app, all of it — browsable forever, never
    used as precedent going forward).
  - `standardize/clean-baseline` branch built fresh from `117d42e` (the true baseline),
    with only the validated infra/standardization commits cherry-picked on top, in
    order: shadcn rules refresh, MUI removal, this context file, Prettier+Figma fix,
    hook fix, context update. **Deliberately excluded:** the two research commits
    (`made components list page`, `combined dev check branchs`) and the
    formatting-application commit (`style: apply Prettier formatting across src/`),
    since that one only reformatted files that exist solely in the research branch —
    nothing to apply on a pure baseline.
  - **Validating this clean baseline in isolation is what surfaced two real bugs** that
    had been silently masked by the research commits sitting on top of `main` the whole
    time:
    - `src/hooks/use-mobile.ts` was missing entirely, even though the vendored
      `ui/sidebar.tsx` (shadcn CLI output, never modified) imports `useIsMobile` from it
      as its documented companion-hook contract. Without it, `tsc -b` fails immediately
      on a clean baseline checkout. Restored (confirmed as standard shadcn CLI output
      via its own doc comment, not custom research code).
    - `src/test/setup.ts` was genuinely missing from the baseline lineage (see
      correction to point 1 above). Restored.
  - Full validation performed on `standardize/clean-baseline` after both restorations:
    `npm install`, `format:check` → `format --write` → clean, `tsc -b` clean, `lint` (15
    pre-existing errors, all in vendored `ui/`, unrelated to any of this work),
    `vitest run` (correctly reports "no test files found" rather than a setup error —
    expected, since the baseline has no feature code yet), and a full production
    **`npm run build` succeeds**.
  - **Not yet done:** actually replacing `main` with this validated clean baseline, or
    deleting the old research-laden commits from the remote's `main`. This is a
    destructive, shared-repo operation (history rewrite of a branch already pushed) —
    holding for explicit confirmation before doing it, same as the push-hold agreement
    in Section 7.
- **Next up (per discussion):** item C (component tier system) is now done — see Section
  5 for full detail. Remaining open items: A (data-fetching/json-server rewrite is the
  most urgent of these, since it's actively wrong right now — assumes Axios, which was
  never installed), D (theme-versioning system), E (showcase page rebuild), F
  (`.github/copilot-instructions.md` full refresh, lowest priority).
- **Item A (data-fetching/json-server rewrite) — DONE.**
  - HTTP client decided and fixed (was an open "pick Axios or alternative" placeholder):
    native `fetch`-based `src/services/apiClient.ts`, no HTTP library dependency.
    Pinned `json-server` to the stable `^0.17.4` line, deliberately *not* the `1.0.0`
    beta line (still marked "expect breaking changes" upstream as of this writing).
  - Created what the bootstrap checklist always required but this repo never actually
    had: `src/config/env.ts` (typed `requireEnv()` + `env` export, matching the
    pre-existing pattern already documented in `core/13-environment.md`, which itself
    still had a stale Axios code example — fixed too) and `.env.example`
    (`VITE_API_BASE_URL`, `VITE_APP_ENV`). `.env.local` already covered by the
    pre-existing `*.local` gitignore pattern — verified with `git check-ignore`, no
    gitignore change needed.
  - `db.json` (root) is the actual seed database; `npm run mock-api` starts json-server
    on it. Conceptually reframed `03-data-layer.md`: `mocks.ts` is no longer the runtime
    data source (that's now genuinely `db.json` served over real HTTP) — it's test-only
    fixture data for unit tests that mock `fetch`.
  - **Proved this actually works, not just typechecked**: started json-server for real
    (`npx json-server --watch db.json --port 3001`) and exercised GET list, POST
    create, GET-by-created-id, and a 404 error path — all correct — using fetch logic
    identical to `apiClient`'s. Restored `db.json` to its clean seed state afterward
    (json-server's `--watch` persists writes back to the file).
  - Wrote a permanent `apiClient.test.ts` (4 tests, mocked `fetch`, not a live server
    dependency) — surfaced and fixed a real gotcha: `apiClient` throws immediately at
    import time if `VITE_API_BASE_URL` is unset, which would break in a fresh clone
    with no `.env.local`. Fixed via Vitest's own `test.env` config in `vite.config.ts`
    rather than requiring a checked-in `.env` file.
  - Rewrote `01-axios.md` → `01-fetch-client.md`, plus `02-api-services.md`,
    `03-data-layer.md`, and `data-fetching/README.md`. Fixed every remaining stale
    Axios reference repo-wide: `core/01-tech-stack.md` (also fixed the Testing
    placeholder — Vitest+RTL was already installed and configured, just never marked
    decided), `core/13-environment.md`, `state-management/02-redux-toolkit.md`,
    `CLAUDE.md`, `AGENTS.md` (two separate tables), and `.github/copilot-instructions.md`.
  - Full validation re-run after every change: `format`/`format:check` clean, `lint`
    (same 15 pre-existing vendored-file errors, nothing new), `tsc -b` clean, `test`
    (4/4 passing), `build` succeeds. Confirmed `npm run build` currently succeeds even
    without `.env.local` — not because validation is bypassed, but because nothing in
    the still-placeholder `App.tsx` imports `apiClient`/`env` yet, so `requireEnv()`
    never executes; this will correctly start failing fast once a real feature uses it.
- **Next up (per discussion):** items B, C, and A are all done now. Remaining open:
  `forms/` decision (RHF+Zod vs RHF+Yup — package.json only has zod), `testing/`/`core/`
  doc audits, the state-management decision (Zustand vs Redux Toolkit — neither
  installed), D (theme-versioning system), E (showcase page rebuild), F
  (`.github/copilot-instructions.md`'s remaining stale rule-file numbering, lowest
  priority).
- **Item D (theme candidate versioning system) — DONE.**
  - **Real prerequisite gap found and fixed first:** the true baseline never actually
    wired Tailwind into `index.css` or activated a real `theme.css` — that was only
    ever done on the research branch, which we deliberately excluded during the git
    housekeeping. Item D would have had no visible effect without this, since swapping
    which theme file is "active" does nothing if Tailwind isn't generating utilities
    from theme tokens at all. Fixed: `index.css` now imports `tailwindcss`,
    `tw-animate-css`, the Geist font, and `theme.css`; added `@custom-variant dark` for
    `next-themes`' class strategy; added a **color-only** `@theme inline` bridge
    (background, primary/secondary/accent, card/popover, muted,
    destructive/success/warning/info, border/input/ring, chart-1..5, sidebar tokens).
  - **Deliberately did NOT bridge typography/radius/shadow/motion tokens into
    Tailwind's theme layer this pass** — several of our token names (`--radius-sm`,
    `--text-xs`, etc.) collide with Tailwind v4's own reserved namespace, and bridging
    them incorrectly risks a genuine circular CSS variable reference, not just a visual
    bug. This is flagged clearly in a code comment in `index.css` as a distinct
    follow-up needing its own verified pass — don't assume it's done, and don't guess at
    it without checking real compiled Tailwind v4 output first.
  - `theme.css` created from `theme-template.css`, unchanged except `--font-sans`/
    `--font-display` corrected to reference `'Geist Variable'` (the font actually
    loaded) instead of the template's placeholder `"Inter"` example.
  - **Validated against real compiled CSS output**, not just typechecked: ran
    `npm run build` and grepped the actual output, confirming the full chain resolves
    correctly (`.bg-primary{background-color:var(--primary)}` →
    `--color-primary:var(--primary)` → `:root{--primary:#e71e0e...}`), plus the
    `.dark{}` override. Zero build warnings.
  - Built the actual versioning system: `src/styles/themes/history/THEME-LOG.json`
    (structured log, schema in Section 4 above) and
    `.claude/rules/styling/shadcn/03-theme-versioning.md` (naming convention, full
    create/compare/promote workflow, explicit "never auto-delete rejected candidates"
    rule).
  - New hook `check-theme-log-entry.sh` (registered under `PostToolUse`): warns if a
    new file under `history/` doesn't match the naming convention or has no matching
    `THEME-LOG.json` entry. Tested directly with synthetic `tool_input` JSON covering
    all 4 branches (bad filename, missing entry, matching entry present → no output,
    unrelated file → no output) — all confirmed correct.
  - `styling/README.md` documents this as **always-active** for every project using
    this template (unlike the theme-toggle feature, which stays ask-the-user/optional).
- **Item E (component showcase page rebuild) — DONE.**
  - Rebuilt from scratch at `src/pages/componentsGallery/`, per the Section 3
    commit-history framing — same *purpose* as the research branch's
    `ComponentsGalleryPage`, not extended from it. Built against the finalized tier
    system (C) and theme-versioning setup (D), both of which didn't exist when the
    research version was made.
  - Two real prerequisites built along the way that had never actually existed: an
    `ErrorBoundary` (`src/components/shared/errorBoundary/`) — `core/10-error-handling.md`
    always required one at the app root, but it was never actually built anywhere —
    and real routing (`ROUTES` constants, `src/config/routes.tsx`, and `App.tsx`
    rewired from the bootstrap placeholder to the real root component:
    `ErrorBoundary` + `BrowserRouter` + `AppRoutes`, exactly matching
    `core/12-routing.md`'s documented pattern).
  - Real gotcha caught and fixed: `React.lazy()` requires a **default** export, but
    every page/component in this project uses named exports for consistency. Rather
    than introducing an inconsistent default export just for this one page, the lazy
    import is adapted with `.then(m => ({ default: m.ComponentsGalleryPage }))`.
  - Scoped to 6 sections deliberately, not an exhaustive pass over every shadcn
    primitive: Foundations (all 27 semantic color tokens as live swatches),
    Typography, Buttons & Badges, Form Inputs, Feedback, and — the genuinely new
    capability beyond the research branch's version — **Theme History**, reading
    `THEME-LOG.json` directly and rendering every candidate with a status badge.
  - Structure follows the item C tier system exactly: the page itself (5-file
    contract) plus a `components/` subfolder for page-scoped helpers (`ColorSwatch`,
    `GallerySection`, `ThemeHistoryPanel` — the last one accepts `entries` as a prop
    rather than importing the JSON itself, for testability).
  - Verified every shadcn primitive's exact export name and prop/variant signature by
    reading the actual vendored source before using it (`Button`, `Badge`, `Card`,
    `Alert`, `Input`, `Label`, `Textarea`) — not guessed.
  - Caught a real rule violation during self-review before committing: several
    multi-token `classNames` were initially written inline in the JSX — moved to
    `.styles.ts` as named consts, exactly what `check-no-inline-classnames.sh` exists
    to catch.
  - 18 tests total across all new files, all passing. Validated beyond typecheck: a
    real `npm run build` confirms `ComponentsGalleryPage` compiles into its own
    separate lazy-loaded chunk (proving the named-export adaptation actually works),
    and a real `vite preview` + `curl` against both `/` and `/components-gallery`
    confirmed both serve correctly (200, correct script tag, SPA fallback working).
- **Next up:** `forms/` decision (RHF+Zod vs RHF+Yup — package.json only has zod),
  `testing/`/`core/` doc audits, the state-management decision (Zustand vs Redux
  Toolkit — neither installed), F (`.github/copilot-instructions.md`'s remaining stale
  rule-file numbering, lowest priority). Also still open from item D: bridging
  typography/radius/shadow tokens into Tailwind's theme layer properly (flagged in
  `src/index.css` as needing its own verified pass).

## 7. Final validation methodology (recorded 2026-07-26, now BUILT — see Section 18)

User has a proven methodology from prior experience. Recorded here originally as a
future plan; **now actually built into this repo** — see Section 19 for the full
build record. Original notes kept below for context.

**"run feature test N" — a Claude Code skill:**
- Invoked as `run feature test N`, where `N` indexes into a pre-written table of
  test scenarios/combinations, defined once up front (not improvised per run).
- **Fully autonomous, never asks questions** — any ambiguity during generation gets
  resolved conservatively and *documented*, never escalated mid-run.
- **Two separate phases, two separate sessions:**
  1. Phase 1 (current session): generates/scaffolds the test scenario.
  2. Phase 2 (a **fresh** Claude Code session, opened inside the generated project):
     this is the session that actually builds a concrete feature and reports back —
     deliberately separate because this is the one where the repo's hooks are
     genuinely live and can actually fire against real generated code, not just a
     scaffold being assembled in the same session that built it.
- Reports get **unique timestamped filenames** to avoid collisions across runs.
- Pushes use a **retry loop with random jitter**, since multiple people/runs may push
  to the same repo around the same time.

This is the *real* test of whether the hooks/rules actually work as designed — not
"does this typecheck," but "does a fresh Claude Code session, building something for
real, actually get caught/guided correctly by the live hooks." Don't confuse this with
the smaller-scale validation I've been doing throughout (direct hook invocation with
synthetic `tool_input` JSON) — that proves the hooks are mechanically correct; this
proves the whole system holds up under real, autonomous use.

## 8. Development-experience gap analysis (2026-07-26)

User asked to look at readiness from a **development workflow** angle specifically,
not an infra-checklist angle. Findings, most consequential first:

- **The core gap: pieces exist, but nothing is wired together end-to-end.**
  `apiClient`, the data-layer pattern, `AsyncState<T>`, the component tiers — every one
  of these has only ever been validated in isolation. Zero real feature anywhere in the
  repo chains them together: no hook calls a service, no service feeds a mapper,
  `AsyncState<T>` exists only as prose in `core/10-error-handling.md`, never written in
  real code. This means the first real feature a designer asks Claude to build would be
  the first time these conventions are tested together — the wrong moment to discover
  they don't quite compose. **Recommended fix (not yet built, pending user direction):**
  one small, genuinely complete reference feature — `db.json` resource → service →
  mapper → domain model → hook using real `AsyncState<T>` → page with real
  loading/error/empty/success states → toast on success → full test coverage per layer.
  Open question sent to user: should this reference feature use real shared/global
  state (meaning Zustand/Redux Toolkit needs deciding right now), or local
  component-level state for now with global state layered in once that's decided?
  **Not yet answered.**
- **`Sonner`'s `<Toaster />` is never mounted anywhere.** The primitive is vendored,
  but nothing renders its host in `App.tsx`. A real feature calling `toast.success(...)`
  would silently do nothing — worse than crashing, harder to debug.
- **Icon convention still an open placeholder** (`CLAUDE.md`/`AGENTS.md`: "SVG sprites
  or lucide-react") despite `lucide-react` already being installed. Every icon Claude
  adds from here forward is a small, avoidable ambiguity that compounds across a real
  app.

## 9. Broader production-readiness gap analysis (2026-07-26, infra/checklist angle)

Separate from Section 9 — this is the "high standards, real company project, not a
basic v1" pass. Confirmed concretely (not assumed) via direct inspection:

- **No automated CI at all.** The only GitHub Actions file
  (`.github/workflows/environment-1.yaml`) is a manual-trigger-only (`workflow_dispatch`)
  deploy pipeline to Divami's own AWS account (specific role ARN, S3 bucket,
  CloudFront distribution) — doesn't apply to this repo at all, and isn't a quality
  gate (no lint/test/build-on-push/PR). This is why we've been stripping it from every
  push (token lacked `workflow` scope) — but that also means this repo currently has
  **zero** automated lint/test/build enforcement on push.
- **No pre-commit enforcement** — no Husky, no lint-staged. Nothing stops a
  broken/unformatted commit locally; we've been relying on manually running
  format/lint/test before every commit in this session.
- **`README.md` is still the untouched default Vite template** — flagged on day one of
  this whole effort, never fixed. Real first-impression gap for a repo designers are
  meant to pick up.
- **`VERSIONS.md` hasn't been touched since `v0.1.0`** — everything from item A through
  E, git housekeeping, MUI removal, etc. has no version tag.
- **8 known `npm audit` vulnerabilities (3 moderate, 5 high)** — all trace to
  *dev-tooling* transitive deps (shadcn CLI's MCP SDK chain; ESLint's own transitive
  minimatch/brace-expansion), not runtime app code. Still un-triaged. `npm audit fix
  --force` would downgrade the shadcn CLI and bump ESLint as breaking changes — needs a
  deliberate look, not a blind force-fix.
- **No `eslint-plugin-jsx-a11y`** — `core/08-accessibility.md` exists as a rule, but
  nothing automatically enforces it at lint time.
- Dark/light theming, typography/radius/shadow Tailwind bridging — already tracked as
  open items elsewhere in this file (Section 6/item D follow-up, and the theming
  question from the "did we have a ThemeProvider" conversation).

**Decisions still needed from user, not something to silently pick:** state management
library, whether auth needs a real implementation in this template or is left to each
project, Storybook (arguably more valuable here than usual, given designers are the
primary users), whether to add a caching/retry data layer (TanStack Query) vs staying
with raw fetch + manual hooks, i18n.

## 10. tweakcn research + dark/light theming + icon decision (2026-07-26)

User asked for deep research into `github.com/jnsahaj/tweakcn` (a real, 10k-star visual
theme editor for shadcn/ui) specifically to extract concrete, adoptable findings for
our own repo. Findings and what was done with each:

- **Husky + lint-staged confirmed present in their repo** (`.husky/` folder) — direct,
  independent validation of a gap we'd already flagged (Section 9). Still not yet built
  here — next up.
- **The `!important`-override technique for typography/radius/shadow** — tweakcn hits
  the identical problem we deferred in item D (some of their token names collide with
  Tailwind's own reserved namespace too). Their solution: don't fight Tailwind's
  `@theme` layer for these — generate literal CSS text for the affected utility
  classes and inject it via a `<style>` tag with `!important`, overriding Tailwind's
  own utilities directly (confirmed via their actual `public/live-preview.js` source,
  read in real detail, not just a summary). **This is the approach to use when we
  revisit the typography/radius/shadow bridging follow-up from item D** — better than
  what was being considered (fighting the naming collision inside `@theme inline`
  itself). Not yet implemented — still open.
- **Compatibility validation before applying a theme** — their `checkShadcnSupport()`
  checks ~18 required CSS variables exist before injecting a theme into a target page.
  Adaptable idea for `check-theme-log-entry.sh`: validate a candidate `.css` file
  actually defines every required token (matching `theme-template.css`'s full set)
  before treating it as a valid candidate. Not yet implemented — still open.
- **Confirmed our own architecture is the right shape, not missing something
  structural**: their actual DOM-application mechanism for live theme injection is
  `document.documentElement.style.setProperty('--' + key, value)` — i.e. CSS custom
  properties on the root element, same principle we already use via `theme.css` +
  Tailwind classes. No architectural change needed on this front.

**Dark/light theme support — now real, not deferred.** User was clear (twice) this
needs to actually work for a production-grade boilerplate, not stay
ask-the-user/optional indefinitely. Fixed:
- `App.tsx` wrapped in `next-themes`' `ThemeProvider` (`attribute="class"`,
  `defaultTheme="system"`, `enableSystem`), exactly matching
  `styling/shadcn/02-theming.md`'s documented pattern.
- `<Toaster />` mounted at the root (previously flagged as missing entirely — the
  vendored `ui/sonner.tsx` already calls `useTheme()` internally; it just needed a
  `ThemeProvider` ancestor to actually resolve correctly).
- New `ThemeToggle` component (`src/components/shared/themeToggle/`), exact pattern
  from the rule doc — Sun/Moon `lucide-react` icons, cross-fade via `dark:` Tailwind
  variants, no conditional JS styling. Added to the gallery page header so it's
  actually visible/usable, not just wired in the abstract.
- Validated for real: the `ThemeToggle` test clicks the actual button and asserts
  `document.documentElement`'s `.dark` class is genuinely added/removed (twice,
  toggling back) — real DOM behavior, not a mocked assertion. Full suite (17/17 tests),
  `tsc -b`, lint (same 15 pre-existing vendored-file errors), format, and
  `npm run build` all clean/passing after the change.

**Icon source decision — resolved.** Was left as an open "SVG sprites or
lucide-react" placeholder in `CLAUDE.md`/`AGENTS.md`/`core/01-tech-stack.md` despite
`lucide-react` already being installed. Fixed to `lucide-react`, fixed for this
template — every icon Claude adds from here forward has one unambiguous answer.

**Still open, in priority order per the last few exchanges:** ~~Husky + lint-staged~~
DONE — see Section 11. **CI pipeline explicitly deferred by user (2026-07-26) — not
in scope right now, don't propose it again unless the user brings it back up.** Next:
~~README/VERSIONS.md~~ DONE — see Section 12. Then the vulnerability triage, then the
reference-feature build (still waiting on the local-state-vs-global-state-library
question from Section 8), then the tweakcn-derived typography/shadow bridging and
theme-candidate-validation ideas above.

## 11. Husky + lint-staged (2026-07-26)

Confirmed as standard practice in this exact ecosystem via the tweakcn research
(Section 10) — nothing new to decide, just built it.

- `husky@9.1.7` via the modern `npx husky init` workflow — created `.husky/pre-commit`,
  added `"prepare": "husky"` to `package.json`. `.husky/_/` (husky's internal generated
  shims) is self-gitignored via its own `.gitignore`; nothing needed in our root one.
- `lint-staged@17.2.0` — runs `eslint --fix` + `prettier --write` on staged
  `*.ts`/`*.tsx`, `prettier --write` on staged `*.css`. Scoped to what's actually being
  committed, not the whole repo.
- Added `engines.node: ">=22.22.1"` to `package.json` — this is the actual strictest
  requirement among our own dependencies (`lint-staged` itself needs this; `react-router`
  needs `>=22.22.0`). Made explicit so a Node version mismatch surfaces as a clear npm
  error instead of the confusing "Cannot find native binding" rolldown crash the user
  hit firsthand on their local machine (Node 20.13.1) before this was declared.
- **Validated end-to-end for real, not just configured**: staged a deliberately
  badly-formatted file and committed it — confirmed `eslint --fix`/`prettier --write`
  actually ran and auto-fixed it, which then got committed with corrected formatting.
  Separately staged a file with a real, non-auto-fixable error (unused variable) and
  confirmed the commit was genuinely rejected — working tree correctly reverted, clear
  error shown, nothing committed. Both test files and test commits removed/reset
  before the real commit landed.

## 12. README.md + VERSIONS.md (2026-07-26)

- `README.md` was still the untouched default Vite template ("This template provides a
  minimal setup to get React working in Vite") — flagged on day one of this whole
  effort, never fixed until now. Rewritten to actually describe this repo: what it is
  and why the rules matter (designer-prompts-Claude workflow), what's built in
  (shadcn/Base UI, dark/light theming, theme versioning, json-server + apiClient,
  component tiers, the gallery page), getting started (`npm install`, `npm run dev` +
  `npm run mock-api` in a second terminal, `.env.example` → `.env.local`, the
  `engines.node` requirement), the full scripts table, and where to look next.
- `VERSIONS.md` hadn't been touched since `v0.1.0`. Added a `v0.2.0` entry
  summarizing everything built since (items A-E, the git housekeeping, MUI removal,
  dark/light theming, Husky/lint-staged) in one place.

## 13. Standards cross-check against shadcn-ui/ui (2026-07-26)

User asked to cross-check our conventions against the official `github.com/shadcn-ui/ui`
repo. Found something directly actionable: an **official, shadcn-team-maintained
Claude Code skill** exists specifically to prevent Claude from guessing wrong
shadcn/ui APIs — its stated purpose is preventing exactly "wrong import paths,
incorrect Combobox composition, missing Registry configurations, deprecated API
usage." It explicitly calls out two concrete anti-patterns:

- **"Using FieldGroup for forms instead of raw divs"** — checked our own repo
  directly against this: we DO vendor `field.tsx` (`Field`/`FieldGroup`/`FieldLabel`/
  `FieldDescription`/`FieldError`/`FieldSet`/`FieldLegend`), but our own gallery page's
  form example bypassed it entirely with raw `<div>` wrappers around `Label`+`Input` —
  exactly the flagged mistake. Worse: **nothing in `forms/01-rhf-zod.md` documented
  `Field`/`FieldGroup` at all**, meaning every future form built in this repo would
  likely repeat the same mistake, not just this one example. **Fixed**: added a
  "Mandatory Field Composition" section to `forms/01-rhf-zod.md` (confirmed against
  ui.shadcn.com's current docs — `data-invalid` wiring from RHF's `formState.errors`,
  mirrored as `aria-invalid`, `FieldError` conditionally rendered, `FieldGroup` for
  stacking, `FieldSet`+`FieldLegend` for semantic grouping), and rebuilt
  `ComponentsGalleryPage.tsx`'s form example to actually use it. Validated with a real
  test that only passes if `FieldLabel`'s `htmlFor` genuinely associates with the
  input's `id` (`screen.getByLabelText`) — not just that it renders without crashing.
- **"Manual `space-y-*` classes instead of `gap`"** — swept the whole repo for this;
  confirmed zero occurrences anywhere, already clean.

**Worth revisiting later**: that official skill (and several community forks of it)
exist as installable Claude Code skills — if the workflow ever moves to Claude Code
specifically (vs. this chat interface), installing the official one directly could be
a stronger, always-current backstop than our own hand-maintained rule docs for the
shadcn-API-correctness slice specifically. Not actionable in this environment right
now, but a real option worth remembering.

### Follow-up deep dive: the full `skills/shadcn/` folder content (2026-07-26)

User asked to go deeper into the actual skill file content (fetched the real,
current `SKILL.md` directly, 265 lines). This surfaced a much larger, precise list of
conventions — cross-checked each one against our actual code/rules (not assumed) before
acting. Two were **live violations in already-written code**, not just missing docs:

- `ThemeHistoryPanel.tsx`'s empty state used a raw `<p>` instead of the vendored
  `Empty` component — we had `empty.tsx` vendored and unused. **Fixed** — now uses
  `Empty`/`EmptyHeader`/`EmptyMedia`/`EmptyTitle`/`EmptyDescription`/`EmptyContent`.
- `ThemeToggle.tsx`'s `Sun`/`Moon` icons had redundant explicit `size-4` classes —
  `Button`'s own base CSS already auto-sizes any child SVG without an explicit
  `size-*` class. **Fixed** — removed the redundant sizing, confirmed via actual
  compiled build output that the auto-sizing selector is genuinely present, not
  just assumed. Deliberately did **not** force `data-icon` onto this component:
  that attribute coordinates button padding with adjacent text, and `ThemeToggle`
  is a pure icon-only button with no text to coordinate against — documented this
  reasoning in a code comment rather than blindly applying the rule where its
  underlying purpose doesn't apply.

Everything else was a genuinely missing rule (all primitives already vendored,
zero mentions anywhere in `.claude/rules/`, confirmed via direct `grep`) — added:
- New file `styling/shadcn/04-composition-patterns.md`: use-components-not-custom-
  markup table, Group nesting (`SelectItem`→`SelectGroup` etc.), `Dialog`/`Sheet`/
  `Drawer` `Title` requirement + no manual `z-index` on overlays, full `Card`
  composition, `Avatar`+`AvatarFallback`, `TabsTrigger` inside `TabsList`, Button
  loading state (`Spinner`+`data-icon`+`disabled`, no `isPending`/`isLoading` prop).
- `forms/01-rhf-zod.md`: added `InputGroup`/`InputGroupAddon` (with
  `InputGroupInput`/`InputGroupTextarea`, never raw `Input`/`Textarea` inside it) and
  `ToggleGroup` (for 2–7 option choices, never a manual `Button` loop with tracked
  active state).
- `01-tailwind-shadcn-styling.md`: added `size-*` (not `w-*`/`h-*`), `truncate`
  shorthand, no manual `z-index` on overlays. **Also fixed a rule that actively
  contradicted the correct convention**: it said to "always include `dark:`
  counterpart classes alongside every light-mode class" — but semantic color
  tokens already resolve correctly in both modes via the CSS variable redefinition
  under `.dark`; they almost never need a `dark:` variant at all. This had been
  wrong since the very first shadcn rules refresh, unnoticed until this deeper pass.

Full validation after all changes: 18/18 tests (including both fixed components'
existing test suites, unchanged assertions), `tsc -b` clean, lint (same 15
pre-existing vendored-file errors), format clean, build succeeds.

## 14. Typography/radius/shadow bridging — resolved (2026-07-26)

The item D follow-up (deliberately deferred: bridging typography/radius/shadow into
Tailwind's theme layer) is now done. User asked "what did we miss in the global
theme," which led to checking shadcn's own current theming docs directly — this
surfaced a more serious version of the problem than originally understood:

**The real problem**: Tailwind v4 ships its own built-in default values for
`text-*`, `rounded-*`, and `shadow-*` utilities. The item D color bridge (`@theme
inline`) didn't touch this — those utility classes already existed and already
worked, but silently used Tailwind's stock hardcoded values, not this project's
theme tokens. Confirmed concretely via compiled build output: Tailwind's native
`.rounded` rule is `border-radius:.25rem` — a **literal hardcoded value, not even a
CSS variable** — meaning editing `theme.css`'s `--radius` would have had zero
visible effect on any component using a plain `rounded` class, before this fix.

**Why `@theme inline` still isn't the right mechanism for these tokens**: checked
shadcn's own current official theming docs directly. Their `--radius-sm`/`-lg`/`-xl`
etc. are only ever declared *inside* `@theme inline`, computed via `calc()` from a
single, differently-named base (`--radius`) — never as standalone `:root`
properties. Our `theme-template.css` intentionally keeps `--radius-sm`/`-lg` (and
every `--text-*`/`--leading-*` step) as independent, designer-overridable `:root`
values — exactly what that file's own "do not rename any variable" rule requires
preserving. Bridging our existing names into `@theme inline` as-is would be
genuinely self-referential/circular, not just a style bug — confirming the original
caution from item D was correct, not overly conservative.

**The fix**: plain, unlayered CSS rules with `!important` in `index.css`, directly
overriding the specific utility classes (`text-xs` through `text-4xl`,
`rounded-sm`/`rounded`/`rounded-lg`/`rounded-full`, `shadow-sm`/`md`/`lg`) that this
project's token scale actually defines — the same technique confirmed from
tweakcn's own production source (`public/live-preview.js`) solving the identical
problem. No token renames, no changes to `theme-template.css`'s contract.

Simplified every component using the interim arbitrary-value workaround
(`text-[length:var(--text-2xl)]`, `rounded-[var(--radius)]`) to the real utility
classes now that they're theme-aware: `ComponentsGalleryPage`, `ColorSwatch`,
`ThemeHistoryPanel`, `ErrorBoundary`.

**Validated against real compiled build output at every step**, not assumed:
confirmed the override rules exist and reference the right tokens; confirmed
Tailwind's native `.rounded` is a hardcoded literal (proving the fix necessary, not
redundant); confirmed `.text-4xl` (a value that numerically differs from
Tailwind's stock default — `2.5rem` vs `2.25rem` — making the comparison
unambiguous) resolves to our token via the `!important` override, not Tailwind's
stock value. Full suite: 18/18 tests, `tsc -b` clean, lint unchanged, format
clean, build succeeds.

**Remaining open from the original theming gap analysis**: ~~theme-candidate
completeness validation~~ **DONE — see Section 15.** Contrast/accessibility checking
on candidates is still not implemented.

## 15. Theme candidate token-completeness validation (2026-07-26)

Resolved the last open item from the theming gap analysis — inspired by
tweakcn's `checkShadcnSupport()` (validates a target page has all required shadcn
CSS variables before injecting a theme into it, checked directly in their actual
source during the earlier tweakcn research).

`check-theme-log-entry.sh` now diffs every new candidate file under `history/`
against `theme-template.css`'s own token list and warns, listing exactly which
tokens are missing by name, if the candidate is incomplete. Required tokens are
extracted from `theme-template.css` itself **at hook-run-time**, not hardcoded in
the script — stays correct automatically if the template's token set ever changes,
no second place to keep in sync. Documented in
`styling/shadcn/03-theme-versioning.md`'s "Creating a candidate" section.

Tested directly with synthetic `tool_input` JSON across every case: a complete
candidate (full copy of the template) correctly produces no completeness warning;
an intentionally incomplete candidate (missing most sections) correctly lists
every genuinely missing token by name; a fully complete + already-logged candidate
produces zero output; regression-tested the pre-existing naming-convention and
unrelated-file branches still work unchanged. Full repo suite unaffected: 18/18
tests, `tsc -b` clean, build succeeds.

**Still open**: contrast/accessibility checking on theme candidates (from the same
tweakcn research) — not implemented.

## 16. State management decision — Zustand, fixed (2026-07-26)

User asked for a recommendation based on cross-referencing both shadcn-ui/ui and
tweakcn, given this is a boilerplate needing one default that stays locked in
per-project once adopted. Findings, verified directly:

- This template's own original `state-management/README.md` already labeled
  Zustand "(default)" before this was ever formally closed out.
- **tweakcn** confirmed uses Zustand for all client-side state (three domain
  stores) — checked directly in their own architecture docs during the earlier
  research.
- **shadcn-ui/ui's own demo app actually uses Jotai** — confirmed directly in
  `apps/v4/package.json` (`"jotai": "^2.15.0"`). This was a genuine split across
  real ecosystem projects, documented honestly in `state-management/README.md`
  rather than claiming false consensus — with the reasoning for choosing Zustand
  anyway (smaller API surface, more centralized/predictable single-store-per-domain
  model, fewer ways for an AI generating code with minimal developer review to get
  subtly wrong compared to an atom-based composition model).

**Resolved**: `state-management/02-redux-toolkit.md` removed. `README.md`
rewritten as a fixed decision, not pick-one. `CLAUDE.md`/`AGENTS.md`/
`core/01-tech-stack.md` placeholders fixed. Two more stale rule-file references
fixed in `.github/copilot-instructions.md` (`09-zustand-state.md`, a pre-reorg
filename). `zustand@5.0.14` (verified current stable) installed as an actual
dependency, matching the treatment given to other now-fixed decisions.

**The explicit rule requested, now encoded in two places** (`state-management/README.md`
and directly in `01-zustand.md` itself, since that's the file most likely loaded
when actually working on stores): once a downstream project has Zustand installed
with real stores, **never suggest switching state management libraries**,
regardless of what a later prompt might imply.

Validated: 18/18 tests, `tsc -b` clean, lint unchanged, format clean, build
succeeds.

**Still open**: ~~`forms/` decision~~ **DONE — see Section 17.**

## 17. Forms decision — React Hook Form + Zod, fixed (2026-07-26)

Same treatment as the other "pick one, dangling placeholder" fixes this
session (HTTP client, icons, state management): `zod`, `react-hook-form`, and
`@hookform/resolvers` were already installed, `forms/README.md` already labeled
RHF+Zod "(default)" — just never formally closed out.

- Removed `forms/02-rhf-yup.md`. Rewrote `forms/README.md` as a fixed decision.
- Fixed the "pick one" placeholders in `CLAUDE.md` (decision table, strategy
  table + header, execution-flow checklist, schema placement line) and
  `AGENTS.md` (decision table, plus a stale "Active Tech Stack" line that
  incorrectly claimed Yup — contradicted by `package.json` all along, the same
  kind of staleness found and fixed for HTTP client/router earlier in this
  project). `core/01-tech-stack.md` placeholder fixed too.
- Fixed two more stale Yup references found via a full repo sweep: `AGENTS.md`'s
  "NEVER place a Yup schema" checklist line (→ Zod), and `core/14-security.md`'s
  code comment ("Zod shown; Yup equivalent is fine" → just Zod).

Validated: 18/18 tests, `tsc -b` clean, lint unchanged, format clean, build
succeeds.

**Every "pick one" placeholder from the original open-problems list (Section 5)
is now resolved**: styling (shadcn-only), HTTP client (fetch + json-server),
icons (lucide-react), state management (Zustand), forms (RHF+Zod). Remaining
open items across the whole project: `testing/`/`core/` doc audits (never had a
"verify against current docs" pass the way shadcn did), the reference feature
build, contrast-checking on theme candidates, the `npm audit` triage, and item F
(`.github/copilot-instructions.md`'s remaining stale rule-file numbering).

## 18. `run-feature-test` skill built (2026-07-26)

User decided against building one reference feature by hand — instead, brought
their own proven methodology from a related, separate project (an Angular
boilerplate-generator, shared directly as `boilerplate-generator.zip`) that
already has real, multi-tester validation history. Ported and adapted it here.

**Source material read in full before adapting, not just described from memory**:
the actual `SKILL.md`, `FEATURE-TEST-PLAN.md`, `test-reports/TEMPLATE.md`, and two
real filled-out reports (a normal tester report and a "central-brain final
confirmation" report) from the source repo — used to calibrate the level of detail
expected (full file contents pasted verbatim, not summarized; honest self-reporting
of limitations, e.g. one report explicitly noted its own review wasn't run through
real Claude Code hook enforcement and said so rather than implying false
equivalence with the tester reports that were).

**Key structural adaptation required**: the source tool is a *generator* with
variant flags (auth/data-layer/state/styling/etc.) — each tester built against a
differently-*configured generated project*. This repo is a single, fixed
boilerplate (shadcn/Base UI, Zustand, RHF+Zod, fetch+json-server — every "pick one"
decision already closed out per Sections 10/16/17) — there's no bundle axis to
vary. Redesigned the six assignments around different **feature-building tasks**
instead, chosen so that collectively they exercise every rule file and hook in
`.claude/`:
1. Products catalog (data fetching, `Field`/`FieldGroup`, component tiers, testing)
2. Team directory (Zustand, `Dialog`+title rule, `ToggleGroup`, `Avatar`)
3. Settings page (`Tabs`, `InputGroup`, `Skeleton`, `Separator`, dark/light theming)
4. Theme candidate creation (the full theme-versioning workflow — no equivalent in
   the source skill, unique to this repo)
5. Activity feed (toasts, `Badge`, `Alert`, button loading-state composition, `Empty`)
6. Minimal baseline (control case)

**Kept unchanged from the source**, since these are real Claude Code platform
facts or hard-won practical lessons, not Angular-specific: the 2-phase split
(hooks only load from a session's actual *startup* working directory — a
confirmed platform limitation, applies to any repo, not just Angular ones),
"never ask, pick and document," the two specific friction points to avoid
(compound `cd && ... > file` commands triggering Claude Code's approval prompt;
`timeout` being absent on macOS by default — cloud-synced folders like iCloud
Drive causing real hangs), timestamped report filenames, and retry-with-jitter
pushes.

**Simplified relative to the source**: Phase A needs no bundle flags or
version-substitution logic at all, since this isn't a generator — just a plain
`git clone` + `npm install`.

**Files created**:
- `.claude/skills/run-feature-test/SKILL.md` — the skill itself
- `FEATURE-TEST-PLAN.md` — coordinator doc for teammates
- `test-reports/TEMPLATE.md` — report template, with a compliance checklist
  rewritten entirely around this repo's actual rules (component tiers, the full
  composition-patterns list, `apiClient`/`ApiResponse<T>`, Zustand no-mutation,
  theme-versioning naming/log/promotion) in place of the source's Angular-specific
  checks (`ng lint`, Signal Forms, CDK widgets, etc.)

**Scope note, explicitly confirmed with the user**: teammates will run this fully
autonomously per-assignment via their own Claude sessions (added as repo
contributors) — including writing and pushing their own report, matching the
source skill's self-contained design. Report review/validation and the actual
fixes happen afterward, in a separate session working through the pasted code
against the real rule files directly — not baked into the skill itself. **The
stated end goal, plainly**: run all six, fix everything genuinely flagged the
same rigorous way every other change in this project has been validated, and only
then is this boilerplate actually ready for real project use.

**Not yet done**: no reports exist yet — this is infrastructure only, waiting on
teammates to actually run it.

## 19. Working agreements / process notes

- User wants to **hold all pushes until explicitly requested** — make local commits
  freely, but don't push to any remote without being asked first, so they can review
  diffs before anything goes to GitHub.
- No direct GitHub connector/MCP is available in this environment (checked via
  `search_mcp_registry` — only `monday.com` came back). Pushing requires a manually
  generated fine-grained PAT, pasted into chat, used once via `bash_tool` +
  `git remote set-url` with the token embedded transiently, then revoked immediately
  after. Treat every token as single-use; never assume one is still valid without
  asking the user to confirm.
- If the repo being worked on includes `.github/workflows/*.yaml` and a token only has
  `Contents: Read/write` (no `Workflows` scope), pushing to a **new/empty** remote repo
  will fail because GitHub requires `workflow` scope to *create* a workflow file. Fix
  used previously: strip the workflow file from history via `git filter-repo --path
  .github/workflows/environment-1.yaml --invert-paths --force` on a throwaway clone
  before pushing, rather than requesting broader token scope.
- This file should be updated as decisions get made or plans change — don't let it go
  stale the way other docs in this repo did.
