# Forms Strategy — Choose One

**Enable only the file that matches your chosen validation library.**

| Strategy | File to keep | File to delete |
| --- | --- | --- |
| **React Hook Form + Zod** | `01-rhf-zod.md` | — |
| **React Hook Form + Yup** | `02-rhf-yup.md` | `01-rhf-zod.md` |

## How to Switch

1. Delete the file for the strategy you are NOT using.
2. In `CLAUDE.md`, update the Forms row in the conditionally-loaded rules table.
3. Update the validation dependency in `package.json` (`zod` vs `yup` + `@hookform/resolvers/yup`).

## Strategy Summaries

### React Hook Form + Zod (default)
- Schema defined with `z.object()`
- Types inferred via `z.infer<typeof schema>`
- Resolver wired via `zodResolver`

### React Hook Form + Yup
- Schema defined with `yup.object()`
- Types inferred via `yup.InferType<typeof schema>`
- Resolver wired via `yupResolver`
