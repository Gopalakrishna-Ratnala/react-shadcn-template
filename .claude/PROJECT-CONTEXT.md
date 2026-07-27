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

### Round 2 added: theme versioning repeatability (2026-07-26)

User asked directly whether varying the feature per session (what the original
6-assignment design does) or repeating the *same* feature across sessions was the
better validation approach. Honest answer given: they test different things —
different features finds *where* gaps are across the whole system (breadth);
the same feature repeated tells you whether a result is *trustworthy* or just one
lucky/unlucky run (reliability). Neither alone is sufficient, and the original
design only did the former.

User then stated they're particularly focused on the theme-versioning workflow
specifically — it's what a designer will use constantly, every design round, for
the entire lifetime of every real project, unlike the other 5 assignments (each
touched once and moved on). A single Round 1 pass on assignment 4 can't tell us
whether that workflow holds up under the repeated real use it'll actually face.

**Added Round 2**: the same theme-candidate-creation task (3 candidates, logged,
one promoted) deliberately repeated across at least 5 separate sessions/testers,
with fresh made-up color palettes each time (explicit instruction: never reuse a
previous run's palette) — so what's being tested is the *workflow's* reliability,
not memorized output.

- `SKILL.md`: new `run feature test 4-repeat` / "run the theming repeatability
  test" invocation, reusing the same Phase A/B/C mechanics with three differences —
  the repeated task itself (with the "don't reuse previous palettes" instruction
  and an extra "workflow steps followed, in order" output section for later
  comparison), report naming
  (`tester-4-repeat-<run-number>-<timestamp>.md`, auto-incrementing), and an
  explicit note that comparing accumulated repeats against each other happens
  separately, once at least 5 have come in — not part of the skill's own scope.
- `FEATURE-TEST-PLAN.md`: explains both rounds to teammates, updated invocation
  instructions, updated closing section covering the comparative review step
  specific to Round 2.
- `test-reports/TEMPLATE.md`: added the "workflow steps followed" section,
  explicitly scoped to repeat runs only.

Validated: 18/18 tests, `tsc -b` clean (docs-only change, unaffected as expected).

## 19. Self dry-run of assignment 1 before asking the team to spend time on it (2026-07-27)

User asked directly whether the skill had actually been run and cross-checked
before letting teammates loose on it — a genuinely good instinct. Honest answer
given: no, not yet, and there's a real limitation on what could be validated this
way — this session can't literally invoke the skill as Claude Code CLI, and can't
spin up a second, genuinely independent Claude Code session to test whether hooks
fire *live* during real use (the entire reason the skill has its 2-phase design).

**What was done instead**: cloned the repo fresh into `/tmp/feature-test-1`
(exactly per the skill's Phase A), then built the full assignment 1 feature
(Products catalog) for real — not talked through, actually written, file by file,
with the same discipline used throughout this whole project (checking real
vendored source before using any API, never guessing). Ran `lint`/`tsc -b`/`test`/
`build` for real. Manually verified every relevant hook against the actual files
produced. Started a real `json-server` instance and confirmed it served the
seeded data correctly. Wrote up a genuine, complete report
(`test-reports/tester-1-products-catalog-1785142649.md`) using the real template.

**Two real bugs caught during the build itself**, left in the report rather than
quietly pre-fixed:
1. `AlertDialogTrigger` has no `asChild` prop at all (Base UI-backed, confirmed by
   reading the actual vendored source) — fixed using the correct `render` prop.
2. A genuine Zod `z.coerce` + React Hook Form type mismatch — `useForm<T>`'s
   single-generic signature breaks the moment a schema has a coerced field, since
   the pre- and post-coercion shapes differ. **Fixed for real, and the fix was
   then also added to `forms/01-rhf-zod.md` itself** (split `z.input`/`z.output`,
   RHF's third `useForm` generic) — a genuine, previously-undocumented gap; the
   rule's only example was a plain string-only schema that never surfaces this.

**One more real, standing gap surfaced, not yet fixed**: nothing mechanically
enforces "use a vendored component instead of custom markup" (the
`04-composition-patterns.md` rule) — `check-no-inline-classnames.sh` only catches
multi-token `className` strings, not "this should have been `Alert` instead of a
raw `<p role="alert">`." Caught here only by manual self-review, same as the
`ThemeHistoryPanel`/`Empty` finding earlier in this project. No hook exists for
this class of violation at all currently — worth considering whether one
reasonably could (likely hard to do generically, since it requires recognizing
semantic intent, not just a syntactic pattern — flagged for future
consideration, not solved here).

**Stated honestly, in both the report and here**: this proves the skill's
*mechanics* work (the task is buildable, the report template holds up in
practice, the hooks are logically correct against real code) and produced two
genuine, real fixes. It does **not** and cannot prove the one thing that matters
most — whether Claude Code's actual live `PostToolUse` hook interception fires
correctly during a real, independently-started second session. That still
requires an actual teammate running the real skill before Round 1 can be
considered genuinely validated.

## 20. Permissions guidance for the skill (2026-07-27)

User reported the skill "always asks for permission" — a good catch, and it
surfaced a real, fixable gap that had nothing to do with anything discussed so
far. Clarified two genuinely different things were being conflated:
1. **The one deliberate Phase A/B handoff** (open a new terminal, start a new
   session, paste Phase B's prompt) — structural, a real Claude Code platform
   limitation (hooks only load from a session's own startup directory), not
   removable by any settings configuration. This was always meant to require a
   human, by design.
2. **Repeated in-session approval prompts on individual commands** — a real, fixable
   gap: this repo's *committed* `.claude/settings.json` has zero `permissions`
   configuration at all (checked directly), so Claude Code defaults to prompting
   for nearly every tool call.

**Deliberately did not fix this by adding a broad allow-list to the committed
`settings.json`** — that file ships with every real project built from this
template, so loosening it there would loosen the default posture for real client
projects too, not just test runs. Instead, documented `.claude/settings.local.json`
(Claude Code's own standard personal/gitignored override mechanism, confirmed via
current official docs and community sources — layers on top of the shared file,
never committed) as a one-time per-machine setup step in `FEATURE-TEST-PLAN.md`'s
Step 0, with an allow-list scoped to exactly what the skill needs
(`git`/`npm`/`npx`/`node`, `Read`/`Write`/`Edit`, a narrowly-scoped `rm -rf` rule
for the temp test directory only). Cross-referenced the same distinction directly
in `SKILL.md` too, since testers might invoke the skill without reading the plan
doc first.

**Honest caveat, since this is real Claude Code runtime behavior this environment
cannot itself test**: exact Bash permission-rule specifier syntax varies slightly
across sources found (colon vs space vs direct-attach before the wildcard) — used
the most explicitly documented, verified-against-official-docs form. Testers
should verify this actually suppresses prompts in their real environment and
report back the exact command if anything still prompts, so the specific rule can
be refined based on real observed behavior, not just documentation.

## 21. Real teammate test reports reviewed and fixed (2026-07-27)

Once teammates started running the real skill (added as repo contributors), four
real reports came in — reviewed each by reading the full report, then verifying
every non-trivial claim directly against the actual code/hooks before fixing
anything (never trusted a report's self-assessment alone). Pulling latest via a
fresh clone + `git reset --hard` each time a new report landed, since the working
repo has no direct git remote access to the fork.

### Report 2 — `tester-2-team-directory-1785146634.md` (assignment 2, Zustand/Dialog/ToggleGroup/Avatar)

- **`ColorSwatch.tsx` (built by this session itself, during item E) genuinely
  violated our own no-div-span rule** — 3 divs, 2 spans, shipped in committed
  code. Confirmed directly, then fixed using `<figure>`/`<figcaption>` (zero
  behavioral change) + the vendored `Card` (matching this project's own rule's
  documented example), with `ring-0`/`p-0` overrides to preserve the original
  visual design. Validated against the real hook directly, not just visual
  inspection. A genuinely humbling finding — even with everything built this
  session, a real violation sat in shipped code undetected until a real
  third-party review caught it.
- **Two real `check-barrel-exports.sh` bugs**: (1) the module-name derivation
  stripped a second "extension" meant for `.test.ts`-style files (already
  filtered earlier), which mangled any genuinely-dotted filename like
  `common.types.ts` into a wrong suggestion (`./common` instead of
  `./common.types`); (2) a more serious false positive — grep matches
  line-by-line by default, so Prettier's own multi-line `export type { A, B, C }
  from "./types"` formatting (wrapped across several lines when there's more than
  one or two names) was invisible to the single-line regex, causing a genuinely-
  exported types-only file to be flagged as missing, permanently, on every such
  file. Both reproduced with the tester's exact real content before fixing (fixed
  the suffix-strip; flattened newlines before matching for the multi-line case).
  Also fixed the warning message itself, which generated invalid-TypeScript-syntax
  example code (`export { common.types }` — a dot isn't a valid identifier) for
  exactly the case being fixed.
- Still open from this report (lower priority, not yet acted on): no documented
  pattern for accessible whole-card click targets; the HTML element allow-list
  being incomplete/ambiguous (`<hgroup>`, `<dl>`, etc.); two unverified claims
  (stale "ask user at setup" language, a "ThemeProvider in render" testing-rule
  contradiction) that still need direct verification.

### Report 3 — `tester-3-settings-page-1785145935.md` (assignment 3, Tabs/InputGroup/Skeleton/Separator)

- **The most consequential finding of the entire testing effort**: six hooks
  (`check-no-any.sh`, `check-no-inline-style.sh`, `check-no-hardcoded-colors.sh`,
  `check-no-raw-dimensions.sh`, `check-no-inline-classnames.sh`,
  `check-no-div-span.sh`) all shared the identical flaw — they only extracted
  content if the tool name was exactly `"Write"` or `"Edit"`, silently exiting 0
  (zero check, zero warning) for any other tool, most importantly `MultiEdit` — a
  real, commonly-used Claude Code tool for batching several edits to one file.
  This had been true since these hooks were first written, before this whole
  engagement started, and was never caught by any of this session's own many
  rounds of hook testing (every prior test used Write/Edit shapes, never
  MultiEdit). Reproduced directly (a MultiEdit-shaped payload with a verbatim
  `<span>` violation produced zero output, exit 0) before fixing. Fixed all six by
  making content-extraction shape-based (`content`/`new_string`/`edits[].new_string`,
  whichever is present) instead of name-based — more robust, and future-proof
  against any other content-writing tool with one of these known shapes.
  Rigorously re-tested: all six correctly block on Write, Edit, and MultiEdit
  (including a violation buried in the *second* of two edits), and all six still
  correctly produce zero output on clean input across all three shapes.

### Report 4 — `tester-4-theme-candidate-creation-1785151110.md` (assignment 4, theme-versioning workflow)

- **The second most consequential finding**: every hook that parses tool-call
  JSON does so via `jq` (11 of 12 hook files) — and this tester's machine had no
  `jq` installed at all. Without a guard, `jq: command not found` produces an
  empty variable, which every hook's own early-exit logic then silently treats as
  "nothing to check" — exit 0, completely invisible to the agent. This meant the
  *entire* guardrail system was a no-op for this tester's whole session, with
  nothing distinguishing it from "the code genuinely passed every check." `jq`
  had never been documented anywhere in this repo as a required dependency.
  Reproduced directly (built a minimal `PATH` excluding `jq`, ran a real hook
  against a genuine violation, confirmed the exact silent failure). Fixed by
  adding a `jq`-presence guard to all 12 hook files — if missing, each now fails
  loudly and blocks (clear stderr message, a hand-constructed — since `jq` itself
  is unavailable — but valid JSON block via the normal warning format, exit 2)
  instead of silently passing. Also added `jq` to `README.md`'s prerequisites for
  the first time. Regression-tested that normal operation (jq present) is
  completely unaffected.
- The actual theme-versioning workflow itself (the report's primary subject) held
  up well otherwise — all 3 candidates correctly named/logged, rejected ones left
  intact in `history/`, promotion done correctly. Only minor, reasonable
  doc-ambiguity notes (whether a same-session create+promote should still perform
  an intermediate "candidate"-only write) — a judgment call the rule doesn't
  fully settle either way, not a bug.

### Report 5 — `tester-5-activity-feed-1785154708.md` (assignment 5, toasts/Badge/Alert/button-loading-state)

- Reassuring data point: this tester's session ran with a genuine, separate
  Phase B Claude Code session (the skill's intended 2-phase split actually
  followed this time) — and `check-no-div-span.sh` fired correctly, live, 3
  times, confirming the earlier MultiEdit/jq fixes work in real, non-simulated
  use, not just in this session's own direct reproductions.
- **A real contradiction between `core/07-react-hooks.md` and
  `state-management/01-zustand.md`**: the hooks doc's only example
  (`useUser`) unconditionally routes through Zustand with no caveat, while the
  Zustand doc explicitly says not to use it for local, one-component-only state.
  Since core/07's example is the only one shown, an agent following it literally
  for any single-page data-fetching hook (the common case — three of five real
  assignments needed exactly this shape) would reach for Zustand even when
  genuinely unnecessary. Fixed by keeping the Zustand example (clarified it's for
  genuinely-shared state only) and adding an equally-prominent second example
  showing the local-state variant (identical service/mapper/`AsyncState` shape,
  plain `useState` instead) as the more common default.
- **`check-component-files.sh` had two compounding bugs**: it hardcoded the
  6-file (Storybook-on) contract as required, unconditionally, even though
  Storybook was never installed — and its warning used the same stderr+`exit 0`
  discard pattern fixed in three other hooks much earlier this session (item B),
  meaning the warning never reached Claude anyway, on top of being wrong logic.
  This hook had never actually been touched/tested until now — another
  pre-existing baseline hook this session's own many rounds of validation never
  happened to exercise. Fixed both: 5-file contract, correct JSON-on-stdout
  format.
- **Formally resolved Storybook as fixed OFF for this template** — now confirmed
  by three independent findings (this session's very first audit, tester 2, and
  tester 5, all landing on the same observation: never installed, every real
  component consistently used 5-file). Same treatment as every other "pick one"
  decision resolved this session. Removed `features/01-storybook.md`; fixed every
  remaining conditional/stale reference across 9 more files found via a full repo
  sweep (`CLAUDE.md`, `AGENTS.md` — including an entire stale section referencing
  a `core/16-storybook.md` that never existed under that name — `core/01-tech-stack.md`,
  `core/02-project-structure.md`, `core/05-architecture.md`,
  `core/09-anti-patterns-checklist.md`, `core/10-error-handling.md`,
  `features/04-animated-components.md`, both `styling/shadcn/` files).
- **Also surfaced, not yet acted on**: `npm install` succeeds on a Node version
  that violates `package.json`'s own `engines` field (only warns, doesn't hard
  fail until `test`/`build` are actually invoked much later) — suggested fix is
  `engine-strict=true` in `.npmrc`, not yet added. The div/span ban has no good
  fallback for plain, non-emphasized inline text (`<em>`/`<strong>`/`<small>`/
  `<mark>` all carry real semantic meaning, and there's no shadcn/Base UI "Text"
  primitive) — a real, narrow gap, not yet resolved.

Full validation after every fix in this whole batch: repo suite consistently
18/18 tests, `tsc -b` clean, lint unchanged (same 15 pre-existing vendored-file
errors), build succeeds.

## 22. Remaining Section 21 items closed out (2026-07-27)

Every item still open at the end of Section 21 is now resolved:

- **`.npmrc` with `engine-strict=true`** — added, and verified for real: temporarily
  set `package.json`'s `engines.node` to an impossible version, confirmed
  `npm install` now genuinely hard-fails (`npm error code EBADENGINE`) instead of
  only warning, then restored `package.json` and confirmed normal install still
  works fine.
- **HTML Element Policy allow-list completeness** (`core/03-coding-principles.md`) —
  added `<hgroup>`, `<dl>`/`<dt>`/`<dd>`, the table family, `<form>`, `<label>`,
  `<a>`, `<button>`, `<blockquote>`, `<address>` — noting to prefer the vendored
  `Table`/`Label`/`Button` primitives where those already exist.
- **The plain-inline-text gap** — rather than adding a narrow `<span>` exception
  that `check-no-div-span.sh` can't mechanically distinguish from a lazy wrapper
  (which would recreate the exact doc-vs-hook mismatch this whole review effort
  keeps finding), documented `<p className="inline">` instead — renders
  identically to a `<span>`, already an allowed element, zero hook changes needed.
- **The stale "ask the user for every choice" framing** in `CLAUDE.md`/`AGENTS.md` —
  restructured: renamed to reflect reality (fixed decisions, nothing to ask about
  for Step 1), moved the "ask the user" instruction to Step 2 (the genuinely
  still-optional features), where it's actually still true. Also caught and fixed
  along the way: `Testing framework`'s row still listed two options as if
  undecided, contradicting `core/01-tech-stack.md`'s own already-fixed framing;
  and a stale `state-management/02-redux-toolkit.md` reference in a checklist
  line, pointing at a file deleted when Zustand was fixed earlier this session.
- **The "`ThemeProvider` in render" testing claim** — checked directly, only half
  right: `ThemeToggle.test.tsx` genuinely *does* wrap in `ThemeProvider`
  (correctly, since it calls `useTheme()`), contradicting the report's "none of
  the tests do this" — but `ColorSwatch`/gallery tests correctly don't, since they
  never call `useTheme()` at all. The real problem was the rule's own terse,
  unconditional phrasing implying every test needs it. Fixed to state the actual
  condition instead of a blanket requirement.
- **The whole-card click target gap** — a tester needed a whole-`Card`-clickable
  row, correctly avoided putting `onClick` on the `Card` itself (exactly what
  `check-no-div-span.sh`/`core/08-accessibility.md` forbid — `Card` is a plain
  div with no Base UI `render` prop to convert it), and used the standard
  stretched-link/stretched-overlay technique (a real `Button`, `absolute
  inset-0`, real `aria-label`, last child of the `Card`). Documented this
  pattern in `styling/shadcn/04-composition-patterns.md` with a working example,
  so a future session doesn't reinvent it or reach for a forbidden handler.

**Every item from all four real teammate reports (Section 21) is now resolved.**
Full validation held throughout: 18/18 tests, `tsc -b` clean, lint unchanged,
build succeeds.

## 23. Cross-check against an external React/TS guidelines doc (2026-07-27)

User shared a generic React + TypeScript project guidelines document (not
specific to this repo) and asked whether our rules follow it. Checked each
point directly against our actual rules/codebase rather than assume — found 2
exact matches, 2 deliberate architectural differences (not gaps), and 3 genuine
gaps plus one convention we'd been following inconsistently by habit without
ever formalizing or enforcing it.

**Deliberate differences, confirmed not gaps**: their doc specifies Context API
+ TanStack Query for state/server-state; we use Zustand + a custom fetch-based
`apiClient` — a real, researched architectural decision (Section 16), not an
oversight. Their doc says "standard inline interfaces" for props; we use a
separate, co-located `types.ts` file per component — an established, deliberate
convention throughout this whole project.

**Three genuine gaps, closed**:
1. **Import ordering was prose-only** — our own rule said "keep import order
   compatible with ESLint rules," but no such rule actually existed. Installed
   `eslint-plugin-import-x` (verified via research to be the actively-maintained
   fork with real ESLint 9 flat-config support before choosing it over the
   original `eslint-plugin-import`) and configured `import-x/order` to match
   `core/06-typescript.md`'s already-documented 5-group convention exactly.
   Scoped to exclude `src/components/ui/**` (vendored, never edited — same
   pattern used for every custom rule added this session). Verified for real:
   found and auto-fixed 14 genuine violations in our own code, zero touching
   vendored files.
2. **No enforced return-type requirement** on exported functions/hooks — some
   examples happened to show one, nothing required it universally. Tested
   `@typescript-eslint/explicit-module-boundary-types` first (found only 14 real
   violations across the whole codebase, a manageable number, confirming real
   enforcement was viable) before enabling it for real, same vendored-`ui/`-
   excluded scope.
3. **`satisfies` was never mentioned anywhere**, genuinely unused. Added
   guidance to `core/06-typescript.md` with a concrete, applicable example (a
   `ROUTES`-style literal config object) showing why a plain type annotation or
   `as const` alone can't do both shape-checking and literal-type preservation
   the way `satisfies` + `as const` together can.

**The convention formalized**: "named arrow-function `const`s, never `function`
declarations, never default exports" — this session had been following this
inconsistently by habit (every component built used `export function X()`)
without ever writing it down or enforcing it. Installed `eslint-plugin-react`
for `react/function-component-definition` (same vendored-`ui/`-excluded scope),
tested it, found 7 real violations across our own components, all auto-fixed
correctly. Documented explicitly in `core/03-coding-principles.md`. Also
converted `App.tsx` from a default export to a named export (the other half of
this convention) — it was the one remaining default export anywhere in `src/`
— and updated `main.tsx`'s import to match. Converted every rule doc's own code
examples still showing the old function-declaration pattern (12 instances
across 7 files: `core/11-performance.md`, `core/12-routing.md`,
`forms/01-rhf-zod.md`, both `styling/shadcn/` files, both `features/` files) so
the docs don't contradict what's now actually enforced.

Full validation after every change: 18/18 tests (unchanged assertions — purely
a syntax/style refactor, zero behavioral change), `tsc -b` clean, lint clean
(same 15 pre-existing vendored-file errors only), build succeeds
(`ComponentsGalleryPage` still correctly code-splits via `React.lazy`).

## 24. React Router routing-rule gaps found via remix-run/agent-skills (2026-07-27)

User observed generated code wasn't following standard routing patterns and
specifically pointed at `remix-run/react-router`'s `.agents/skills` folder — the
React Router team's own official agent skills, one per usage mode (framework
mode: full Vite-plugin/SSR; data mode: `createBrowserRouter`/`RouterProvider`
with loaders/actions, no Vite plugin; declarative mode: `BrowserRouter`/JSX
`Routes`/`Route`, no data loading). Confirmed our actual code (`BrowserRouter` +
JSX `Routes`/`Route`, no loaders/actions) matches **declarative mode** exactly,
then fetched that skill's real content to compare against directly, not guessed.

Found two real, concrete gaps:

1. **Stale version reference** — `core/12-routing.md` said "React Router v7";
   our actual installed `package.json` has `react-router@^8.2.0`. Swept the
   whole repo for the same staleness and found three more: the same file's own
   frontmatter description, `core/README.md`'s summary table, `CLAUDE.md`'s
   summary table, and `AGENTS.md`'s Active Tech Stack table — which
   additionally still said "React Router DOM v7," the pre-unification package
   name (no separate `-dom` package since v7). All fixed to v8 with the
   correct package name.
2. **The much bigger gap** — `core/12-routing.md` documented *only* the router
   setup and the auth-guard layout-route pattern; it never once mentioned
   `Link`, `NavLink`, `useParams`, `useSearchParams`, `useNavigate`, or
   `useLocation` — the most commonly-needed APIs in any real multi-page app,
   completely undocumented. Added dedicated sections for each, confirmed
   against the official declarative-mode skill's actual content: `Link`/
   `NavLink` with the `isActive` render-prop pattern for active-route styling
   (never track this manually with `useLocation`), `useParams`/
   `useSearchParams` for reading route data, `useNavigate`/`useLocation` for
   programmatic navigation, and a shared-layout-route pattern (`Outlet`-wrapped
   persistent nav/header for sibling pages) distinct from the existing
   auth-guard layout route, which was the only layout-route use case
   previously documented.

Checked our own actual code against the new "never raw `<a>` for in-app
navigation" rule: `ComponentsGalleryPage`'s nav uses plain anchor tags, but
those are same-page anchor jumps to sections (`href="#section-id"`), not route
navigation — a legitimate, different use case the new rule explicitly carves
out, so no code change was needed there.

Validated: 18/18 tests, `tsc -b` clean (docs only, unaffected as expected).

## 25. DECISION: migrate to React Router data mode — plan, Phases 1-2 done (2026-07-27)

**This is the current top-priority item for the next session.** User made a deliberate,
explicit call: this repo is a global template other teams will build real, growing
projects on top of — it needs the more capable, more scalable routing/data-fetching
foundation from day one, not something retrofit later once real projects already
depend on the simpler pattern (declarative mode, what we currently have).

### The decision itself

Move from **declarative mode** (`BrowserRouter` + JSX `Routes`/`Route`, all data
fetching via component-level `useEffect`/hooks — what we have today, confirmed to
match this mode exactly in Section 24) to **data mode**
(`createBrowserRouter`/`RouterProvider`, route-level `loader`/`action` functions).
Framework mode (Vite plugin, optional SSR) was considered and explicitly rejected for
now — it requires committing to a server runtime and SSR, which contradicts this
template's current local-only, no-deployment-decided scope. Data mode is the
"sweet spot": it fixes real, confirmed weaknesses in what we built (see below) without
that much bigger leap.

### Why data mode specifically, technically confirmed (not assumed)

Verified directly via React Router's own current docs/tutorials before deciding:
- **Loaders start fetching when the route matches, before the component renders** —
  eliminates the render-then-fetch waterfall inherent to our current
  `useEffect`-in-a-hook pattern.
- **Actions auto-revalidate** — "once completed, React Router automatically
  revalidates the UI data without you having to handle that process manually." This
  directly replaces the manual `await create(...); await load();` re-fetch pattern
  used in the item-1 dry-run's `useProducts` hook (Section 19).
- **`useFetcher()` handles fetch cancellation, concurrent-fetch coordination,
  revalidation, redirects, and optimistic UI, all built-in** — none of which our
  hand-rolled `apiClient` + `AsyncState<T>` pattern has today.
- Confirmed this is still a client-only SPA (no Vite plugin, no SSR) — same
  deployment model as today, just a better data layer.

### The full 10-phase plan (agreed with user, nothing implemented yet)

1. **Router itself**: `createBrowserRouter([...])` + `<RouterProvider>` replaces
   `<BrowserRouter>` + JSX `Routes`/`Route`. `App.tsx` simplifies (no longer manually
   wraps `BrowserRouter`). Route-level `lazy: () => import(...)` replaces the current
   `React.lazy(...).then()` adapter — genuinely simpler, since data-mode's route-level
   `lazy` doesn't have `React.lazy`'s default-export requirement that forced that
   adapter in the first place. No new dependency needed —
   `createBrowserRouter`/`RouterProvider` already ship in the installed `react-router`
   package.
2. **Data fetching (the biggest shift)**: fetching moves from component hooks into
   route-level `loader` functions. Components read data via `useLoaderData()` /
   `useRouteLoaderData()` (parent route's data from a child route). The
   `apiClient` → service → mapper chain stays exactly as-is — only the *caller*
   changes (a loader instead of a custom hook). `AsyncState<T>`'s role narrows to
   non-route-tied fetches only (e.g. a modal's on-demand fetch) — the router itself
   tracks route-tied pending state via `useNavigation()`.
3. **Mutations**: route-level `action` functions replace "call the service, then
   manually re-fetch." Need to work out exactly how RHF+Zod fits — RHF still owns
   client-side validation, but on valid submit call `useSubmit()`
   (or `useFetcher()` for a non-navigating submit) instead of calling the service
   directly from the component. This is a real design decision to get right, not
   guess at, when the work actually starts.
4. **Error handling**: data mode's per-route `errorElement`/`ErrorBoundary` catches
   loader/action errors at the nearest route, complementing (not replacing) the
   existing app-level `ErrorBoundary`.
5. **Auth / `ProtectedRoute`**: idiomatic data-mode pattern is a loader doing
   `throw redirect(ROUTES.LOGIN)` before render — no flash of protected content while
   a component-level check runs, unlike the current `<Navigate>` approach.
   `core/12-routing.md`'s `ProtectedRoute` pattern needs reworking to match.
6. **State management boundary (Zustand)**: route-tied server data lives in loader
   data (`useLoaderData`), never duplicated into a Zustand store. Zustand stays
   reserved for genuinely global client state (theme, session flags, UI state) —
   simplifies the state-management story, doesn't complicate it.
7. **Testing conventions**: need a documented pattern for testing loaders/actions
   directly (call with a fake `Request`/params, mock `apiClient`), plus
   `createMemoryRouter` for integration-style component tests needing real routing
   context. `testing/01-vitest-rtl.md` is currently silent on this entirely.
8. **Rule docs needing updates**: `core/12-routing.md` (the most central rewrite —
   router setup + `ProtectedRoute`), `core/07-react-hooks.md` (the `useUser` example
   becomes a loader example), `core/10-error-handling.md` (`AsyncState<T>` scoped
   down, per-route error boundary guidance added), `data-fetching/02-api-services.md`
   / `03-data-layer.md` (service layer unchanged, but "who calls it" story changes),
   `forms/01-rhf-zod.md` (the submit-flow decision worked in),
   `testing/01-vitest-rtl.md` (new loader/action testing section),
   `state-management/01-zustand.md` (the boundary clarification added).
9. **Prove it on real code**: convert the one real route (`/components-gallery`) to
   the new format first — low-risk proof, since it has no real data-fetching yet.
   Then actually build a small real loader-backed feature — **this should fold in the
   still-pending "reference feature" decision from Section 8/16** (build it once, in
   data mode, rather than building it now in the old pattern and migrating it later).
10. **Full validation at each phase, not just at the end** — typecheck, lint, test,
    build after every phase, same discipline as everything else this project.

### Progress log

**Phase 1 — done (2026-07-27).** Repo cloned fresh into a new session's
container per the process note below.
- `src/config/routes.tsx`: `Routes`/`Route` JSX replaced with a `RouteObject[]`
  array passed to `createBrowserRouter`; exports `router` instead of the old
  `AppRoutes` component. The one real route (`/components-gallery`) now uses
  route-level `lazy: async () => {...}` returning `{ Component }` — the
  `React.lazy(...).then()` default-export adapter is gone, since data-mode's
  `lazy` accepts a named export directly.
- The route's `HydrateFallback` (shown only on first-load while `lazy()` is
  still resolving, per React Router's own docs — skipped on client-side nav)
  was pulled into its own file, `src/config/routeFallback.tsx`, because
  keeping it inline in `routes.tsx` tripped `react-refresh/only-export-components`
  (that file exports the non-component `router`, so it can't also export/contain
  a component to stay a valid fast-refresh boundary).
- `src/App.tsx`: `<BrowserRouter><AppRoutes /><Toaster /></BrowserRouter>` →
  `<RouterProvider router={router} /><Toaster />` as siblings inside
  `ThemeProvider` (Toaster/ThemeProvider/app-level `ErrorBoundary` are
  route-agnostic globals, not part of the router tree, so they sit alongside
  `RouterProvider` rather than inside it).
- Validated per the Phase 10 discipline: `tsc -b` clean, `npm run lint` back to
  the pre-existing baseline of 15 errors (all in unrelated shadcn/ui generated
  files — confirmed by running lint *before* this change to get that exact
  baseline first), `vitest run` 7 files / 18 tests passing (unchanged from
  baseline), `npm run build` succeeds and the `/components-gallery` route
  still code-splits into its own chunk (confirms route-level `lazy` preserves
  the code-splitting the old `React.lazy` adapter provided).
- Not yet committed to git as of writing this — see Working Agreements
  (Section 26) on holding pushes; local commit is fine and expected next.
- **Next up: Phase 2** (move data fetching into route `loader`s). Phases 3–10
  remain exactly as planned below, untouched.

**Phase 2 — done (2026-07-27).** No route in the repo actually fetched data yet
(only the static `/components-gallery`), so there was nothing to literally
"migrate" — per plan item 9, this phase's real work was building the first
loader-backed feature to prove the pattern on. Used the **Products catalog**
domain from the Round-1 feature-test assignment table (`.claude/skills/
run-feature-test/SKILL.md`, assignment 1) as the reference feature, matching
its existing DTO/domain shape. User explicitly chose (asked directly, see
conversation) to also wire the search filter through Zustand rather than
local-only state, closing the open question from Section 8.

- **`db.json`**: added a `products` resource (6 seeded items, snake_case DTO
  fields: `product_name`, `unit_price`, `category`, `in_stock` — deliberately
  different casing/shape from the domain model, so the mapper does real work,
  not a pass-through).
- **Data layer, full stack, no shortcuts**: `src/types/common.types.ts`
  (`ApiResponse<T>`), `src/types/product.types.ts` (`Product` domain model,
  camelCase, `priceInCents`), `src/services/product/` (DTO type + `getProducts`
  service, optional `?q=` search param), `src/services/mappers/productMapper.ts`
  (DTO → domain, including a unit-price → cents rounding step). Every layer has
  its own test file mocking one level down (service test mocks `apiClient`,
  mapper test is pure-function, no mocking needed).
- **`src/pages/products/ProductsPage.loader.ts`**: reads `?q=` off the route's
  `Request` URL, calls the service, maps to domain models, returns
  `{ products, searchTerm }`. This is the actual point of Phase 2 — fetching
  now starts the moment the route matches, not after the component renders.
- **`src/store/productFilters/`**: a Zustand store holding only the transient
  search-input text (`searchTerm`) — deliberately *not* the fetched products
  themselves, which live in loader data via `useLoaderData()`. This is the
  concrete instance of plan item 6's rule (route-tied server data never
  duplicated into a store) rather than just prose.
- **`src/pages/products/ProductsPage.tsx`**: `<Form method="get">` search input
  (keyed on the committed `searchTerm` so it resyncs after each successful
  search, rather than fighting Base UI's uncontrolled-input warning),
  `useNavigation()` for a pending indicator instead of a component-level
  `AsyncState<T>`, `Empty` state, and a feature-scoped `ProductCard`
  (`pages/products/components/productCard/`, per the promotion rule — not
  reusable elsewhere yet).
- **`src/components/blocks/routeErrorFallback/`**: a generic `RouteErrorFallback`
  (`useRouteError()` + `isRouteErrorResponse()`), wired as `/products`'s
  `ErrorBoundary`. This is a working instance of plan item 4's per-route error
  handling, though the broader rule-doc rewrite for error handling stays
  Phase 4's job — this one component isn't meant to be the final word on that
  phase, just what this route needed to be genuinely usable.
- **Router wiring** (`src/config/routes.tsx`): `/products` uses `lazy()` to
  resolve *both* `Component` and `loader` together (confirmed this works and
  code-splits both into one chunk — `dist/assets/products-*.js` — via a real
  `npm run build`), plus the new `HydrateFallback`/`RouteErrorFallback`.
- **Testing conventions actually used** (ahead of Phase 7's formal doc update):
  loader tested directly with a real `Request` + mocked service
  (`ProductsPage.loader.test.ts`); page tested with `createMemoryRouter` +
  `RouterProvider`, mocking the service at the network boundary, including a
  real user-event search round-trip that re-invokes the loader
  (`ProductsPage.test.tsx`).
- **Real end-to-end proof, not just mocked tests**: started an actual
  `json-server` instance against the seeded `db.json` and `curl`'d both
  `GET /products` and `GET /products?q=lamp` directly — confirmed json-server's
  real full-text search matches what the service assumes, not just what the
  mocks assume.
- Validated per the Phase 10 discipline: `tsc -b` clean, lint back to the same
  15-error baseline (all pre-existing, unrelated shadcn/ui files — some import-
  order errors surfaced in the new files along the way and were fixed via
  `eslint --fix` before final validation), `vitest run` 14 files / 38 tests
  passing (up from the 7/18 Phase 1 baseline), `npm run build` succeeds.
- Not yet committed to git as of writing this — see Working Agreements
  (Section 26). **Next up: Phase 3** (route-level `action` functions for
  mutations — this reference feature is currently read-only; add/edit/delete
  for the Products catalog, folding in the RHF+Zod submit-flow decision from
  plan item 3, is the natural next real code to build it on).

### Independent review of Phase 1 + 2 (2026-07-27, separate session)

User asked this session to check whether the other session's Phase 1/2 work
(pushed to GitHub in the meantime) was actually needed/correct — reviewed it with
the same rigor as every test-report review, not just trusting the commit
messages' self-reported validation:
- Re-ran typecheck/lint/test myself from a fresh `npm install` — confirmed
  genuinely clean/passing (38/38 tests), no new dependencies added.
- Reading the actual code line by line surfaced **4 real issues**, all fixed:
  1–3. Three genuine `<div>` violations — `ProductsPage.tsx`'s page wrapper and
     product grid, `ProductCard.tsx`'s `CardTitle`/`CardDescription` wrapper,
     `RouteErrorFallback.tsx`'s wrapper — confirmed directly against the real
     `check-no-div-span.sh` hook, not assumed. Fixed with `section` (page
     wrapper, error fallback), `ul`/`li` (the product grid — matching
     `ThemeHistoryPanel`'s established list pattern), and `hgroup`
     (`CardTitle`+`CardDescription` — exactly what `hgroup` exists for, added
     to the allowed-element list during the earlier external-guidelines
     cross-check, Section 23). Confirmed all three clean against the real hook
     after fixing.
  4. `useLoaderData()` was double-cast through `unknown` rather than using the
     hook's own generic parameter. Checked the actual installed `react-router`
     type declaration directly (`useLoaderData<T = any>(): SerializeFrom<T>`)
     — confirmed `useLoaderData<typeof productsLoader>()` type-checks
     correctly, removing the unknown-cast entirely.
- Also cleaned up a minor test-environment artifact: both test files'
  `createMemoryRouter` configs were missing a `HydrateFallback` (the real
  production router has one, correctly) — added it to both, confirmed the
  previously-appearing stderr warning is gone.
- Validated end-to-end again after the fixes, not just re-running unit tests:
  built the app, started a real `json-server` + `vite preview`, confirmed both
  routes return 200 and the live API correctly filters a real search query.
- Committed and pushed these fixes on top of the other session's Phase 1/2
  commits. **Verdict: the other session's work is solid overall and was worth
  keeping — these 4 fixes are refinements on a sound foundation, not signs the
  approach was wrong.**

**Phase 3 — done (2026-07-28).** Full CRUD on the same Products catalog
reference feature: add/edit/delete, closing out assignment 1's full spec
(`run-feature-test/SKILL.md`) rather than leaving it read-only. Built in a
separate session, in parallel with the independent review above — rebased
onto the review's fixes before pushing, and separately audited (and fixed) the
same `<div>`/`<span>` issue in this phase's own new code
(`ProductsPage.tsx`'s toolbar row → `<header>`, `DeleteProductDialog.tsx`'s
inline emphasis `<span>` → `<strong>`), since that rule wasn't something this
session had internalized from the start — it was only caught by the other
session's line-by-line review, and would have recurred here otherwise.

- **Service layer**: `createProduct`/`updateProduct`/`deleteProduct` added to
  `productService.ts` (POST/PATCH/DELETE via `apiClient`), each with its own
  test mocking `apiClient`. `ProductInput` type added for the dollars-based
  form shape (`toDto()` maps it to the DTO — no cents conversion needed here,
  since `unit_price` in the DTO is already dollars; only the *domain model's*
  `priceInCents` is cents, which stays mapper-only).
- **`ProductsPage.action.ts`**: a single route `action` dispatching on
  `request.method` (POST/PATCH/DELETE) — the concrete resolution of plan item
  3's "need to work out exactly how this fits" note. Returns
  `{ ok, error? }` rather than throwing for known API failures, so a failed
  mutation shows an inline toast without triggering the route's
  `ErrorBoundary` (that's reserved for the loader/genuinely-broken-route case).
  Full test coverage: all three methods plus the error and unsupported-method
  paths, called directly with real `Request`/`FormData`.
- **The RHF+Zod ↔ router decision, worked out for real** (not just prose):
  `ProductFormDialog` uses `useForm` + `zodResolver` for client-side
  validation exactly as `forms/01-rhf-zod.md` requires (including that rule
  doc's own `z.coerce.number()` input/output split — which, notably, already
  used a `ProductsPage.schema.ts` example before this feature existed).
  On a *valid* submit, the RHF `onSubmit` callback builds `FormData` and calls
  `fetcher.submit(..., { method, action: ROUTES.PRODUCTS })` — a non-navigating
  `useFetcher`, not a direct service call and not `useSubmit` (which would
  navigate away from the list). RHF still fully owns client validation; the
  router only sees a submission once RHF has already approved it.
- **`ProductFormDialog`** (create/edit, same form) and **`DeleteProductDialog`**
  (confirmation, matching assignment 1's "delete button with confirmation")
  added under `pages/products/components/`, each with full test coverage via
  `createMemoryRouter` + a real (non-mocked) `action` function passed directly
  into the test's router, asserting the actual `FormData`/HTTP method that
  reaches it — not just that a mock got called.
- **`ProductCard`** extended with optional `onEdit`/`onDelete` callback props
  (a `CardFooter` renders only when provided) — kept optional rather than
  required, since other future usages of this card may be read-only.
- **Dialog open/target state kept as local `useState` in `ProductsPage`**, not
  Zustand — concretely applying the state-management boundary from plan item 6
  ("Zustand reserved for genuinely global state"): which dialog is open and
  which product it targets is ephemeral, single-interaction UI state, not
  global app state, unlike the search term (which persists across the
  interaction and could reasonably be read elsewhere).
- **Router wiring**: `/products`'s `lazy()` now also resolves `action:
  productsAction` alongside `Component`/`loader` — confirmed via `npm run
  build` that all three still code-split into the same `products-*.js` chunk.
- **Real end-to-end proof, not just mocked tests**: ran actual `POST`/`PATCH`/
  `DELETE` requests against a live `json-server` instance (on a scratch copy
  of `db.json`, so the repo's seed data stayed untouched) and confirmed each
  one matches what the service/action assume.
- Validated per the Phase 10 discipline: `tsc -b` clean (including one real
  fix along the way — `DialogClose`'s `asChild` doesn't exist on this
  codebase's Base-UI-backed primitive; the correct composition is `render={<
  Button />}`, which the existing `DialogFooter`'s `showCloseButton` already
  used internally, so this wasn't a guess), lint back to the same 15-error
  baseline (some import-order errors surfaced across the new files and were
  fixed via `eslint --fix` before final validation), `vitest run` 17 files /
  61 tests passing (up from 14/38), `npm run build` succeeds.
- Rebased onto the independent review's commits before pushing (the review's
  fixes landed on the remote while this phase was in progress in a separate
  session) — resolved conflicts by keeping the review's `section`/`ul`/`li`/
  `hgroup`/`useLoaderData<typeof productsLoader>()` fixes and layering this
  phase's mutation UI (toolbar button, edit/delete callbacks, both dialogs) on
  top, plus fixing this phase's own 2 new `<div>`/`<span>` instances the same
  way. Re-ran the full validation suite again after the rebase.
- **Next up: Phase 4** (per-route error handling — Products already has a
  working `RouteErrorFallback` from Phase 2, but the broader rule-doc rewrite
  for `core/10-error-handling.md` per plan item 4/8 is still open), or Phase 5
  (auth/`ProtectedRoute` redirect pattern), whichever the user wants tackled
  next.

### Process note on how this gets picked up

User asked whether this chat session has a length limit and needs a fresh chat to
continue this work — confirmed yes (this conversation has already been compacted
once). Recommended starting the actual migration in a **new chat**, with this
section serving as the complete, self-contained briefing — read this file first in
any new session before starting Phase 1. Confirmed the actual migration work itself
does *not* require Claude Code specifically — everything done this whole project
(file edits, git commits/pushes, running builds/tests) has been through this same
chat interface's own tool access, not Claude Code. Claude Code only matters again
later, for genuinely re-running the `run-feature-test` skill against the migrated
result the same way reports 1–6 tested the current architecture.

**Status: Phases 1 and 2 complete and independently reviewed/fixed. Phase 3
(route-level `action` functions for the Products catalog's add/edit/delete,
folding in the RHF+Zod submit-flow decision from plan item 3) is next.**

## 26. Working agreements / process notes

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
