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
    files: ['**/*.{ts,tsx}'],
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
    // Two rules scoped to exclude src/components/ui/** (vendored shadcn CLI
    // output, never manually edited), so neither can introduce errors in
    // files we're not allowed to fix:
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
