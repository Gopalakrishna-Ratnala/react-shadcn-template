---
description: Toast notifications — hook-only usage, severity variants, toast.promise for async, dismiss-by-ID pattern. Active when project uses toast notifications.
paths: ["src/hooks/**/*.ts", "src/components/**/*.tsx", "src/pages/**/*.tsx"]
---

# Notifications (Toasts)

## Rules

- Never call `toast()` directly inside a UI component — always call it from a hook
- Always use the correct severity variant: `success`, `error`, `loading`, `info`
- Always prefer `toast.promise` for async operations — it handles loading/success/error in one call
- When using `toast.loading` manually, always dismiss by ID on settle — never leave a loading toast open
- Never duplicate toast calls — one action triggers one toast
- Keep toast messages short, user-facing, and free of technical jargon
- Always render the `<Toaster />` provider once at the root level in `App.tsx` — never inside a page or component

## When to Use Toasts

| Scenario | Action |
|---|---|
| Async operation succeeds | `toast.success("Saved successfully")` |
| Async operation fails | `toast.error("Failed to save. Please try again.")` |
| Async operation in progress | `toast.promise(...)` preferred, or `toast.loading` + dismiss by ID |
| Form validation failure | Inline field error — **not** a toast |
| Informational system message | `toast.info(...)` |
| Reversible action (e.g. delete) | `toast` with an action/undo button |

## Preferred Pattern — `toast.promise`

```ts
// src/hooks/useUpdateProfile.ts
import { toast } from "sonner"; // replace with chosen toast library

export const useUpdateProfile = () => {
  const save = async (data: ProfileFormValues) => {
    await toast.promise(updateProfile(data), {
      loading: "Saving profile...",
      success: "Profile updated",
      error: (err: unknown) =>
        err instanceof Error ? err.message : "Failed to update profile",
    });
  };

  return { save };
};
```

## Manual Loading Toast — Always Dismiss by ID

```ts
// src/hooks/useDeleteItem.ts
import { toast } from "sonner";

export const useDeleteItem = () => {
  const remove = async (id: string) => {
    const toastId = toast.loading("Deleting item...");
    try {
      await deleteItem(id);
      toast.success("Item deleted", { id: toastId });
    } catch {
      toast.error("Failed to delete item", { id: toastId });
    }
  };

  return { remove };
};
```

## Page Usage — No Toast Import

```tsx
// src/pages/profile/ProfilePage.tsx — no toast import here
import { useUpdateProfile } from "@/hooks";

export const ProfilePage = (): ReactElement => {
  const { save } = useUpdateProfile();
  return <ProfileForm onSubmit={save} />;
};
```
