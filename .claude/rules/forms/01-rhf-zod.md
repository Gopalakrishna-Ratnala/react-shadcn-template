---
description: React Hook Form + Zod validation — form structure, Controller integration, accessibility wiring. Loaded when working with forms.
paths: ["src/**/*.tsx", "src/hooks/**/*.ts"]
---

# Forms Rules (React Hook Form + Zod)

## Mandatory Field Composition

All form fields MUST be composed with shadcn/ui's vendored `Field` primitives
(`@/components/ui/field`) — never raw `<div>` wrappers around a `Label` + input.
Confirmed against ui.shadcn.com's current docs:

```tsx
// WRONG — raw div wrapper, no accessible error wiring
<div className="flex flex-col gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" />
</div>

// CORRECT
<Field data-invalid={!!errors.email}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" aria-invalid={!!errors.email} {...register("email")} />
  <FieldDescription>We'll send updates to this address.</FieldDescription>
  {errors.email && <FieldError>{errors.email.message}</FieldError>}
</Field>
```

- Wrap multiple `Field`s in `FieldGroup` to stack them with consistent spacing —
  never a manual `space-y-*`/`gap-*` wrapper div for this purpose
- Use `FieldSet` + `FieldLegend` for a semantically grouped section of fields
  (e.g. "Billing address"), not a `<div>` with a heading
- Set `data-invalid` on `Field` from RHF's `formState.errors`, and mirror it as
  `aria-invalid` on the input itself — this is what actually drives the error
  styling and accessibility announcement, not manual conditional classes
- `FieldDescription` is optional helper text; `FieldError` only renders when
  passed a message (conditionally render it, don't pass an empty string)

## Mandatory Form Requirements

- All forms MUST use Zod schema validation
- All forms MUST use RHF resolver
- UI library inputs MUST integrate through `Controller` unless RHF-native
- Validation messages MUST be visible and accessible
- Form submission MUST use typed values inferred from schema where possible
- Do not manage RHF-controlled values in local component state

## MANDATORY: Schema File Placement

Every Zod schema for a page or component MUST live in a co-located schema file named `ComponentName.schema.ts` (e.g. `LoginPage.schema.ts`).

- Schema files are **not permitted** inside `.tsx` files or hooks
- The `.tsx` file imports the schema and the inferred type from the schema file

```text
pages/login/
├── LoginPage.tsx
├── LoginPage.styles.ts
├── types.ts
├── LoginPage.schema.ts    ← schema lives here
├── LoginPage.test.tsx
└── index.ts
```

```ts
// LoginPage.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

```tsx
// LoginPage.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginSchema, type LoginFormValues } from "./LoginPage.schema";

export const LoginPage = (): ReactElement => {
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
};
```

## Numeric/coerced fields (`z.coerce.*`) need a different `useForm` signature

A schema with a coerced field (any `z.coerce.number()`, `z.coerce.date()`, etc. —
common for numeric inputs, since raw `<input>` values are strings) has a **different
type before and after validation runs**: the pre-coercion (input) shape and the
post-coercion (output) shape aren't the same. `useForm<T>`'s single-generic form only
works when input and output are identical — with a coerced field, it produces a real
type error between the resolver and `handleSubmit`.

```ts
// ProductsPage.schema.ts
import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
});

// Split input (pre-coercion) from output (post-coercion) - useForm's generic
// needs the input shape; the submit handler needs the output shape.
export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;
```

```tsx
// ProductsPage.tsx
import {
  productFormSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "./ProductsPage.schema";

export const ProductsPage = (): ReactElement => {
  // Third generic (TTransformedValues) tells RHF the post-coercion shape, so
  // handleSubmit's callback receives correctly-typed values, not the raw input type.
  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
  });

  const onSubmit = (values: ProductFormValues) => {
    // values.price is genuinely `number` here, not `unknown`
  };
};
```

## Forbidden Patterns

- Do not define Zod schemas inline in `.tsx` files or hooks
- Do not use `yup` — use only Zod for schema definition
- Do not mix local `useState` with RHF-controlled fields for the same value

## Required Accessibility Wiring

Use the `Field` primitives to get this correct by construction, rather than
wiring these manually on every field:

- `Field`'s `data-invalid` prop (set from RHF's `formState.errors`)
- `FieldError` for the visible, accessible error message (conditionally rendered)
- `FieldDescription` for helper text
- `aria-invalid` on the input itself, mirroring `data-invalid`
- `FieldLabel`'s `htmlFor` correctly associates the label with its input —
  never a bare `<label>` or a `Label` with a mismatched `htmlFor`

## InputGroup and ToggleGroup

- To add an icon, prefix text, or a button inside an input (e.g. a search icon,
  a "$" prefix, a copy button), use `InputGroup` + `InputGroupAddon` — never a
  raw `Input` with manually-positioned absolute children.
- Inside an `InputGroup`, use `InputGroupInput`/`InputGroupTextarea` — never the
  plain `Input`/`Textarea` primitives, which don't account for the addon's space.

```tsx
// WRONG — manual absolute positioning
<div className="relative">
  <Input className="pl-8" />
  <SearchIcon className="absolute left-2 top-2 size-4" />
</div>

// CORRECT
<InputGroup>
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
  <InputGroupInput placeholder="Search..." />
</InputGroup>
```

- For a set of 2–7 mutually exclusive or multi-select options (e.g. a view
  toggle, a filter row), use `ToggleGroup` + `ToggleGroupItem` — never a loop of
  `Button`s with manually-tracked active state.

```tsx
// WRONG — manual active-state tracking
{options.map((opt) => (
  <Button
    key={opt}
    variant={active === opt ? "default" : "outline"}
    onClick={() => setActive(opt)}
  >
    {opt}
  </Button>
))}

// CORRECT
<ToggleGroup type="single" value={active} onValueChange={setActive}>
  {options.map((opt) => (
    <ToggleGroupItem key={opt} value={opt}>
      {opt}
    </ToggleGroupItem>
  ))}
</ToggleGroup>
```
