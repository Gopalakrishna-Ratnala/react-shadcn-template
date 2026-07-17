# State Management Strategy — Choose One

**Enable only the file that matches your chosen state management library.**

| Strategy | File to keep | File to delete |
| --- | --- | --- |
| **Zustand** (default) | `01-zustand.md` | `02-redux-toolkit.md` |
| **Redux Toolkit** | `02-redux-toolkit.md` | `01-zustand.md` |

## How to Switch

1. Delete the file for the strategy you are NOT using.
2. In `CLAUDE.md`, update the State Management row in the conditionally-loaded rules table.
3. Update the dependency in `package.json`.
4. Replace or remove `src/store/` contents to match the new library's patterns.
