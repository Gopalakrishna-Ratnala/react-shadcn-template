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

**Planned (not yet executed) git housekeeping**, proposed by Claude, not yet confirmed
by user:
- Branch off current tip as `reference/research-exploration` (preserves everything,
  permanently browsable, never deleted)
- Reset `main` back to `117d42e` (the real clean baseline)
- Real standardized development starts fresh from there
- Anything from the research branch (e.g. `ComponentsGalleryPage`'s general *shape/idea*,
  the theme-file format work, the rules-refresh fixes) can be used as **reference for
  what worked**, but must be rebuilt clean against the finalized architecture — not
  imported wholesale.

**Action needed:** confirm with user whether to actually execute this branch/reset now,
or continue treating it as a conversational understanding only.

**Note on current local branch clutter (this working directory only):** local branches
`feature/components-listing-page-theming-v2` and `feature/shadcn-rules-react-refresh`
still exist here even though they were deleted from the `Gopalakrishna-Ratnala` remote
(consolidation into `main` was the point — the local branches are just leftover, not
meaningful). `origin`'s own remote-tracking branches (`template-test/dashboard`,
`test/qad-theme-applied-1.0`, `feature/components-listing-page`) are untouched originals
from `divamidesignlabs/shadcn-template` — never explored, not part of anything decided
here.

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
  and promote it. **Not yet written.**

### Other repo-wide standing rules from earlier work (already fixed, stay fixed)
- shadcn rule docs refreshed against current official docs (chart/sidebar tokens added,
  `globals.css` path references corrected to actual `src/styles/themes/theme.css`,
  `next-themes` claim corrected, oklch example updated) — commit `12ab3dd`.

---

## 5. Known open problems — not yet fixed, need attention

Roughly in the order Claude suggested tackling them (user has not yet confirmed which
to start with):

**A. Rules still stale or undecided, need the same audit shadcn/MUI already got:**
- `data-fetching/` — currently assumes **Axios** (never actually installed —
  `package.json` has no axios) + a synchronous static-mock/mapper flow. Needs to be
  rewritten around **json-server** actually running locally (real `fetch`/`axios` calls
  hitting e.g. `http://localhost:3001/...`, a real `db.json`, real async loading states)
  — not a synchronous mock function returning hardcoded arrays.
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

**C. Component tier system needs to be made explicit and unambiguous**, since the plan
is: shadcn primitives now, project-specific and global/shared components later. Needs a
clear rule (strengthening `core/02-project-structure.md`) covering:
- `ui/` — vendored shadcn only, never modified
- `shared/` — truly global, reusable anywhere
- `blocks/` — composite, reusable but opinionated (the research branch's `FilterBar`,
  `PageHeader`, `StatCard`, `StatusBadge` are a reasonable *shape* reference, not to be
  reused verbatim per the Section 3 framing)
- feature-specific components — not reusable, live with their feature
- an explicit rule for **when/how something gets promoted** from feature-specific to
  shared/blocks, so duplication doesn't creep in as features accumulate

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
  matches Vite's and shadcn's own official scaffolds. Three real gaps found and fixed:
  1. `vite.config.ts` referenced `src/test/setup.ts`, which didn't exist in the true
     baseline — turned out already fixed by the research-branch work (properly mocks
     `matchMedia`/`ResizeObserver` for `next-themes`/Base UI/recharts). No action needed.
  2. No Prettier/`.editorconfig` anywhere — fixed: added `.prettierrc` +
     `.prettierignore` (excludes vendored `src/components/ui/`) + `prettier-plugin-tailwindcss`
     pointed at `src/index.css` as the Tailwind v4 stylesheet entry, plus `format`/
     `format:check` npm scripts. Verified end-to-end: `npm install`, `format:check` →
     `format --write` → clean, `lint` (15 pre-existing errors remain, all in vendored
     `ui/`, unrelated to this change), `tsc -b` clean, full vitest suite (16 files / 36
     tests) passing.
  3. `core/02-project-structure.md`'s naming rule told Claude to derive names from "the
     Figma design's frame name" — contradicts the actual Figma-less workflow. Fixed to
     reference business purpose from the prompt/discussion instead.
  - Pushed as 3 commits: `b8465ab` (Prettier + Figma fix), `f5323ca` (formatting applied
    to existing files), on top of `232ab81` (this context file's initial commit).
- **Section 5 item B (hook bug) — FIXED.** See Section 5 above for detail. Pushed as
  commit `8296d52`.
- **Still pending, not yet done:** the git housekeeping plan (branch off
  `reference/research-exploration`, reset `main` to `117d42e`) — still just a proposal,
  not executed. Getting more expensive to do cleanly the longer it's deferred, since
  each new validated fix (Prettier, hook fixes) lands on top of the research-laden
  `main` rather than a clean trunk; would need cherry-picking onto a fresh branch rather
  than a simple reset if done now.
- **Next up (per discussion):** component tier system (item C) — proposed as the next
  step after hook fixes, since it's foundational to items D and E.

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
