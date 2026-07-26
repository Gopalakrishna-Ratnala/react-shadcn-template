# Version History

All tags follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

| Tag | Branch / Commit | Date | Description |
|-----|----------------|------|-------------|
| `v0.0.0` | `main` @ `5cafcb7` | 2026-06-08 | Initial template baseline — rules, hooks, and scaffold only; no feature code |
| `v0.1.0` | `feature/web-backend-react` @ `9ccaf1d` | 2026-06-08 | Modularized `.claude/rules/` into strategy subfolders (`core/`, `styling/`, `forms/`, `state-management/`, `data-fetching/`, `testing/`, `features/`); added 14 core rule files (error handling, performance, routing, environment, security); added shadcn/ui + Tailwind, Redux Toolkit, Yup, API service, data layer, Storybook, i18n, notifications, and animation strategy files; expanded hooks (`check-barrel-exports.sh`, `check-no-inline-classnames.sh`); overhauled `CLAUDE.md` and `AGENTS.md` with full modular strategy tables; cleaned up `src/` scaffold (removed demo assets, added barrel `index.ts` files and `.gitkeep` placeholders, added `src/lib/utils.ts`) |
| `v0.2.0` | `main` @ `244a799` | 2026-07-26 | Committed the styling strategy to shadcn/ui only — removed MUI's rules, hooks, and scaffold entirely; refreshed the shadcn rules against current official docs (Base UI `render` prop, chart/sidebar tokens, corrected theming claims). Replaced the never-installed Axios plan with a real fetch-based `apiClient` + `json-server` local mock backend (`db.json`, `.env.example`, `src/config/env.ts`). Rewrote the component tier system (`core/02-project-structure.md`) to add `blocks/` and a feature-scoped `pages/*/components/` tier with an explicit promotion rule. Fixed three hooks that warned via stderr and were silently discarded by Claude Code on `exit 0` (`check-barrel-exports.sh`, `check-component-duplicate.sh`, `check-no-inline-classnames.sh`), plus two more gaps the tier-system work surfaced (`check-component-duplicate.sh` never covered `blocks/`; `check-barrel-exports.sh` misfired on vendored `ui/` files). Built the theme candidate versioning system (`src/styles/themes/history/`, `THEME-LOG.json`, `styling/shadcn/03-theme-versioning.md`, `check-theme-log-entry.sh`). Wired up Tailwind + an active `theme.css` for the first time (never actually connected in the baseline). Rebuilt the components gallery page from scratch at `/components-gallery` (`ErrorBoundary`, real routing, 6 sections including a live Theme History view). Wired real dark/light theme support (`ThemeProvider`, `Toaster`, `ThemeToggle`) and resolved the icon-source decision to `lucide-react`. Added Husky + lint-staged pre-commit enforcement and an explicit `engines.node` field. Performed a full git-history housekeeping pass — reset `main` to a clean, validated trunk; preserved all prior exploratory work on `reference/research-exploration` |

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
