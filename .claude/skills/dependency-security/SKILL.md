---
name: dependency-security
description: Run a full npm audit, auto-fix what can be fixed, add package.json overrides for what cannot, and document everything. Blocks commits when vulnerabilities remain.
trigger: /dependency-security
---

# /dependency-security

Audit, fix, and document all npm vulnerabilities. **Zero vulnerabilities of any severity are permitted before a push.**

---

## Execution Steps

Run these steps in order. Do not skip any step.

### Step 1 — Audit

```bash
npm audit --json
```

Parse the JSON output. Extract:
- Total vulnerability count by severity (critical, high, moderate, low)
- Each vulnerability: package name, severity, via (dependency chain), fix available (yes/no/manual)

If output is `0 vulnerabilities found` → report clean and stop.

### Step 2 — Auto-fix

```bash
npm audit fix
```

Then re-run the audit:

```bash
npm audit --json
```

If now clean → report fixed packages, update the Overrides Log if any `--force` flag was needed, stop.

### Step 3 — Handle unfixable transitive deps

For each remaining vulnerability where auto-fix failed (typically transitive deps):

1. Identify the safe patched version of the vulnerable package.
2. Add an `"overrides"` entry in `package.json`:
   ```json
   "overrides": {
     "<package-name>": "<safe-version>"
   }
   ```
3. Run `npm install` to apply the override.
4. Re-run `npm audit --json` to confirm the override resolved it.

### Step 4 — Document overrides

For every override added, append a row to the Overrides Log in this file:

| Package | Pinned Version | Reason | Date Added | Safe to Remove When |
|---|---|---|---|---|

### Step 5 — Final confirmation

```bash
npm audit
```

Must report **0 vulnerabilities**. If any remain, do not proceed — report what is blocking and why it cannot be resolved automatically.

---

## Severity Policy

| Severity | Action |
|---|---|
| **Critical** | Block push immediately. Fix before any further work. |
| **High** | Block push. Fix before pushing. |
| **Moderate** | Block push. Fix before pushing. |
| **Low** | Block push. Fix before pushing. |

---

## Overrides Log

| Package | Pinned Version | Reason | Date Added | Safe to Remove When |
|---|---|---|---|---|
| *(none yet)* | | | | |
