# Testing Strategy — Choose One

**Enable only the file that matches your chosen test framework.**

| Strategy | File to keep | File to delete |
| --- | --- | --- |
| **Vitest + React Testing Library** (default) | `01-vitest-rtl.md` | — |
| **Jest + React Testing Library** | *(add when needed)* | `01-vitest-rtl.md` |

## How to Switch

1. Delete the file for the strategy you are NOT using.
2. In `CLAUDE.md`, update the Testing row in the conditionally-loaded rules table.
3. Update test dependencies in `package.json` and `vite.config.ts` / `jest.config.ts`.
