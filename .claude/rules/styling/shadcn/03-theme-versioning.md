---
description: Theme candidate versioning — creating, logging, comparing, and promoting designer-supplied theme candidates. Loaded when working with theme files or asked to create/compare/apply a theme.
paths: ["src/styles/themes/**/*.css", "src/styles/themes/**/*.json"]
---

# Theme Candidate Versioning

## Why this exists

Designers arrive with specific color/token values already decided (their own design
sense, or values from an external tool) and need Claude to *apply* them correctly. The
same client will often see multiple candidate themes before picking one, and this same
process repeats for later feature work too — not just once at initial design. This file
governs how candidates are created, tracked, compared, and promoted so that history is
never silently lost and the app only ever has one active theme at runtime.

## Directory structure

```text
src/styles/themes/
├── theme.css              # ALWAYS the one active theme — this is what src/index.css
│                          #   actually imports. Never edit this directly to "try" a
│                          #   candidate — see Creating a candidate, below.
├── theme-template.css     # Blank starter template — unchanged, not a live theme
└── history/
    ├── THEME-LOG.json     # Structured record of every candidate ever made
    └── YYYY-MM-DD_<round-or-feature-slug>_v<N>-<short-descriptor>.css
```

## Naming convention

`YYYY-MM-DD_<round-or-feature-slug>_v<N>-<short-descriptor>.css`

- `YYYY-MM-DD` — the date the candidate was created
- `<round-or-feature-slug>` — `initial-design` for the first design round, or a
  feature name (e.g. `reporting-dashboard`) for later feature-specific rounds
- `v<N>` — sequential within that round/feature, starting at `v1`
- `<short-descriptor>` — a few kebab-case words capturing the candidate's character
  (e.g. `navy-corporate`, `warm-earth`, `bold-tech`)

Example: `2026-07-24_initial-design_v3-bold-tech.css`

## THEME-LOG.json schema

An array of objects, one per candidate, in creation order:

```json
{
  "date": "2026-07-24",
  "round": "initial-design",
  "file": "2026-07-24_initial-design_v3-bold-tech.css",
  "status": "approved",
  "notes": "Client preferred stronger accent contrast over v1/v2"
}
```

- `status` — always one of `"candidate"` | `"rejected"` | `"approved"`. Never any other
  value.
- Exactly one entry may have `"status": "approved"` **per round/feature** — approving a
  new one means updating the previous approved entry for that same round to
  `"rejected"` first (a round can only have one final answer).
- `notes` — free text; capture *why* a decision was made, not just what changed. This
  is the actual record of client feedback across rounds — don't leave it empty.

## Creating a candidate

1. Take the designer-supplied values (colors, and any other tokens they specify) and
   fill them into a **full copy of `theme-template.css`** (every variable filled, none
   renamed, none deleted — matching `theme-template.css`'s own documented rules) —
   don't hand-write a partial file. `check-theme-log-entry.sh` automatically checks
   this: it diffs every candidate file against `theme-template.css`'s own token list
   and warns, listing exactly which tokens are missing, if any weren't filled in.
2. Save it under `history/` using the naming convention above.
3. Append a new entry to `THEME-LOG.json` with `"status": "candidate"`.
4. **Never edit `theme.css` directly to preview a candidate.** To preview one locally,
   temporarily copy the candidate's contents over `theme.css` for local viewing only —
   or, if asked to make it easy to flip between several candidates during one review
   session, ask the user first before adding any preview-switching mechanism (this is a
   deliberate architectural choice, not a default — see `docs/PROJECT-CONTEXT.md`'s Section 4
   for the (a)/(b)/(c) discussion already had on this).

## Comparing candidates

When asked to compare candidates or help a client choose, list the relevant entries
from `THEME-LOG.json` (filter by `round` if asked about a specific round) and describe
the actual token differences between them (primary color, radius, font, etc.) — don't
just say "they're different," name the specific values that changed.

## Promoting a candidate

The moment one candidate is chosen:

1. Copy the winning candidate file's contents **verbatim** into `theme.css` — this is
   the only thing that changes what the running app actually looks like.
2. Update that candidate's `THEME-LOG.json` entry to `"status": "approved"`.
3. If another candidate in the same round was previously `"approved"`, change it to
   `"rejected"` first (only one approved entry per round).
4. **Never delete the candidate file itself** — it stays in `history/` permanently as
   the record, even after promotion. Only the user manually deletes files from
   `history/`, and only deliberately (see Rejected candidates, below).

## Rejected candidates

- Mark a rejected candidate's `THEME-LOG.json` entry `"status": "rejected"` — never
  delete the entry or the file automatically.
- Deletion of `history/` files is a manual, user-initiated action only. Do not suggest
  or perform cleanup of `history/` as part of routine work — an empty-looking or
  seemingly-redundant `history/` folder is not dead code; it is intentional archive.
- This means `check-component-duplicate.sh` and any dead-code/unused-file checks must
  never flag anything under `src/styles/themes/history/`.

## What never changes regardless of how many candidates exist

- The app only ever has **one active theme at runtime** — `theme.css`. This file's
  purpose is version history and review workflow, not a runtime multi-theme switcher.
  If a future project genuinely needs multiple themes active simultaneously (not just
  during a review/comparison phase), that's a distinct, larger architectural decision —
  see `docs/PROJECT-CONTEXT.md` Section 4 for the (a)/(b)/(c) options already discussed, and
  ask the user before building anything like that.
