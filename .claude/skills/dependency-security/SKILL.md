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
| `minimatch` | `^10.2.6` | `eslint@9.39.5` (direct) and `eslint-plugin-react@7.37.5` (transitive) both pinned `minimatch@3.1.5`/`^3.1.2`, which bundles a vulnerable `brace-expansion@<=1.1.16` (GHSA-mh99-v99m-4gvg, high, DoS via unbounded expansion). `npm audit fix --force` would have downgraded `eslint-plugin-react` to `7.22.0` (a real breaking change — that version predates the flat-config/rule support this repo relies on) or bumped `eslint` to `10.8.0` (major, unvalidated against this repo's flat config). A blind global `brace-expansion` override was tried first and rejected — it broke `eslint-plugin-react`'s `minimatch@3.1.5` at runtime (`TypeError: expand is not a function`), since `minimatch@3.x`'s code expects `brace-expansion`'s pre-2.x export shape. Overriding `minimatch` itself to `^10.2.6` (the same version already resolved cleanly elsewhere in this tree — `eslint-plugin-import-x`, `typescript-eslint`) sidesteps that incompatibility entirely, since `minimatch@10.x` ships its own compatible `brace-expansion@5.x` usage. Verified: `npm audit` → 0 vulnerabilities, `npm run lint` → same 15-error vendored-only baseline (no new errors), full suite (`tsc -b`, 65/65 tests, `npm run build`) unaffected. | 2026-07-28 | When `eslint` and `eslint-plugin-react` both ship a version that resolves `minimatch` to `>=10.2.6` (or any version with a patched `brace-expansion`) on their own — re-run `npm ls minimatch` after any future `eslint`/`eslint-plugin-react` upgrade to check whether the override is still needed. |
