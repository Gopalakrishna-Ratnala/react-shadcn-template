---
description: Project folder structure, component contract, naming rules — always loaded for every task.
---

# Project Structure

Every React project MUST follow this exact structure:

```text
project-root/
├── public/
│   └── assets/
│       └── icons/                       # SVG icons only (kebab-case.svg)
│           ├── arrow-left.svg
│           ├── search.svg
│           └── close.svg
├── src/
│   ├── main.tsx                         # App entry point
│   ├── App.tsx                          # Root component with providers
│   │
│   ├── components/                      # Component tiers (see Component Tiers section)
│   │   ├── ui/                          # Vendored UI library primitives (shadcn/ui) — NEVER modified
│   │   │   ├── button.tsx               # Installed by shadcn CLI only
│   │   │   └── card.tsx                 # No custom stories or tests required here
│   │   │
│   │   ├── layout/                      # Structural wrappers — appear on every/most pages
│   │   │   ├── navbar/                  # Component folder (camelCase)
│   │   │   │   ├── Navbar.tsx           # Component (PascalCase)
│   │   │   │   ├── Navbar.styles.ts     # Component styles
│   │   │   │   ├── types.ts             # Component-specific types
│   │   │   │   ├── Navbar.test.tsx      # Tests
│   │   │   │   └── index.ts             # Barrel export
│   │   │
│   │   ├── shared/                      # Reusable domain components — used across pages
│   │   │   ├── productCard/             # Component folder (camelCase)
│   │   │   │   ├── ProductCard.tsx      # Component (PascalCase)
│   │   │   │   ├── ProductCard.styles.ts
│   │   │   │   ├── types.ts
│   │   │   │   ├── ProductCard.test.tsx
│   │   │   │   └── index.ts
│   │   │
│   │   ├── blocks/                      # Generic composite UI patterns — assembled from ui/ primitives,
│   │   │   │                            # carry no domain/business data (see Component Tiers section)
│   │   │   ├── statCard/                # Component folder (camelCase)
│   │   │   │   ├── StatCard.tsx         # Component (PascalCase)
│   │   │   │   ├── StatCard.styles.ts
│   │   │   │   ├── types.ts
│   │   │   │   ├── StatCard.test.tsx
│   │   │   │   └── index.ts
│   │   │
│   │   └── animated/                    # [OPTIONAL] Reusable animation wrappers — only if animation feature is enabled
│   │       ├── fadeIn/                  # One folder per wrapper (camelCase)
│   │       │   ├── FadeIn.tsx
│   │       │   ├── FadeIn.styles.ts
│   │       │   ├── types.ts
│   │       │   ├── FadeIn.test.tsx
│   │       │   └── index.ts
│   │       └── index.ts                 # Barrel export for all animated components
│   │
│   ├── pages/                           # Route-level screens
│   │   ├── home/                        # Page folder (camelCase)
│   │   │   ├── HomePage.tsx             # Page component (PascalCase + Page suffix)
│   │   │   ├── HomePage.styles.ts       # Page-specific styles (ComponentName.styles.ts)
│   │   │   ├── types.ts                 # Page-specific types
│   │   │   ├── HomePage.schema.ts       # Form validation schema (required only when page has a form)
│   │   │   ├── HomePage.test.tsx        # Page tests (NO stories required)
│   │   │   ├── components/              # [ONLY when needed] Feature-scoped components used
│   │   │   │   │                        # ONLY by this page — see Component Tiers section
│   │   │   │   └── homeHeroBanner/
│   │   │   │       ├── HomeHeroBanner.tsx
│   │   │   │       ├── HomeHeroBanner.styles.ts
│   │   │   │       ├── types.ts
│   │   │   │       ├── HomeHeroBanner.test.tsx
│   │   │   │       └── index.ts
│   │   │   └── index.ts                 # Barrel export
│   │
│   ├── hooks/                           # Custom React hooks
│   │   ├── useAuth.ts                   # Hook (use + PascalCase)
│   │   ├── useAuth.test.ts              # Hook test (REQUIRED — every hook needs one)
│   │   └── index.ts                     # Barrel export
│   │
│   ├── store/                           # State management stores
│   │   ├── auth/                        # Store domain (camelCase)
│   │   │   ├── authStore.ts             # Store definition (domainStore.ts)
│   │   │   ├── types.ts                 # State & action types
│   │   │   └── index.ts                 # Barrel export
│   │   └── index.ts                     # Root barrel export
│   │
│   ├── services/                        # API clients and data access
│   │   ├── apiClient.ts                 # Central HTTP client instance
│   │   ├── auth/                        # Service domain (camelCase)
│   │   │   ├── authService.ts           # Service methods (domainService.ts)
│   │   │   ├── types.ts                 # API DTOs (backend contracts)
│   │   │   └── index.ts                 # Barrel export
│   │   ├── mappers/                     # DTO → Domain model transformations
│   │   │   ├── authMapper.ts            # domainMapper.ts
│   │   │   └── productMapper.ts
│   │   └── index.ts                     # Root barrel export
│   │
│   ├── lib/                             # Pure framework-agnostic helpers
│   │   └── utils.ts                     # Pure utilities; cn() helper for shadcn/Tailwind projects
│   │
│   ├── utils/                           # Pure helper functions
│   │   ├── validators.ts                # Validation helpers
│   │   └── index.ts                     # Barrel export
│   │
│   ├── types/                           # Shared domain types
│   │   ├── common.types.ts              # Common types (Status, SortOrder, ApiResponse<T>)
│   │   └── index.ts                     # Barrel export
│   │
│   ├── constants/                       # Application constants
│   │   ├── routes.constants.ts          # Route paths (ROUTES object)
│   │   ├── api.constants.ts             # API endpoint paths (API_ENDPOINTS object)
│   │   ├── validation.constants.ts      # Validation rules (MAX_FILE_SIZE, etc.)
│   │   └── index.ts                     # Barrel export
│   │
│   ├── config/                          # App configuration
│   │   ├── env.ts                       # Typed environment variable access and startup validation
│   │   └── routes.tsx                   # React Router config (lazy + Suspense only)
│   │
│   └── styles/                          # Global styles
│       └── globals.css                  # Global CSS (typography, resets, CSS variable definitions)
│
├── .env.example                         # Environment variables template
├── .eslintrc.cjs                        # ESLint configuration
├── .prettierrc                          # Prettier configuration
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite bundler configuration
└── package.json                         # Dependencies and scripts
```

---

## Component Tiers

`src/components/` is split into tiers, plus one feature-scoped location inside `pages/`.
Place every component in the correct tier before writing any code.

| Tier | Folder | What belongs here | Carries domain data? | Examples |
| --- | --- | --- | --- | --- |
| **Primitives** | `components/ui/` | Vendored UI library primitives (shadcn/ui: installed by CLI) — never manually edited | No | `Button`, `Card`, `Input`, `Dialog` |
| **Layout** | `components/layout/` | Structural wrappers that frame every or most pages — contain no business data | No | `Navbar`, `Footer`, `Sidebar`, `PageWrapper` |
| **Blocks** | `components/blocks/` | Generic composite UI patterns assembled from `ui/` primitives — reusable across *any* project, regardless of domain | **No** — props are generic (`title`, `value`, `icon`), never app-specific entities | `StatCard`, `FilterBar`, `PageHeader`, `StatusBadge` |
| **Shared** | `components/shared/` | Reusable components specific to *this app's* domain — used by two or more pages/features | **Yes** — props are or reference actual domain entities | `ProductCard`, `CategoryFilter`, `OrderSummary`, `JobCard` |
| **Feature-scoped** | `pages/{page}/components/` | Components used by exactly **one** page/feature — not reusable (yet) | Either | `HomeHeroBanner` (only `pages/home/` ever needs it) |
| **Animated** *(optional)* | `components/animated/` | Reusable animation wrapper components — only create this tier if the animation feature is enabled (see `features/04-animated-components.md`) | No | `FadeIn`, `SlideUp`, `ScaleIn` |

**Decision rule — walk this in order, stop at the first match:**
1. Is it a vendored UI library primitive (shadcn/ui)? → `ui/`
2. Does it frame the page structure with no business data? → `layout/`
3. Is it a reusable animation wrapper with no business logic? → `animated/` *(only if feature enabled — ask user first)*
4. Is it used by **exactly one** page/feature right now, with no known plan to reuse it elsewhere? → `pages/{page}/components/` (feature-scoped)
5. Does it carry no domain-specific data — generic props only (a title, a value, an icon), not references to this app's actual entities? → `blocks/`
6. Otherwise (reusable across pages/features AND tied to this app's domain) → `shared/`

**The `blocks/` vs `shared/` distinction, precisely:** both are reusable across the app,
but `blocks/` components would work unmodified if copy-pasted into a *completely
different project* (their props are generic — `title: string`, `value: number`). If a
component's props reference this app's actual domain types (`Product`, `Order`, `Job`,
etc.), it belongs in `shared/` even if it's visually similar to something in `blocks/`.

## Promotion Rule — the mechanism that prevents duplication

A feature-scoped component (`pages/{page}/components/`) starts out non-reusable by
definition. The moment a **second** page or feature needs the same thing, it MUST be
**promoted**, never duplicated:

1. **Never copy-paste** a feature-scoped component into a second page's `components/`
   folder, even to "just tweak it slightly." Two near-identical components in two
   different `pages/*/components/` folders is exactly the duplication this rule exists
   to prevent — `check-component-duplicate.sh` will flag this, but don't rely on the
   hook alone; check first.
2. Before writing a new component, always check whether an existing one already covers
   the need — search `shared/`, `blocks/`, and any other page's `components/` folder for
   something close. If something close exists but needs a small variation, extend it
   (e.g. a new prop or variant) rather than forking it.
3. To promote: move the component's folder from `pages/{page}/components/{name}/` to
   `components/shared/{name}/` (or `components/blocks/{name}/` if it turns out to carry
   no domain data after all) as its own atomic step. Update the barrel exports in both
   locations. Update every import site. Do not leave a duplicate or a re-export shim
   behind in the old location.
4. If a component is used by exactly one page today but the prompt/discussion makes
   clear it's intended for reuse soon (e.g. "we'll need this same card on the dashboard
   too"), place it directly in `shared/` or `blocks/` from the start — don't force an
   unnecessary feature-scoped detour when reuse is already known.

**Pages never own components directly inline or long-term** — a page's own
`components/` folder is only ever a holding area for things not yet proven reusable,
governed by the promotion rule above. It is never a place to permanently stash something
just to avoid the promotion decision.

## Component Contract

`ui/` components are vendored — no stories or tests required.
`layout/`, `shared/`, `blocks/`, `animated/`, and feature-scoped (`pages/{page}/components/`)
components all follow the same **5-file contract** — Storybook is fixed OFF for
this template (confirmed via real feature-test runs, see `features/README.md`),
so no `.stories.tsx` is ever required.

```text
component-name/
├── ComponentName.tsx
├── ComponentName.styles.ts
├── types.ts
├── ComponentName.test.tsx
└── index.ts
```

**Exception — logic-only components** (e.g. `ProtectedRoute`) have no visual UI and use a **4-file contract**: `ComponentName.tsx`, `types.ts`, `ComponentName.test.tsx`, `index.ts` — no `.styles.ts`.

**Missing any required file = incomplete component**

### Required page structure

```text
page-name/
├── PageName.tsx
├── PageName.styles.ts
├── types.ts
├── PageName.schema.ts        ← required only when the page has a form
├── PageName.test.tsx
├── components/               ← [OPTIONAL] feature-scoped components used ONLY by
│   └── someThing/            #   this page (see Component Tiers → Promotion Rule);
│       ├── SomeThing.tsx     #   each follows the same file contract as any other tier
│       ├── SomeThing.styles.ts
│       ├── types.ts
│       ├── SomeThing.test.tsx
│       └── index.ts
└── index.ts
```

### Required hook structure

Every hook MUST have a co-located test file. Missing test = incomplete hook.

```text
hooks/
├── useFeatureName.ts
├── useFeatureName.test.ts    ← REQUIRED for every hook
└── index.ts
```

---

## Naming Rules

- Folders: `camelCase`
- Components: `PascalCase.tsx`
- Tests: `ComponentName.test.tsx`
- Types: `types.ts`
- Styles: `ComponentName.styles.ts` (co-located, named after the component)
- Variables and Functions: `camelCase`
- Constants: CONSTANT_CASE for constant values.

### Naming Intent Rule

Names must reflect:

- Business intent
- Responsibility
- Behavior

**Page and component folders/files MUST be named after their business purpose, never generic labels.**

- ❌ `pages/home/HomePage.tsx` for a job listing page
- ✅ `pages/jobDirectory/JobDirectoryPage.tsx`
- ❌ `components/shared/card/Card.tsx` for a job posting card
- ✅ `components/shared/jobCard/JobCard.tsx`

Derive the name from the feature's business purpose as described in the prompt or discussion with the designer/PO. Never default to "home", "main", "page1", or other generic placeholders.

---

### ApiResponse\<T\> — Required Core Type

`ApiResponse<T>` MUST be defined in `src/types/common.types.ts` in every project regardless of which data-fetching strategy is chosen:

```ts
// src/types/common.types.ts
export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
  error?: string;
}
```

- Every service method MUST return a value typed as `ApiResponse<T>`
- The calling hook unwraps `.data` before storing in state
- Returning the raw domain model directly from a service is **forbidden**
- The full mock/mapper/DTO pattern built on top of this type is documented in `data-fetching/03-data-layer.md` (optional feature)
