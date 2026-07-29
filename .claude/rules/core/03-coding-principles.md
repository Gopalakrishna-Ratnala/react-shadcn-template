---
description: Core coding principles and non-negotiable rules — always loaded for every task.
---

# Coding Principles

## General Coding Guidelines

- Follow clean code principles.
- Use meaningful variable and function names.
- Ensure proper error handling and logging.
- Use comments where necessary, but prioritize self-explanatory code.
- Follow best security practices (e.g., input validation, avoiding hardcoded secrets).
- Use consistent formatting and follow project-specific linting rules.

---

## Core Development Principles

- **Consistency**: Consistent code is crucial for readability and maintenance.
- **Clarity**: Write code that is clear and easy to understand.
- **Simplicity**: Avoid complexity when simpler solutions exist.
- **Scalability**: Ensure that code is scalable and maintainable.

---

## Non-negotiable Rules

> The following are auto-enforced by hooks (see `.claude/hooks/`): no explicit `any`, no library-specific inline style props, no inline `style`, no hardcoded CSS colors, no Tailwind palette classes (e.g. `bg-blue-500`), no raw dimensions. Hooks block violating writes. The rules below include both hook-enforced and manual-compliance items.

- **NEVER** use explicit `any` *(hook-enforced)*
- **NEVER** hardcode colors, spacing, font sizes, shadows, border radius, z-index, widths, heights, max-widths, min-heights, or line-heights — always use design tokens from your chosen UI library's theme system *(hook-enforced)*
- **NEVER** skip required files
- **PREFER** a vendored shadcn/ui primitive or a genuinely-fitting semantic HTML element over a plain `<div>`/`<span>` — but a plain `<div>`/`<span>` is a legitimate choice for generic layout/grouping with no semantic role of its own; never reach for a semantic element that doesn't actually apply just to avoid one (see the HTML Element Policy section below)
- **NEVER** use library-specific inline style props (e.g. `sx`) for production component styling *(hook-enforced)*
- **NEVER** use inline `style` attribute *(hook-enforced)*
- **NEVER** duplicate existing utilities, hooks, store patterns, service clients, constants, or types
- **NEVER** call APIs directly inside UI components when a reusable service/store action should be used
- **NEVER** place business logic inside presentational elements
- **NEVER** mutate store state directly
- **NEVER** create untyped HTTP responses
- **NEVER** omit accessibility attributes
- **ALWAYS** use design tokens from your theme configuration
- **ALWAYS** reuse existing utilities, hooks, validations, constants, stores, and shared types before creating new ones
- **ALWAYS** separate UI, state, service, and mapping concerns
- **ALWAYS** include blank lines between import groups
- **ALWAYS** keep import order and grouping — mechanically enforced via `import-x/order`, see `core/06-typescript.md`
- **ALWAYS** ensure accessibility: semantic controls, valid labels, alt text, keyboard support
- **ALWAYS** type API requests, responses, store state, actions, component props, and mapper outputs
- **ALWAYS** use a prop for reusable components, and hardcode `data-testid` only in page-level or one-off UI
- **ALWAYS** define components as named arrow-function `const`s, never `function` declarations, and never a default export — mechanically enforced via `react/function-component-definition` (excludes vendored `src/components/ui/**`) and by never using `export default` anywhere in `src/`
- **ALWAYS** add a re-export to the nearest `index.ts` whenever you create a new file inside `hooks/`, `components/`, `types/`, `constants/`, `services/`, or `store/` — a module that is not barrel-exported does not officially exist

---

## Constants Organization

- Always place application constants in `src/constants/` and barrel-export from `src/constants/index.ts`
- Always name constant values in `UPPER_SNAKE_CASE`
- Always name the file after its domain: `routes.constants.ts`, `validation.constants.ts`, `api.constants.ts`
- Never hardcode magic strings or numbers inline in components, hooks, or services — extract to a named constant
- API endpoint paths belong in `src/constants/api.constants.ts` — never hardcoded in service files

```ts
// src/constants/api.constants.ts
export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  USER_PROFILE: "/users/profile",
} as const;

// src/constants/validation.constants.ts
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MAX_LENGTH: 50,
} as const;
```

```ts
// WRONG — magic string inline in service
export const loginUser = () => apiClient.post("/auth/login", data);

// CORRECT — named constant
import { API_ENDPOINTS } from "@/constants";
export const loginUser = () => apiClient.post(API_ENDPOINTS.LOGIN, data);
```

## HTML Element Policy

`<div>` and `<span>` are allowed. On a shadcn/ui + Tailwind stack they are
themselves the idiomatic building blocks — shadcn's own vendored primitives
(`card.tsx`, `badge.tsx`, etc.) are styled divs/spans under the hood, and
there's no library replacement for a plain, semantically-neutral layout
wrapper (a flex/grid container with no inherent role). A prior version of
this policy hard-blocked both elements everywhere; in practice that forced
semantically **wrong** choices whenever nothing genuinely fit (`<em>` used for
plain non-emphasized text, `<p className="inline">` as a `<span>`
substitute, `<figure>`/`<figcaption>` forced onto content that wasn't really
self-contained media) — worse for accessibility than the div/span it was
meant to prevent, not better.

**Still prefer, in this order, whenever one genuinely fits:**
1. A vendored shadcn/ui primitive (`Card`, `Badge`, `Alert`, etc.) when the
   content matches what that primitive represents — see
   `styling/shadcn/04-composition-patterns.md`'s "Use Components, Not Custom
   Markup" table.
2. A semantic HTML element (`<section>`, `<article>`, `<em>`, `<strong>`,
   etc.) when the content genuinely carries that meaning.
3. A plain `<div>`/`<span>` for generic layout/grouping with no semantic role
   of its own — this is a legitimate, idiomatic choice here, not a fallback
   to feel guilty about.

Don't reach for a semantic landmark or emphasis element just to avoid a
`<div>`/`<span>` — using `<section>` for non-thematic layout, or `<em>` for
non-emphasized text, dilutes the signal those elements exist to carry.

### Common Semantic Elements

| Category | Elements |
| --- | --- |
| Structural | `<main>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`, `<nav>`, `<hgroup>` |
| Lists | `<ul>`, `<ol>`, `<li>`, `<dl>`, `<dt>`, `<dd>` |
| Typography | `<h1>`–`<h6>`, `<p>`, `<em>`, `<strong>`, `<small>`, `<mark>`, `<time>`, `<abbr>`, `<code>`, `<kbd>`, `<blockquote>`, `<address>` |
| Media | `<figure>`, `<figcaption>`, `<img>` |
| Forms & interactive | `<form>` (required for React Hook Form's `onSubmit`), `<label>` (prefer the vendored `Label` when styling is needed), `<a>` (prefer `react-router`'s `Link`/`NavLink` for in-app navigation; raw `<a>` for external links), `<button>` (prefer the vendored `Button`; raw `<button>` only for a fully unstyled reset inside a custom composite control) |
| Tabular data | `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`, `<caption>` — prefer the vendored `Table`/`TableHeader`/`TableBody`/etc. when available |

### Examples

```tsx
// CORRECT — shadcn/ui primitive when the content is genuinely a card
<Card>...</Card>

// CORRECT — semantic HTML when the content is genuinely a page section
<section aria-labelledby="section-title">
  <h2 id="section-title">Title</h2>
</section>

// CORRECT — a plain div is fine for a generic layout wrapper with no role of its own
<div className="flex flex-col gap-4">
  <Card>...</Card>
  <Card>...</Card>
</div>

// CORRECT — shadcn/ui primitive when the content is genuinely a status pill
<Badge>Status</Badge>

// CORRECT — a plain span is fine for inline text with no semantic role
<span className="text-muted-foreground">deployed the payments service</span>

// WRONG — <em> misused for text that isn't actually emphasized
<em className="text-muted-foreground">deployed the payments service</em>
```
