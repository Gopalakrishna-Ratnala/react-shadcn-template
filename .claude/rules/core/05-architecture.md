---
description: Architecture — separation of concerns, directory intent for components/pages/store/services/hooks/utils. Always loaded.
---

# Architecture and Directory Rules

## Mandatory Separation of Concerns

**This separation is REQUIRED.**

- **Components** = up to four tiers: `ui/` (vendored UI library primitives — shadcn/ui only), `layout/` (page-framing wrappers), `shared/` (all custom components), `animated/` *(optional — only when animation feature is enabled)* — pages never own components
- **Pages** = screen composition only
- **Store** = client state only
- **Services** = API and external data access only
- **Mappers** = transformation of external data into app-safe typed models
- **Hooks** = reusable UI/state orchestration only
- **Utils** = pure reusable helpers only
- **Lib** = pure framework-agnostic utilities (e.g. `cn()` for shadcn/Tailwind projects)
- **Config** = application configuration — route definitions and typed environment variable access

## Directory Intent

| Directory         | Purpose                                              | Rules                                                                                 |
| ----------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/components/ui/` | Vendored UI library primitives (shadcn/ui) — never modified | Installed by CLI only. No custom stories or tests required. |
| `src/components/layout/` | Structural wrappers that appear on every/most pages | No business data. 5-file contract (fixed, no Storybook). |
| `src/components/shared/` | All custom app components — single-page or multi-page | Pages compose from here. 5-file contract (fixed, no Storybook). |
| `src/components/animated/` | Reusable animation wrappers *(optional — only if animation feature is enabled)* | No business logic. 5-file contract (fixed, no Storybook). See `features/04-animated-components.md`. |
| `src/services/`   | HTTP clients, API methods                            | No JSX, no UI logic                                                                   |
| `src/store/`      | State management stores                              | No JSX, no direct API wiring in components                                            |
| `src/hooks/`      | Reusable hooks                                       | Compose store, services, router, forms                                                |
| `src/types/`      | Shared domain and API types                          | No runtime logic                                                                      |
| `src/utils/`      | Pure helpers                                         | No framework coupling unless utility-specific                                         |
| `src/lib/`        | Pure framework-agnostic helpers                      | `utils.ts` holds `cn()` *(shadcn/Tailwind)* or other pure utilities. No React imports. |
| `src/pages/`      | Screens                                              | Keep thin, compose features                                                           |
| `src/config/`     | Route definitions + typed environment access         | `routes.tsx`: lazy + Suspense only, no logic beyond route wiring. `env.ts`: typed `import.meta.env` access and startup validation only. No className strings. No stories or tests required. |
