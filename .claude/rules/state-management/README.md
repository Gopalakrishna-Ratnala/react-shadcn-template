# State Management Strategy — Zustand (fixed, not a choice)

This project uses **Zustand** for client-side shared state. This is fixed for this
template — there is no Redux Toolkit or other state library option.

## Why Zustand, specifically

Confirmed via direct research, not just convention:
- **This template's own original scaffolding already labeled Zustand "(default)"**
  before this decision was formally closed out.
- **tweakcn** (a real, ~10k-star production app in this exact shadcn/Tailwind
  ecosystem) confirmed uses Zustand for all client-side state (three domain stores:
  editor state, theme presets, auth) — checked directly in their own architecture
  docs, not assumed.
- Minimal API surface (a single `create()` call, hook-based selectors) — given this
  template's core premise is designers prompting Claude directly with little to no
  developer review, a smaller, more centralized mental model (one store object per
  domain) has fewer ways to go subtly wrong than a more distributed/atomic model.

(For context: shadcn-ui/ui's own demo app uses Jotai, a different, atom-based
library — confirmed directly in their `apps/v4/package.json`. Real projects in this
ecosystem genuinely use both. Zustand was chosen here specifically for the reasons
above, not because Jotai is wrong — if a future need for atomic/derived state
composition becomes strong enough to reconsider, that's a deliberate, explicit
decision to have with the user, not something to default into.)

## Once a real project has adopted this — do not suggest switching

The moment a downstream project built from this template has Zustand actually
installed and has real stores in `src/store/`, **never suggest switching to a
different state management library**, regardless of what a later prompt might
imply (e.g. "this component's state is getting complex" is not, by itself, a
reason to propose Redux Toolkit, Jotai, or anything else). One state library per
project, chosen once, kept for the project's lifetime. If a genuinely compelling
reason to reconsider comes up, that's an explicit conversation to have with the
user — not something to bring up unprompted.

## Rules

- `01-zustand.md` — store structure, domain-focused stores, async actions,
  no direct mutation. Active for every project using this template.
