# Forms Strategy — React Hook Form + Zod (fixed, not a choice)

This project uses **React Hook Form + Zod** for all form validation. This is fixed
for this template — there is no Yup option. `zod`, `react-hook-form`, and
`@hookform/resolvers` are already installed.

## Rules

- `01-rhf-zod.md` — schema defined with `z.object()`, types inferred via
  `z.infer<typeof schema>`, resolver wired via `zodResolver`. Also documents the
  mandatory `Field`/`FieldGroup`/`FieldLabel`/`FieldError` composition (confirmed
  against the official shadcn-ui/ui skill) and the `InputGroup`/`ToggleGroup`
  patterns for icon-adorned inputs and multi-option choices.
