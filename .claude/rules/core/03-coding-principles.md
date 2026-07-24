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

> The following are auto-enforced by hooks (see `.claude/hooks/`): no explicit `any`, no `<div>`/`<span>`, no library-specific inline style props, no inline `style`, no hardcoded CSS colors, no Tailwind palette classes (e.g. `bg-blue-500`), no raw dimensions. Hooks block violating writes. The rules below include both hook-enforced and manual-compliance items.

- **NEVER** use explicit `any` *(hook-enforced)*
- **NEVER** hardcode colors, spacing, font sizes, shadows, border radius, z-index, widths, heights, max-widths, min-heights, or line-heights — always use design tokens from your chosen UI library's theme system *(hook-enforced)*
- **NEVER** skip required files
- **NEVER** use `<div>` or `<span>` in component JSX — they carry no semantic meaning and are always a layout shortcut *(hook-enforced)*
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
- **ALWAYS** keep import order and grouping compatible with ESLint rules
- **ALWAYS** ensure accessibility: semantic controls, valid labels, alt text, keyboard support
- **ALWAYS** type API requests, responses, store state, actions, component props, and mapper outputs
- **ALWAYS** use a prop for reusable components, and hardcode `data-testid` only in page-level or one-off UI
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

### Forbidden — always replace

| Element | Why | What to use instead |
| --- | --- | --- |
| `<div>` | No semantic meaning; always a layout shortcut | UI library card/container primitive (`Card`, `Paper`, etc.), or a semantic element: `<section>`, `<article>`, `<main>` |
| `<span>` | No semantic meaning; always an inline shortcut | UI library badge/chip primitive (`Badge`, `Chip`, etc.), or a semantic element: `<em>`, `<strong>`, `<code>` |

### Allowed — semantic HTML with no UI library equivalent

Use these when no UI library primitive satisfies the semantic need. They must be used **intentionally**, not as a fallback convenience.

| Category | Elements |
| --- | --- |
| Structural | `<main>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`, `<nav>` |
| Lists | `<ul>`, `<ol>`, `<li>` |
| Typography | `<h1>`–`<h6>`, `<p>`, `<em>`, `<strong>`, `<small>`, `<mark>`, `<time>`, `<abbr>`, `<code>`, `<kbd>` |
| Media | `<figure>`, `<figcaption>`, `<img>` |

### Examples

```tsx
// WRONG — <div> with no semantic role
<div className="card">...</div>

// CORRECT — shadcn/ui primitive
<Card>...</Card>

// WRONG — <div> used as a page section wrapper
<div>
  <h1>Title</h1>
</div>

// CORRECT — semantic HTML when no shadcn/ui primitive fits
<section aria-labelledby="section-title">
  <h2 id="section-title">Title</h2>
</section>

// WRONG — <span> wrapping inline text
<span className="label">Status</span>

// CORRECT — shadcn/ui primitive or semantic element
<Badge>Status</Badge>
// or, when purely typographic
<em>Status</em>

// FINE — <p> for prose content when no shadcn/ui typography component is appropriate
<p>Supporting description text.</p>
// prefer shadcn/ui's card description component when inside a card context
// e.g. <CardDescription>
```
