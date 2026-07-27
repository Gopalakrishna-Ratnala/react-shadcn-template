---
description: Tech stack and project bootstrap checklist — always loaded for every task.
---

# Tech Stack

Fill in your chosen library for each slot, then delete the strategy files you are not using.

- **Framework**: React 19.x (latest stable version)
- **Language**: TypeScript (strict mode)
- **UI Library**: shadcn/ui + Tailwind CSS v4 (Base UI backend) — see `styling/`
- **State Management**: Zustand — fixed for this template, see `state-management/`
- **HTTP Client**: Fetch-based `apiClient` + json-server as the local mock backend — fixed for this template, see `data-fetching/`
- **Forms**: React Hook Form + Zod — fixed for this template, see `forms/`
- **Testing**: Vitest + React Testing Library — installed and configured (see `testing/`)
- **Storybook**: fixed OFF for this template — see `features/README.md`
- **Icons**: `lucide-react` — already installed, fixed for this template

---

## Project Bootstrap Checklist (MANDATORY before first feature)

- **All required dependencies installed** — framework, UI library, state management, HTTP client, form library, testing libraries
- **Test framework configured** — test runner, testing library, coverage tool, jsdom, `vite.config.ts` test block, `src/test/setup.ts`
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
- **Global CSS reset compatible with chosen UI library** — remove all template styles from `index.css`; keep only box-sizing reset, `min-height: 100vh` on html/body/root, and font smoothing
- **Root providers wrap the app** — `App.tsx` must include your UI library's theme provider and global reset component before any UI renders
- **Environment config created** — create `src/config/env.ts` with `requireEnv()` validation and a typed `env` export; create `.env.example` with all required variable names and placeholder values; add `.env.local` to `.gitignore`
- **ALWAYS** verify `html`, `body`, and `#root` have `min-height: 100vh` and `width: 100%`
