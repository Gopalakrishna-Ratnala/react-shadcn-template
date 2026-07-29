# AI Ready React Template

A React + shadcn/ui boilerplate built by Divami for a specific workflow: **a
designer prompts Claude directly to build the app** — no separate Figma-to-code
handoff, minimal developer review in between. The `.claude/rules/` and
`.claude/hooks/` in this repo exist to make that safe: they're the substitute
for the code review that would normally catch inconsistency, duplication, or a
badly-formed component before it ships.

## What's in this template

- **React 19 + TypeScript (strict) + Vite 8**
- **shadcn/ui + Tailwind CSS v4**, on the Base UI primitive backend
  (`components.json` → `"style": "base-nova"`) — composition uses Base UI's
  `render` prop, not Radix's `asChild`
- **Dark/light theming**, wired and working (`next-themes` + a `ThemeToggle`)
- **Theme candidate versioning** — designers can create multiple theme
  candidates, compare them via the local dev server, and promote whichever one
  a client approves, with every candidate (approved or rejected) permanently
  recorded — see `.claude/rules/styling/shadcn/03-theme-versioning.md`
- **A local mock API** via `json-server`, backed by `data/mockData/db.json`,
  with an axios-based `apiClient` (a single shared `axios.create()` instance)
- **A component tier system** (`ui/` → `layout/` → `blocks/` → `shared/` →
  feature-scoped `pages/*/components/`) with an explicit promotion rule, so a
  one-off component doesn't get force-promoted into a shared folder just
  because there's nowhere else for it to go
- **A components gallery** at `/components-gallery` — a living reference of
  every design token and shadcn/ui primitive in use, plus a Theme History view

## Getting started

Requires **Node.js >= 22.22.1**. Two files express this, deliberately for
different purposes:

- **`package.json`'s `engines` field** (`>=22.22.1`) — the *supported range*.
  This is a floor, not a pin: any Node `22.22.1` or newer satisfies it.
  `engine-strict=true` in `.npmrc` means `npm install` will hard-fail
  (`EBADENGINE`) on anything older — deliberate, so a version mismatch
  surfaces immediately instead of a confusing failure later.
- **`.nvmrc` / `.node-version`** (`22.22.1`) — the *recommended development
  version*, i.e. the known-good baseline every teammate starts from via
  `nvm use`. If your team later validates against a newer patch (e.g.
  `22.24.0`), bump these two files to match — while leaving `engines`'s
  `>=22.22.1` floor untouched unless there's an actual reason to raise the
  minimum supported version.

**Step 0 — get on the right Node version** (do this before `npm install`):

- If you use **nvm**:
  ```bash
  nvm install   # only needed the first time this version isn't installed yet
  nvm use       # reads .nvmrc automatically
  ```
- If you use **fnm**/**nodenv**: both also read `.nvmrc` (a `.node-version`
  file is included too, for tools that prefer that name) — run the
  equivalent `use`/`install` command for your tool.
- If you use **Volta**: install it once ([volta.sh](https://volta.sh)) and it
  auto-switches to the right Node version on every command in this repo with
  zero manual step — no `nvm use` to remember. Not required, just the
  lowest-friction option if you work across multiple Node-version projects.

```bash
npm install
npm run dev          # starts the app at http://localhost:5173
```

In a **second terminal**, start the local mock API (needed for anything that
calls `apiClient`):

```bash
npm run mock-api      # starts json-server at http://localhost:3001
```

Copy `.env.example` to `.env.local` if you need to change the mock API's port
or base URL.

**Also requires `jq`** to be installed and on `PATH` — every hook in
`.claude/hooks/` depends on it to parse Claude Code's tool-call JSON. Without
it, the hooks fail to run at all (found via a real test run on a machine
without `jq` — every hook now fails loudly and blocks if `jq` is missing,
rather than silently no-opping, but it's much simpler to just have it
installed):
- macOS: `brew install jq`
- Debian/Ubuntu: `apt-get install jq`
- Windows: `choco install jq` or `scoop install jq`

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run mock-api` | Start the local json-server mock API |
| `npm run build` | Typecheck, then build for production |
| `npm run preview` | Preview a production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format `src/**/*.{ts,tsx,css}` with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

A pre-commit hook (Husky + lint-staged) runs ESLint and Prettier automatically
on staged files before every commit.

## Where to look next

- **`CLAUDE.md`** / **`AGENTS.md`** — the rules Claude follows in this repo:
  tech stack decisions, component tiers, styling, data fetching, testing, and
  everything else that keeps generated code consistent
- **`.claude/rules/`** — the individual rule files referenced above, organized
  by topic
- **`docs/PROJECT-CONTEXT.md`** — running project history and decisions,
  meant to be read by Claude at the start of any new session working on this
  repo
- **`VERSIONS.md`** — version history for this template
