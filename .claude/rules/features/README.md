# Optional Features — Include or Exclude at Project Setup

These rules cover features that may or may not be needed in every project. During setup, ask the user whether each feature is required. **Delete the file for any feature that is not needed.**

Unlike strategy folders (where you pick one option), these features are purely additive — a project can include any combination of them or none at all.

**Storybook is fixed OFF for this template** — confirmed via two independent real feature-test runs, both landing on the 5-file component contract with no `.stories.tsx` anywhere, matching this template's own existing components. `features/01-storybook.md` has been removed. If a future project genuinely needs Storybook, that's a deliberate decision to make explicitly with the user, not a default to re-enable.

| Feature | File | Keep when | Delete when |
|---|---|---|---|
| Toast notifications | `02-notifications.md` | Project surfaces async feedback via toasts | No user-facing toast notifications needed |
| Internationalization (i18n) | `03-internationalization.md` | Project supports multiple languages | Project supports only one language |
| Animation wrappers | `04-animated-components.md` | Project uses reusable entrance/exit animations | No reusable animation patterns needed |

## Component Contract

This template uses the **5-file contract**, fixed (no Storybook): `.tsx`, `.styles.ts`, `types.ts`, `.test.tsx`, `index.ts`.

Logic-only components (e.g. `ProtectedRoute`) always use a 4-file contract regardless: `.tsx`, `types.ts`, `.test.tsx`, `index.ts`.

## How to Enable / Disable (remaining optional features)

1. At project setup, ask the user about each remaining feature above (see setup questions in `CLAUDE.md`)
2. Delete the `.md` files for features the project does not need
3. Update `CLAUDE.md` to remove references to deleted files from the task map
4. If animation wrappers are disabled: do not create `src/components/animated/`
