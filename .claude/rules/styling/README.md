# Styling Strategy — shadcn/ui + Tailwind

This project uses **shadcn/ui + Tailwind CSS** as its UI library, on the **Base UI** primitive backend (`components.json` → `"style": "base-nova"`). This is fixed for this template — there is no MUI or other UI library option.

| Strategy | Files |
| --- | --- |
| **shadcn/ui + Tailwind** | `shadcn/01-tailwind-shadcn-styling.md` |

## Optional theming (ask the user)

| Feature | File | Keep when | Delete when |
| --- | --- | --- | --- |
| Dark/light theme toggle | `shadcn/02-theming.md` | Project needs a theme switcher (light/dark/system) | Fixed theme only — no toggle needed |

`shadcn/02-theming.md` requires `next-themes`. Delete it if the project has no theme toggle.

## Theme candidate versioning — always active, not optional

`shadcn/03-theme-versioning.md` governs how designer-supplied theme candidates get
created, logged, compared, and promoted (`src/styles/themes/history/` +
`THEME-LOG.json`). This applies to every project using this template — designers always
arrive with their own values to apply, and the same round of client review repeats for
later feature work too.

## Strategy Summary

### shadcn/ui + Tailwind — `shadcn/`
- Tailwind utility classes extracted into co-located `ComponentName.styles.ts` files
- `cva()` for variants, `cn()` for composition
- CSS variables for theming in the project's theme file (`src/styles/themes/theme.css` here)
- Forbidden: inline `style`, raw hex/rgb/rgba, `@apply`, component-scoped CSS
- Composition via Base UI's `render` prop, not Radix's `asChild` — see `01-tailwind-shadcn-styling.md`
- Optional: `02-theming.md` — adds `next-themes` ThemeProvider + ThemeToggle component
