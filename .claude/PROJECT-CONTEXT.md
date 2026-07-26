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

## 7. Working agreements / process notes

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
