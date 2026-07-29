---
name: run-feature-test
description: Run one tester's assigned feature-building test for react-shadcn-template - clones the repo fresh, then hands off clear instructions for testing the guardrails in a properly-scoped second session (required by a real Claude Code platform limitation), then writes and pushes the report. Takes a tester number (1-6) for the breadth round, or "4-repeat" for the theme-versioning repeatability round. Use when someone says "run feature test N", "run as tester N", or "run the theming repeatability test" for this repo's parallel testing exercise.
trigger: /run-feature-test
---

# Feature Test Runner (2-phase — read this first, it's not optional)

## Why this is 2 phases, not 1 fully autonomous run

**Claude Code only loads `.claude/settings.json` (and therefore hooks) from the
session's *startup* working directory** — this is a confirmed, filed Claude Code
platform limitation, not something this skill can work around. If this skill's whole
flow ran from inside wherever *this* session started (not the freshly-cloned test
directory), every file written into `/tmp/feature-test-<N>/...` would be written by a
session whose hooks are **not** the test repo's own hooks — any "no hooks fired"
result would mean nothing, since the hooks never had a chance to fire at all. The
only reliable fix is restarting Claude Code from the target directory — so that's
what this skill requires, at the cost of losing full walk-away autonomy for the
feature-building step specifically. Cloning, reporting, and pushing remain fully
autonomous; only the actual feature-building step needs a human to switch directories
and start a second session.

## General rule for both phases: never ask, pick and document

**Before running this skill for the first time on a given machine**, make sure
`.claude/settings.local.json` exists with a permission allow-list covering
`git`/`npm`/`npx`/`node` and file `Read`/`Write`/`Edit` — see
`docs/FEATURE-TEST-PLAN.md`'s Step 0 for the exact content. Without it, Claude Code
will prompt for approval on nearly every individual command, which is a
**different problem from, and should not be confused with**, the one deliberate
human handoff this skill requires (below) — that handoff is structural (a real
Claude Code platform limitation), not a permissions gap, and isn't something any
settings file can remove.

**Never pause to ask the human anything mid-phase.** If something is ambiguous, pick
the more conservative/standard choice, note it in the "Assumptions made" section
later, and keep going. The only acceptable early stop is a hard, unrecoverable error —
even then, don't ask a question, just report what happened.

**Two things that have caused real friction in practice, avoid both:**
- **Do not combine `cd <path> && <command> > <file>` in one compound command** —
  triggers Claude Code's own manual-approval security prompt. Redirect output
  separately from any `cd`, or just let normal tool-call output come back directly.
- **Do not rely on `timeout`** — absent on macOS by default. If a command hangs,
  suspect the repo is cloned inside a cloud-synced folder (iCloud Drive, Dropbox,
  OneDrive) and say so in the report rather than fighting it.

---

## PHASE A — in this session (wherever it's invoked from)

### Step 1 — Get the tester number, and which round

There are **two rounds**, testing two different things:

- **Round 1 (breadth)**: assignments 1–6, one run each — finds *where* gaps are
  across every subsystem, at least once each.
- **Round 2 (repeatability)**: assignment 4 (theme candidate creation) repeated
  multiple times across separate sessions — finds whether the theme-versioning
  workflow is *reliable*, not just whether it can pass once. This subsystem gets
  its own repeated round specifically because it's the one a designer will use
  constantly, every design round, for the entire lifetime of every real project —
  a single pass tells you almost nothing about whether it holds up under that kind
  of repeated real use.

If invoked as `run feature test N` (a plain number 1–6), run **Round 1** for that
assignment — proceed to Step 2 as normal.

If invoked as `run feature test 4-repeat` (or "run the theming repeatability
test," "run theme versioning repeat test"), run **Round 2** — skip to
"Round 2 — Theme Versioning Repeatability," below, instead of Step 2.

If genuinely no number/mode was given, default to the lowest-numbered Round 1
assignment whose report file doesn't already exist in `test-reports/` — don't ask
which one to use.

### Step 2 — Look up your assignment (inlined here, not read from another file)

This repo is a single, fixed boilerplate (shadcn/ui + Base UI, Zustand, RHF+Zod,
axios-based `apiClient` + json-server) — there's no bundle/variant system to select.
Every assignment builds against the same repo; what varies is the **feature task**,
each one deliberately chosen to stress a different part of the ruleset. Together,
assignments 1–6 exercise every rule file and every hook in `.claude/`.

| # | Feature task | What it specifically stresses |
|---|---|---|
| 1 | **Products catalog**: a page listing products from `data/mockData/db.json` (add a `products` array if one doesn't exist), a search input filtering by name, an add/edit form, and a delete button with confirmation | `apiClient` → service → mapper → `AsyncState`, `Field`/`FieldGroup` + Zod, component tiers, `Card` composition, testing conventions |
| 2 | **Team directory**: a grid/list of people (seed `data/mockData/db.json` if needed) with a `ToggleGroup` to switch grid/list view, `Avatar`+`AvatarFallback` per person, and a `Dialog` showing member detail on click (must have a `DialogTitle`, `sr-only` if visually hidden) | Zustand (store the view-mode toggle state), `Dialog` + overlay-title rule, `ToggleGroup`, `Avatar`, accessibility |
| 3 | **Settings page**: `Tabs`/`TabsList` sections (e.g. Profile / Security / Notifications), an `InputGroup` password field with a show/hide toggle button inside the input, a `Skeleton` shown while data "loads," a `Separator` between sections, and the existing `ThemeToggle` used prominently in the header | `Tabs`, `InputGroup`, `Skeleton`, `Separator`, dark/light theming |
| 4 | **Theme candidate creation**: given 3 designer-supplied brand color sets (make up 3 plausible, distinct palettes if none are provided), create 3 theme candidates following the documented naming convention, log all 3 in `THEME-LOG.json`, then promote one | The full theme-versioning workflow — naming convention, `THEME-LOG.json` schema, `check-theme-log-entry.sh`, token-completeness validation |
| 5 | **Activity feed**: a list of events (seed `data/mockData/db.json`) with `Badge` status indicators, an `Alert` shown on a simulated fetch error, a toast (`sonner`) on a simulated new item, a `Skeleton` while loading, a "load more" `Button` using the loading-state pattern (`Spinner` + `data-icon` + `disabled`, never `isLoading`/`isPending` props), and an `Empty` state when there's nothing yet | Toasts, `Badge`, `Alert`, button loading-state composition, `Empty` |
| 6 | **Minimal baseline page** — a single simple page with one heading and one piece of real content, deliberately simple, no special composition required | Control case — confirms nothing extra leaks in unprompted; results should be the cleanest of all six |

For any assignment, if a real generation/setup error occurs unrelated to the feature
task itself, capture the exact error, write it into the report (skip to Step 5 below
with no code/hooks sections — there's nothing to report), and stop.

### Step 3 — Clone fresh (no confirmation, just do it)

```bash
git clone https://github.com/Gopalakrishna-Ratnala/react-shadcn-template.git /tmp/feature-test-<N>
cd /tmp/feature-test-<N>
npm install
```

If `npm install` fails on Node-version grounds (this project requires
`>=22.22.1`, see `package.json`'s `engines` field), report the exact Node version
present and the exact error, and stop — don't attempt a workaround.

### Step 4 — Hand off to a new session, then STOP and wait

Print this to the human **verbatim**, then end your turn — don't do anything else
until they come back with Phase B's output:

> Clone ready: `/tmp/feature-test-<N>`.
>
> To actually test this project's guardrails (not just clone it), open a **new
> terminal window**, then run:
> ```
> cd /tmp/feature-test-<N>
> claude
> ```
> Once that new session starts, paste the exact prompt from this skill's "PHASE B"
> section below into it (for your assignment number, `<N>`).
>
> When that session finishes, copy its entire final summary output and paste it back
> to me here, and I'll write and push the report.

---

## PHASE B — prompt for the human to paste into the NEW session (started inside the cloned test directory)

*(This is the literal text to paste — reproduced here so Phase A can show it
verbatim, substituting in the assignment's feature task from the table above. If you
are the session receiving this prompt: you're now running with the correct working
directory, so this repo's actual `.claude/settings.json` hooks are active for real.
Build the feature for real, then output the structured summary at the end — don't
ask questions, same "pick and document" rule as always.)*

> Build the following feature for this app, fully specified below — every decision
> that might otherwise need asking is already made:
>
> **<paste the assigned feature task from the table above, verbatim>**
>
> In `npm run mock-api` in a separate terminal to have a real local API available if
> the task needs one — assume it's running at the URL in `.env.example`. If `data/mockData/db.json`
> doesn't have the resource this task needs, add it.
>
> Build this the way you normally would given this project's real `.claude/`
> guardrails — the point is observing how they behave against a real feature, not
> going out of your way to test any particular rule.
>
> Once built, run `npm run lint`, `npx tsc -b`, `npm run test`, and `npm run build`
> yourself and capture the real results.
>
> **Then output a single structured summary** with these exact sections, so it can be
> pasted back into another session verbatim:
> 1. **Files created/changed** (list, in order)
> 2. **Full content of every new/changed file** under `src/` — the whole file, not
>    excerpts, each labeled with its path
> 3. **Hook behavior actually observed** — for each hook that fired (blocked or
>    warned), name it, what triggered it, and whether it was a correct block/warning
>    or a false positive. If literally nothing fired, say so explicitly and note
>    whether that's because nothing violated anything, or because you're unsure.
> 4. **Anything that should have been caught by a hook but wasn't**
> 5. **Rule/`CLAUDE.md`/`AGENTS.md` guidance gaps** encountered
> 6. **`npm run lint` / `tsc -b` / `npm run test` / `npm run build` results**, exact
>    output for any failure
> 7. **Assumptions made** — every judgment call and why

---

## PHASE C — back in this session, after the human returns with Phase B's output

### Step 5 — Write the report yourself, fully filled in

Copy `test-reports/TEMPLATE.md` to
`test-reports/tester-<N>-<short-feature-description>-<unix-timestamp>.md` (timestamp
via `date +%s` — protects against two people accidentally getting the same number).
Fill in every section using Phase B's pasted output directly — paste the full file
contents it gave you into "Generated code" verbatim, don't summarize them again.
Fill in "Assumptions made" from both phases' judgment calls.

### Step 6 — Commit and push the report, then clean up

```bash
git add test-reports/tester-<N>-<short-feature-description>-<timestamp>.md
git commit -m "test-report: tester <N> (<short feature description>)"
```

**Push with retries** — several people may be pushing around the same time:
```bash
for i in 1 2 3 4 5; do
  git pull --rebase && git push && break
  echo "Push attempt $i failed — retrying..."
  sleep $((RANDOM % 5 + 1))
done
```
If all 5 fail, note it in the report (already committed locally, just not pushed) and
move on — don't ask a question.

```bash
rm -rf /tmp/feature-test-<N>
```

Do not commit anything from `/tmp/feature-test-<N>` itself — only the report. Do not
touch `.claude/rules/`, `.claude/hooks/`, or any other repo file, even for a bug
you're confident about — describe it in the report; review and fixes happen
separately, after reports are collected.

### Step 7 — End with a short summary, not a question

Assignment number, pass/fail on lint/typecheck/test/build, whether the report pushed
successfully. Then stop.

---

## Round 2 — Theme Versioning Repeatability

This round reuses the exact same Phase A / Phase B / Phase C mechanics above, with
three specific differences. Everything not called out here (the 2-phase split,
"never ask, pick and document," the clone/install steps, the report-writing and
retry-push steps) works exactly the same way.

### Difference 1 — the feature task itself

Always the same underlying workflow (this is the point — repeating the same task is
what tests reliability, not variety):

> Given 3 designer-supplied brand color sets (make up 3 plausible, distinct
> palettes — **do not reuse palettes from any previous run**, invent genuinely new
> ones each time), create 3 theme candidates following this repo's documented
> naming convention, log all 3 in `THEME-LOG.json`, then promote one. Follow
> `.claude/rules/styling/shadcn/03-theme-versioning.md` exactly.
>
> Then output the same structured summary format as any other assignment (files
> changed, full file contents, hook behavior observed, anything a hook should have
> caught but didn't, rule gaps, verification results, assumptions made) — plus one
> extra section: **"Workflow steps followed, in order"** — a plain numbered list of
> exactly what you did (e.g. "1. Created file X. 2. Added log entry with status
> candidate. 3. ..."), so this can be compared line-by-line against other runs of
> this same task later.

### Difference 2 — report naming

Use `test-reports/tester-4-repeat-<run-number>-<unix-timestamp>.md`, where
`<run-number>` is 1, 2, 3, etc. — the next unused number for this repeat series
(check `test-reports/` for existing `tester-4-repeat-*` files and increment from
the highest one found; don't ask, just pick the next number).

### Difference 3 — how many repeats, and what happens after

Run this at least 5 times across separate sessions/testers before any comparison is
meaningful — a single repeat can't tell you anything about consistency. Each
individual run still gets written and pushed as its own report immediately, exactly
like any Round 1 assignment — don't wait for all 5 before pushing the first one.

Comparing the accumulated repeat reports against each other (not just reviewing
each one individually) happens separately, once enough have come in — that
comparison is what actually answers "is this workflow reliable," and isn't part of
this skill's own scope.

