# Styling Strategy — Choose One + Optional Add-Ons

## Step 1 — Pick your UI library (choose one, delete the other subfolder)

| Strategy | Files |
| --- | --- |
| **MUI (Material UI)** | `mui/01-mui-styling.md`, `mui/02-mui-usage.md` |
| **shadcn/ui + Tailwind** | `shadcn/01-tailwind-shadcn-styling.md` |

## Step 2 — Enable optional theming (shadcn/ui only, ask the user)

| Feature | File | Keep when | Delete when |
| --- | --- | --- | --- |
| Dark/light theme toggle | `shadcn/02-theming.md` | Project needs a theme switcher (light/dark/system) | Fixed theme only — no toggle needed |

`shadcn/02-theming.md` requires `next-themes` and only applies when shadcn/ui is chosen. Delete it if using MUI or if the project has no theme toggle.

## How to Switch

1. Delete the subfolder for the strategy you are NOT using.
2. Delete `shadcn/02-theming.md` if theme toggling is not needed.
3. In `CLAUDE.md`, update the Styling rows to point to the files you kept.
4. In `core/01-tech-stack.md`, update the UI Library entry to match your choice.
5. Update dependencies in `package.json` accordingly.

## Strategy Summaries

### MUI (Material UI) — `mui/`
- `styled()` API with Emotion
- All styles defined in `styles.ts` per component
- Theme tokens from `src/theme/theme.ts`
- Forbidden: `sx`, inline `style`, hardcoded values, Tailwind

### shadcn/ui + Tailwind — `shadcn/`
- Tailwind utility classes extracted into co-located `ComponentName.styles.ts` files
- `cva()` for variants, `cn()` for composition
- CSS variables for theming in `src/styles/globals.css`
- Forbidden: inline `style`, raw hex/rgb/rgba, `@apply`, component-scoped CSS
- Optional: `02-theming.md` — adds `next-themes` ThemeProvider + ThemeToggle component
