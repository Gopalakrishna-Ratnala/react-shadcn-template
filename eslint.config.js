import js from '@eslint/js'
import globals from 'globals'
import importX from 'eslint-plugin-import-x'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    // src/components/ui/** (vendored shadcn CLI output, never manually
    // edited) is excluded from every rule below, not just import-x/order and
    // explicit-module-boundary-types - react-refresh/only-export-components
    // and react-hooks/set-state-in-effect (from the extends below) were
    // previously unscoped here, which only ever showed up as an accepted
    // "15 pre-existing errors" baseline in `npm run lint`'s full-repo scan.
    // That baseline was never actually harmless: lint-staged's `eslint --fix`
    // step runs the same rules against whatever's staged, and blocks on
    // these same errors the moment any ui/ file is staged - which happens
    // for real, expected reasons (e.g. `npx shadcn add <component>
    // --overwrite` to pick up an upstream fix), not just a one-off.
    //
    // This is a default for the untouched-vendor-file case, not a rule that
    // ui/ can never be edited - if a project genuinely needs a behavioral
    // patch to a specific ui/ file (not just re-theming, which never
    // requires touching ui/ - see CLAUDE.md's Divami Design System Rules),
    // remove that file's path from this ignores list (and from
    // .prettierignore) so it gets the same quality bar as the rest of the
    // codebase. This is a conscious per-file decision, not something a
    // static glob can infer automatically.
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/components/ui/**'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // Rules scoped to exclude src/components/ui/** the same way, so none of
    // them can introduce errors in files we're not allowed to fix:
    // - import-x/order: matches core/06-typescript.md's documented 5-group
    //   import convention exactly (React first, third-party, @/ internal,
    //   relative, type imports last within each group).
    // - explicit-module-boundary-types: requires an explicit return type on
    //   every exported function/hook, per core/06-typescript.md.
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/components/ui/**'],
    plugins: { 'import-x': importX, react: pluginReact },
    settings: {
      'import-x/resolver': { typescript: true },
    },
    rules: {
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          pathGroups: [{ pattern: 'react', group: 'external', position: 'before' }],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
])
