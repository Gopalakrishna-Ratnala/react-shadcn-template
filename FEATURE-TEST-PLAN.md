# Feature Test Plan — Parallel Real-World Verification

> Purpose: everything validated so far in this repo's history (see
> `.claude/PROJECT-CONTEXT.md`) checks individual pieces in isolation — does this
> hook fire correctly on synthetic input, does the build succeed, do the unit tests
> pass. It does not check whether the `.claude/` guardrails (hooks + rules) actually
> behave correctly when someone builds a real, complete feature on top of this
> repo — which is the entire point of this system. This plan closes that gap using
> multiple parallel Claude Code sessions, each testing a different feature-building
> task, so results collectively cover every subsystem in the repo.

## How this works

1. **One person = one assignment = one Claude Code session**, working independently.
   Nobody edits the repo's own rules/hooks while testing — only after reports are
   collected and reviewed does anything actually get fixed.
2. There are **two rounds**, testing two different things:
   - **Round 1 (breadth)**: everyone builds a **different feature task** (see the
     assignment table in `.claude/skills/run-feature-test/SKILL.md`) — together, the
     six assignments exercise every rule file and every hook in `.claude/`, at least
     once each. This finds *where* the gaps are.
   - **Round 2 (repeatability)**: the theme-versioning workflow specifically gets
     repeated multiple times, by multiple different testers, doing the *same*
     underlying task each time (create 3 candidates, log them, promote one). This
     finds whether that workflow is *reliable*, not just whether it can pass once —
     which matters more for theming than any other subsystem, since a designer will
     use it constantly, every design round, for the entire lifetime of every real
     project built on this template. A single pass can't tell you that; several
     independent repeats can.
3. Each tester writes their findings into **their own report file** and pushes it to
   this repo — since everyone's report is a uniquely-named new file, not a shared
   one, concurrent pushes from multiple people should never actually conflict.
4. Reports get reviewed and validated afterward (in a separate session, working
   through the actual pasted code against the real rule files — not just trusting
   each report's self-assessment), and real fixes get made based on what's found.
   Round 2's reports additionally get compared *against each other*, not just
   reviewed individually — that comparison is what actually answers whether the
   theming workflow holds up under repeated use.

---

## Step 0 — Before you start (every tester)

**Clone somewhere OUTSIDE any cloud-synced folder** — not inside `~/Desktop`,
`~/Documents`, Dropbox, OneDrive, Google Drive, or anything similar. On Mac
specifically, `~/Desktop` and `~/Documents` are commonly synced by iCloud Drive,
which is a confirmed, real cause of `git`/filesystem commands mysteriously hanging
for minutes — not a repo bug, but it will waste your time and derail an otherwise
autonomous session. Use something like `~/dev`, `~/projects`, or `~/code` instead.

```bash
mkdir -p ~/dev && cd ~/dev
node --version   # note this down — you'll need Node >=22.22.1 (see package.json's engines field)
```

**Set up your local permissions override, once per machine** — this repo's
committed `.claude/settings.json` deliberately has no broad permission allow-list
(so real projects built from this template stay conservative by default). Without
it, Claude Code will prompt you to approve almost every individual command during
the skill's autonomous steps — which is friction the skill is specifically meant
to avoid, separate from the one intentional handoff in Step 2 below. Create
`.claude/settings.local.json` (personal, automatically gitignored — never
committed) with:

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(node:*)",
      "Bash(rm -rf /tmp/feature-test-*)",
      "Bash(date:*)",
      "Bash(sleep:*)"
    ],
    "deny": [
      "Bash(rm -rf /*)",
      "Bash(curl:*)",
      "Bash(wget:*)"
    ]
  }
}
```

This does this machine's user only — it never gets committed or affects anyone
else, and it doesn't change what's shipped to real client projects built from this
template. If you still get prompted for something not covered above, note the
exact command it asked about and add a matching rule — the goal is genuine
end-to-end autonomy for everything except the one deliberate handoff below.

## Step 1 — Run the skill

**For Round 1** (breadth), in a Claude Code session, say:

```
run feature test <your assigned number>
```

(or `run as tester <N>`). If you weren't given a number, just pick the lowest one
whose report doesn't already exist in `test-reports/`.

**For Round 2** (theming repeatability), say instead:

```
run the theming repeatability test
```

You don't need an assigned number for this — just run it, and the skill picks the
next unused repeat number for you. If you're asked to help with this round, running
it more than once yourself (as separate sessions) is genuinely useful — reliability
is exactly what's being tested, so more independent repeats is better, not
redundant.

The skill will clone the repo fresh, then hand you instructions to open a **second**
terminal/session — this is required by a real Claude Code platform limitation (hooks
only load from a session's startup directory), not something the skill can skip.
Follow those instructions exactly; paste the Phase B prompt it gives you into the new
session verbatim.

## Step 2 — Let it build, then bring the output back

Once the second session finishes and gives you its structured summary, copy the
**entire** output and paste it back into your first session. It will write and push
the report for you — you don't need to do this by hand.

## Step 3 — Done

The skill handles committing, pushing (with retries), and cleanup. When it finishes,
it'll tell you whether the push succeeded. If it didn't (network issue, etc.), your
report is still committed locally — let whoever's coordinating know.

---

## What happens after all reports are in

Every report gets reviewed against the actual pasted code — not just each report's
own self-assessment — the same way every other change in this repo has been
validated (see `.claude/PROJECT-CONTEXT.md` for that whole history). Real issues get
fixed: rule doc gaps get closed, hook false positives/negatives get corrected, and
anything a hook should have caught but didn't gets addressed directly.

**Round 2's reports get one extra step**: once at least 5 have come in, they're
compared *against each other*, not just reviewed individually — checking whether the
naming convention, log entries, hook behavior, and promotion outcome stayed
consistent across every independent run, or whether some ran into problems others
didn't. That comparison is what actually answers whether the theming workflow is
reliable, not just whether it can pass once.

The goal stated plainly: **run everything, fix everything genuinely flagged, and
only then is this boilerplate actually ready for real project use — particularly
for the design-system/theming workflow the designer will depend on constantly.**
