---
description: React Hook Form + Yup validation — form structure, Controller integration, accessibility wiring. Loaded when working with forms.
paths: ["src/**/*.tsx", "src/hooks/**/*.ts"]
---

# Forms Rules (React Hook Form + Yup)

## Mandatory Form Requirements

- All forms MUST use Yup schema validation
- All forms MUST use RHF resolver via `yupResolver`
- UI library inputs MUST integrate through `Controller` unless RHF-native
- Validation messages MUST be visible and accessible
- Form submission MUST use typed values inferred from schema where possible
- Do not manage RHF-controlled values in local component state

## MANDATORY: Schema File Placement

Every Yup schema for a page or component MUST live in a co-located schema file named `ComponentName.schema.ts` (e.g. `CheckoutPage.schema.ts`).

- Schema files are **not permitted** inside `.tsx` files or hooks
- The `.tsx` file imports the schema and the inferred type from the schema file

```text
pages/checkout/
├── CheckoutPage.tsx
├── CheckoutPage.styles.ts
├── types.ts
├── CheckoutPage.schema.ts    ← schema lives here
├── CheckoutPage.test.tsx
└── index.ts
```

```ts
// CheckoutPage.schema.ts
import { object, string, type InferType } from "yup";

export const checkoutSchema = object({
  email: string().email("Invalid email").required("Email is required"),
  cardNumber: string().required("Card number is required"),
});

export type CheckoutFormValues = InferType<typeof checkoutSchema>;
```

```tsx
// CheckoutPage.tsx
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { checkoutSchema, type CheckoutFormValues } from "./CheckoutPage.schema";

export function CheckoutPage() {
  const form = useForm<CheckoutFormValues>({ resolver: yupResolver(checkoutSchema) });
}
```

## Required Schema Pattern

Schemas always live in a co-located `ComponentName.schema.ts` file. Never define them inside `.tsx` or hook files.

```ts
// LoginPage.schema.ts — schema defined here only
import { object, string, type InferType } from "yup";

export const loginSchema = object({
  email: string().email("Invalid email").required("Email is required"),
  password: string().min(8, "Minimum 8 characters").required("Password is required"),
});

export type LoginFormValues = InferType<typeof loginSchema>;
```

```tsx
// LoginPage.tsx — imports schema and type, never re-defines them
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { loginSchema, type LoginFormValues } from "./LoginPage.schema";

export function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });
}
```

## Required Accessibility Wiring

- `error`
- `helperText` (or equivalent error display in your UI library)
- `aria-invalid`
- `aria-describedby`
- visible labels or valid `aria-label`

## Forbidden Patterns

- Do not use Zod — use only Yup for schema definition
- Do not use `z.infer` — use `InferType<typeof schema>` (named import from `"yup"`) for type inference
- Do not mix local `useState` with RHF-controlled fields for the same value
