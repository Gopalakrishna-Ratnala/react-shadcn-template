# Optional Features — Include or Exclude at Project Setup

These rules cover features that may or may not be needed in every project. During setup, ask the user whether each feature is required. **Delete the file for any feature that is not needed.**

Unlike strategy folders (where you pick one option), these features are purely additive — a project can include any combination of them or none at all.

| Feature | File | Keep when | Delete when |
|---|---|---|---|
| Storybook component docs | `01-storybook.md` | Project needs a component documentation/visual testing setup | No component docs needed; skip `.stories.tsx` files and Storybook scripts |
| Toast notifications | `02-notifications.md` | Project surfaces async feedback via toasts | No user-facing toast notifications needed |
| Internationalization (i18n) | `03-internationalization.md` | Project supports multiple languages | Project supports only one language |
| Animation wrappers | `04-animated-components.md` | Project uses reusable entrance/exit animations | No reusable animation patterns needed |

## Component Contract Impact

| Storybook enabled | Contract | Files required |
|---|---|---|
| Yes | 6-file | `.tsx`, `.styles.ts`, `types.ts`, `.stories.tsx`, `.test.tsx`, `index.ts` |
| No | 5-file | `.tsx`, `.styles.ts`, `types.ts`, `.test.tsx`, `index.ts` |

Logic-only components (e.g. `ProtectedRoute`) always use a 4-file contract regardless: `.tsx`, `types.ts`, `.test.tsx`, `index.ts`.

## How to Enable / Disable

1. At project setup, ask the user about each feature (see setup questions in `CLAUDE.md`)
2. Delete the `.md` files for features the project does not need
3. Update `CLAUDE.md` to remove references to deleted files from the task map
4. If Storybook is disabled: do not create `.storybook/`, skip `.stories.tsx` in all component folders, omit Storybook scripts from `package.json`
5. If animation wrappers are disabled: do not create `src/components/animated/`
