---
description: Tech stack and project bootstrap checklist — always loaded for every task.
---

# Tech Stack

Fill in your chosen library for each slot, then delete the strategy files you are not using.

- **Framework**: React 19.x (latest stable version)
- **Language**: TypeScript (strict mode)
- **UI Library**: shadcn/ui + Tailwind CSS v4 (Base UI backend) — see `styling/`
- **State Management**: [e.g. Zustand] — see `state-management/`
- **HTTP Client**: [e.g. Axios] — see `data-fetching/`
- **Forms**: [e.g. React Hook Form + Zod] — see `forms/`
- **Testing**: [e.g. Vitest + React Testing Library] — see `testing/`
- **Storybook**: v8.x with a11y addon *(optional — see `features/01-storybook.md`)*
- **Icons**: [e.g. `public/assets/icons/` (SVG sprites) or `lucide-react`] — see setup choices in `CLAUDE.md`

---

## Project Bootstrap Checklist (MANDATORY before first feature)

- **All required dependencies installed** — framework, UI library, state management, HTTP client, form library, testing libraries
  - If Storybook is enabled: also install `@storybook/react`, `@storybook/react-vite`, `@storybook/addon-a11y`, `@storybook/blocks`, `storybook`
- **Test framework configured** — test runner, testing library, coverage tool, jsdom, `vite.config.ts` test block, `src/test/setup.ts`
- **If Storybook is enabled** — install dependencies and configure `.storybook/main.ts` and `preview.ts` per `features/01-storybook.md`
- **Required scripts present in `package.json`**:
  ```json
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx",
  "format": "prettier --write .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
  ```
  If Storybook is enabled, also add:
  ```json
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
  ```
- **Global CSS reset compatible with chosen UI library** — remove all template styles from `index.css`; keep only box-sizing reset, `min-height: 100vh` on html/body/root, and font smoothing
- **Root providers wrap the app** — `App.tsx` must include your UI library's theme provider and global reset component before any UI renders
- **Environment config created** — create `src/config/env.ts` with `requireEnv()` validation and a typed `env` export; create `.env.example` with all required variable names and placeholder values; add `.env.local` to `.gitignore`
- **ALWAYS** verify `html`, `body`, and `#root` have `min-height: 100vh` and `width: 100%`
