export default {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    // Ignores the staged filenames lint-staged would otherwise append -
    // `tsc -b` type-checks the whole project graph (project references),
    // it can't be scoped to a subset of files. Safe to run on every commit
    // touching .ts/.tsx: `tsconfig.app.json` sets `noEmit: true`, so this is
    // a pure type-check with no build-artifact side effects.
    () => "tsc -b",
  ],
  "*.css": ["prettier --write"],
};
