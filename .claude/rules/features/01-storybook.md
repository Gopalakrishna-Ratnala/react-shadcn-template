---
description: Storybook v8 — configuration contract, main.ts, preview.ts, required addons, router and theme decorators, story file contract. Active when Storybook is enabled.
paths: ["src/**/*.stories.tsx", "src/**/*.stories.ts", ".storybook/**/*.ts"]
---

# Storybook Rules

## Required Dependencies

```json
"@storybook/react": "^8.x",
"@storybook/react-vite": "^8.x",
"@storybook/addon-a11y": "^8.x",
"@storybook/blocks": "^8.x",
"storybook": "^8.x"
```

## Required Scripts in `package.json`

```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

## `.storybook/main.ts` Contract

MUST:
- Use `@storybook/react-vite` as the framework
- Include `@storybook/addon-a11y` in addons

```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
```

## `.storybook/preview.ts` Contract

MUST:
- Import global styles so resets and CSS variables are applied — `import "../src/styles/globals.css"`
- Wrap all stories with `MemoryRouter` via a decorator so any story containing `Link` or `useNavigate` does not crash
- Apply the `ThemeProvider` decorator if one is used in `App.tsx`

```ts
import type { Preview } from "@storybook/react";
import { MemoryRouter } from "react-router";
import "../src/styles/globals.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    a11y: { disable: false },
  },
};

export default preview;
```

## Story File Contract

When Storybook is enabled, components in `components/layout/`, `components/shared/`, and `components/animated/` MUST have a `ComponentName.stories.tsx` file. The following do NOT require stories:
- `components/ui/` (Vendored UI library primitives — never modified)
- Pages (`pages/`)
- Logic-only components with no visual UI (e.g. `ProtectedRoute`) — these use the reduced 4-file contract

- Export a `default` meta object with `title` and `component`
- Export at least one named story (`Default`, plus one per meaningful variant)
- Stories must not import raw style strings inline — always import from `ComponentName.styles.ts` (no raw Tailwind class strings)

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Click me" } };
export const Disabled: Story = { args: { children: "Disabled", disabled: true } };
```

## Component File Contract When Storybook Is Enabled

With Storybook: **6-file contract**

```text
component-name/
├── ComponentName.tsx
├── ComponentName.styles.ts
├── types.ts
├── ComponentName.stories.tsx   ← required when Storybook is enabled
├── ComponentName.test.tsx
└── index.ts
```

Without Storybook: **5-file contract** (no `.stories.tsx`)

```text
component-name/
├── ComponentName.tsx
├── ComponentName.styles.ts
├── types.ts
├── ComponentName.test.tsx
└── index.ts
```
