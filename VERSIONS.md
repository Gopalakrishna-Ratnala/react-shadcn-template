# Version History

All tags follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

| Tag | Branch / Commit | Date | Description |
|-----|----------------|------|-------------|
| `v0.0.0` | `main` @ `5cafcb7` | 2026-06-08 | Initial template baseline — rules, hooks, and scaffold only; no feature code |
| `v0.1.0` | `feature/web-backend-react` @ `9ccaf1d` | 2026-06-08 | Modularized `.claude/rules/` into strategy subfolders (`core/`, `styling/`, `forms/`, `state-management/`, `data-fetching/`, `testing/`, `features/`); added 14 core rule files (error handling, performance, routing, environment, security); added shadcn/ui + Tailwind, Redux Toolkit, Yup, API service, data layer, Storybook, i18n, notifications, and animation strategy files; expanded hooks (`check-barrel-exports.sh`, `check-no-inline-classnames.sh`); overhauled `CLAUDE.md` and `AGENTS.md` with full modular strategy tables; cleaned up `src/` scaffold (removed demo assets, added barrel `index.ts` files and `.gitkeep` placeholders, added `src/lib/utils.ts`) |

---

## How to Add a New Version

1. Merge your branch into `main`
2. Create an annotated tag on `main`:
   ```bash
   git checkout main
   git tag -a v<MAJOR>.<MINOR>.<PATCH> -m "Short description of this release"
   git push origin v<MAJOR>.<MINOR>.<PATCH>
   ```
3. Add a row to the table above with the tag, source commit/branch, date, and description.
4. Commit and push `VERSIONS.md`.
