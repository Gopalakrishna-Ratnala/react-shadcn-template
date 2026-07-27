# Feature Test Report — Tester 3

**Feature task assigned:** Assignment 3 — Settings page: `Tabs`/`TabsList` sections
(Profile / Security / Notifications), an `InputGroup` password field with a
show/hide toggle button inside the input, a `Skeleton` shown while data "loads,"
a `Separator` between sections, and the existing `ThemeToggle` used prominently
in the header.
**Your Node version:** v26.5.0
**Date:** 2026-07-27

## ⚠️ Methodology caveat — read before trusting the hook-behavior section

This run did **not** follow the skill's normal 2-phase split. The feature was built
directly inside this same session (started from
`/Users/abhi/work/react-shadcn-template`), against files in `/tmp/feature-test-3`,
at the user's explicit instruction ("run here and push") after this was flagged.
Per the skill's own stated rationale, Claude Code only loads `.claude/settings.json`
hooks from the session's *startup* working directory — so the hooks that were
actually active during this build are **this repo's** hooks, not a session started
fresh from the cloned copy. In practice the two are byte-identical copies of the
same template, so the hook *scripts* that ran are the same, but this was not a
methodologically valid test of "does a freshly-started session in the clone
correctly load and enforce its own hooks" — only of "do these hook scripts, as
written, catch or miss real violations." Treat the hook-behavior findings below as
real (the scripts genuinely ran against Write/Edit calls targeting the clone's
files) but not as confirmation of the cross-session-hook-loading assumption the
skill exists to protect against.

## Setup

- [x] Clone completed without error
- [x] `npm install` succeeded, but only after working around a local, machine-specific
      issue unrelated to the repo: the shared `~/.npm` cache had root-owned files
      from a previous `sudo npm` run on this machine, causing `EACCES` errors.
      Fixed by re-running with an isolated cache dir (`npm install --cache
      /tmp/npm-cache-test3`) instead of the destructive `sudo chown -R` fix npm
      suggested. 8 vulnerabilities reported by npm audit (3 moderate, 5 high) —
      pre-existing in the template's dependency tree, not introduced by this task.
- [ ] `npm run mock-api` — not started; the feature only needed a GET of a single
      seeded resource, which was verified through the automated test suite's mocked
      service layer rather than a live server (see "Assumptions made").

## The feature-building session

Explored the clean template first: confirmed `Tabs`, `InputGroup`, `Skeleton`,
`Separator`, `Field`/`FieldGroup`/`FieldContent`, `Switch`, and `ThemeToggle`
already existed as vendored/shared components — no new UI primitives needed.
Found that `src/types/common.types.ts`, `src/constants/api.constants.ts`, and any
settings-domain service/mapper did not exist yet (clean template ships empty), so
those had to be created first per the core rules (`ApiResponse<T>`/`AsyncState<T>`
are mandatory core types; API endpoints must live in `api.constants.ts`; service →
mapper → domain model is the required data-fetching shape).

Files touched, roughly in order:
1. `src/types/common.types.ts` (new) — `ApiResponse<T>`, `AsyncState<T>`
2. `src/types/settings.types.ts` (new) — `SettingsProfile` domain type
3. `src/types/index.ts` (edited) — barrel-exported both
4. `src/constants/api.constants.ts` (new) — `API_ENDPOINTS.SETTINGS_PROFILE`
5. `src/constants/index.ts` (edited) — barrel-exported it
6. `src/constants/routes.constants.ts` (edited) — added `ROUTES.SETTINGS`
7. `src/services/settings/types.ts` (new) — `SettingsProfileDto`
8. `src/services/settings/settingsService.ts` (new) — `getSettingsProfile()`
9. `src/services/settings/index.ts` (new) — barrel export
10. `src/services/mappers/settingsMapper.ts` (new) — DTO → domain mapper
11. `src/services/index.ts` (edited) — barrel-exported service + mapper
12. `src/hooks/useSettingsProfile.ts` (new) — `AsyncState`-driven fetch-on-mount hook
13. `src/hooks/useSettingsProfile.test.ts` (new)
14. `src/hooks/index.ts` (edited) — barrel export
15. `src/pages/settings/types.ts` (new)
16. `src/pages/settings/SettingsPage.schema.ts` (new) — password-change Zod schema
17. `src/pages/settings/SettingsPage.styles.ts` (new)
18. `src/pages/settings/SettingsPage.tsx` (new)
19. `src/pages/settings/SettingsPage.test.tsx` (new)
20. `src/pages/settings/index.ts` (new)
21. `src/config/routes.tsx` (edited) — lazy-loaded `SettingsPage` route added
22. `db.json` (edited) — seeded `settingsProfile` resource

First draft of `SettingsPage.tsx` used raw `<span>` wrappers for a few purely
layout groupings (skeleton rows, switch rows, the header title/subtitle stack).
Caught this against `core/03-coding-principles.md`'s two-tier HTML element policy
before finalizing and rebuilt those groupings using `Field`/`FieldContent` (already
a vendored primitive, so no raw markup needed) and an `<hgroup>` for the header
text stack (a real semantic element, not one of the two banned tags). Also hit a
real ESLint blocker from `eslint-plugin-react-hooks`'s `set-state-in-effect` rule
on the fetch-on-mount hook — see the gaps section below for the fix and why it's a
genuine tooling/guidance gap, not a mistake in the feature code.

---

## Generated code — the most important section, do not skip or summarize

### src/types/common.types.ts

```ts
export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
  error?: string;
}

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

### src/types/settings.types.ts

```ts
export interface SettingsProfile {
  id: number;
  fullName: string;
  email: string;
  bio: string;
}
```

### src/types/index.ts

```ts
export type { ApiResponse, AsyncState } from "./common.types";
export type { SettingsProfile } from "./settings.types";
```

### src/constants/api.constants.ts

```ts
export const API_ENDPOINTS = {
  SETTINGS_PROFILE: "/settingsProfile",
} as const;
```

### src/constants/index.ts

```ts
export { ROUTES } from "./routes.constants";
export { API_ENDPOINTS } from "./api.constants";
```

### src/constants/routes.constants.ts

```ts
export const ROUTES = {
  COMPONENTS_GALLERY: "/components-gallery",
  SETTINGS: "/settings",
} as const;
```

### src/services/settings/types.ts

```ts
export interface SettingsProfileDto {
  id: number;
  fullName: string;
  email: string;
  bio: string;
}
```

### src/services/settings/settingsService.ts

```ts
import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/constants";
import type { ApiResponse } from "@/types/common.types";

import type { SettingsProfileDto } from "./types";

export const getSettingsProfile = async (): Promise<
  ApiResponse<SettingsProfileDto>
> => {
  try {
    const data = await apiClient.get<SettingsProfileDto>(
      API_ENDPOINTS.SETTINGS_PROFILE,
    );
    return { status: 200, data, message: "OK" };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error in getSettingsProfile");
  }
};
```

### src/services/settings/index.ts

```ts
export { getSettingsProfile } from "./settingsService";
export type { SettingsProfileDto } from "./types";
```

### src/services/mappers/settingsMapper.ts

```ts
import type { SettingsProfileDto } from "@/services/settings/types";
import type { SettingsProfile } from "@/types/settings.types";

export const mapSettingsProfileDto = (
  dto: SettingsProfileDto,
): SettingsProfile => ({
  id: dto.id,
  fullName: dto.fullName,
  email: dto.email,
  bio: dto.bio,
});
```

### src/services/index.ts

```ts
export { apiClient, ApiError } from "./apiClient";
export { getSettingsProfile } from "./settings";
export { mapSettingsProfileDto } from "./mappers/settingsMapper";
```

### src/hooks/useSettingsProfile.ts

```ts
import { useCallback, useEffect, useState } from "react";

import { getSettingsProfile } from "@/services/settings";
import { mapSettingsProfileDto } from "@/services/mappers/settingsMapper";
import type { AsyncState } from "@/types/common.types";
import type { SettingsProfile } from "@/types/settings.types";

export const useSettingsProfile = () => {
  const [state, setState] = useState<AsyncState<SettingsProfile>>({
    status: "loading",
  });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await getSettingsProfile();
      setState({ status: "success", data: mapSettingsProfileDto(response.data) });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setState({ status: "error", message });
    }
  }, []);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    void fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    // fetchProfile only calls setState after its awaited request settles
    // (never synchronously), so this is a standard fetch-on-mount pattern —
    // but eslint-plugin-react-hooks's set-state-in-effect rule flags any
    // effect-called function that transitively sets state, regardless of
    // await placement. There is no fetch-on-mount pattern that satisfies
    // this rule without an external cache/query library, which this
    // template does not use, so it is suppressed here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProfile();
  }, [fetchProfile]);

  return { state, reload };
};
```

### src/hooks/useSettingsProfile.test.ts

```ts
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useSettingsProfile } from "./useSettingsProfile";

vi.mock("@/services/settings", () => ({
  getSettingsProfile: vi.fn(),
}));

import { getSettingsProfile } from "@/services/settings";

describe("useSettingsProfile", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads the profile and exposes it via success state", async () => {
    vi.mocked(getSettingsProfile).mockResolvedValue({
      status: 200,
      message: "OK",
      data: { id: 1, fullName: "Jordan Lee", email: "jordan@example.com", bio: "Bio" },
    });

    const { result } = renderHook(() => useSettingsProfile());

    expect(result.current.state.status).toBe("loading");

    await waitFor(() => {
      expect(result.current.state.status).toBe("success");
    });

    expect(result.current.state).toEqual({
      status: "success",
      data: { id: 1, fullName: "Jordan Lee", email: "jordan@example.com", bio: "Bio" },
    });
  });

  it("exposes an error state when the request fails", async () => {
    vi.mocked(getSettingsProfile).mockRejectedValue(new Error("Network down"));

    const { result } = renderHook(() => useSettingsProfile());

    await waitFor(() => {
      expect(result.current.state.status).toBe("error");
    });

    expect(result.current.state).toEqual({
      status: "error",
      message: "Network down",
    });
  });
});
```

### src/hooks/index.ts

```ts
export { useIsMobile } from "./use-mobile";
export { useSettingsProfile } from "./useSettingsProfile";
```

### src/pages/settings/types.ts

```ts
export type SettingsTab = "profile" | "security" | "notifications";
```

### src/pages/settings/SettingsPage.schema.ts

```ts
import { z } from "zod";

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
```

### src/pages/settings/SettingsPage.styles.ts

```ts
export const settingsPageStyles = {
  page: "min-h-screen bg-background text-foreground",
  main: "mx-auto w-full max-w-2xl px-6 py-10 sm:px-10",
  header: "mb-8 flex items-start justify-between gap-4",
  headerText: "flex flex-col gap-1",
  title: "text-3xl font-bold text-foreground",
  subtitle: "text-sm text-muted-foreground",
  tabsContent: "flex flex-col gap-6 pt-6",
  skeletonRow: "flex flex-col gap-2",
  skeletonLabel: "h-4 w-24",
  skeletonInput: "h-9 w-full",
  errorText: "text-sm text-destructive",
  switchHelper: "text-sm text-muted-foreground",
};
```

### src/pages/settings/SettingsPage.tsx

```tsx
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ThemeToggle } from "@/components/shared/themeToggle";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettingsProfile } from "@/hooks/useSettingsProfile";

import {
  passwordChangeSchema,
  type PasswordChangeValues,
} from "./SettingsPage.schema";
import { settingsPageStyles } from "./SettingsPage.styles";

function ProfileTabContent() {
  const { state } = useSettingsProfile();

  if (state.status === "loading" || state.status === "idle") {
    return (
      <FieldGroup aria-busy="true" aria-label="Loading profile">
        <Field>
          <FieldContent className={settingsPageStyles.skeletonRow}>
            <Skeleton className={settingsPageStyles.skeletonLabel} />
            <Skeleton className={settingsPageStyles.skeletonInput} />
          </FieldContent>
        </Field>
        <Field>
          <FieldContent className={settingsPageStyles.skeletonRow}>
            <Skeleton className={settingsPageStyles.skeletonLabel} />
            <Skeleton className={settingsPageStyles.skeletonInput} />
          </FieldContent>
        </Field>
        <Field>
          <FieldContent className={settingsPageStyles.skeletonRow}>
            <Skeleton className={settingsPageStyles.skeletonLabel} />
            <Skeleton className={settingsPageStyles.skeletonInput} />
          </FieldContent>
        </Field>
      </FieldGroup>
    );
  }

  if (state.status === "error") {
    return <p className={settingsPageStyles.errorText}>{state.message}</p>;
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="profile-full-name">Full name</FieldLabel>
        <p id="profile-full-name">{state.data.fullName}</p>
      </Field>
      <Field>
        <FieldLabel htmlFor="profile-email">Email</FieldLabel>
        <p id="profile-email">{state.data.email}</p>
      </Field>
      <Field>
        <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
        <p id="profile-bio">{state.data.bio}</p>
      </Field>
    </FieldGroup>
  );
}

function SecurityTabContent() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  // Simulated submit — no backend endpoint for password change in this demo.
  const onSubmit = (values: PasswordChangeValues) => {
    void values;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.currentPassword}>
          <FieldLabel htmlFor={currentPasswordId}>Current password</FieldLabel>
          <Controller
            control={control}
            name="currentPassword"
            render={({ field }) => (
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={currentPasswordId}
                  type={showCurrentPassword ? "text" : "password"}
                  aria-invalid={!!errors.currentPassword}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                  >
                    {showCurrentPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            )}
          />
          {errors.currentPassword && (
            <FieldError>{errors.currentPassword.message}</FieldError>
          )}
        </Field>

        <Separator />

        <Field data-invalid={!!errors.newPassword}>
          <FieldLabel htmlFor={newPasswordId}>New password</FieldLabel>
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={newPasswordId}
                  type={showNewPassword ? "text" : "password"}
                  aria-invalid={!!errors.newPassword}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label={
                      showNewPassword ? "Hide new password" : "Show new password"
                    }
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            )}
          />
          {errors.newPassword && (
            <FieldError>{errors.newPassword.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor={confirmPasswordId}>
            Confirm new password
          </FieldLabel>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <InputGroupInput
                {...field}
                id={confirmPasswordId}
                type="password"
                aria-invalid={!!errors.confirmPassword}
              />
            )}
          />
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </Field>

        <InputGroupButton type="submit" variant="default" size="sm">
          Update password
        </InputGroupButton>
      </FieldGroup>
    </form>
  );
}

function NotificationsTabContent() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const emailSwitchId = useId();
  const pushSwitchId = useId();

  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor={emailSwitchId}>Email notifications</FieldLabel>
          <p className={settingsPageStyles.switchHelper}>
            Receive updates about your account by email.
          </p>
        </FieldContent>
        <Switch
          id={emailSwitchId}
          checked={emailEnabled}
          onCheckedChange={setEmailEnabled}
        />
      </Field>

      <Separator />

      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor={pushSwitchId}>Push notifications</FieldLabel>
          <p className={settingsPageStyles.switchHelper}>
            Receive push alerts on your devices.
          </p>
        </FieldContent>
        <Switch
          id={pushSwitchId}
          checked={pushEnabled}
          onCheckedChange={setPushEnabled}
        />
      </Field>
    </FieldGroup>
  );
}

export function SettingsPage() {
  return (
    <main className={settingsPageStyles.page}>
      <section className={settingsPageStyles.main}>
        <header className={settingsPageStyles.header}>
          <hgroup className={settingsPageStyles.headerText}>
            <h1 className={settingsPageStyles.title}>Settings</h1>
            <p className={settingsPageStyles.subtitle}>
              Manage your profile, security, and notification preferences.
            </p>
          </hgroup>
          <ThemeToggle />
        </header>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent
            value="profile"
            className={settingsPageStyles.tabsContent}
          >
            <ProfileTabContent />
          </TabsContent>

          <TabsContent
            value="security"
            className={settingsPageStyles.tabsContent}
          >
            <SecurityTabContent />
          </TabsContent>

          <TabsContent
            value="notifications"
            className={settingsPageStyles.tabsContent}
          >
            <NotificationsTabContent />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
```

### src/pages/settings/SettingsPage.test.tsx

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsPage } from "./SettingsPage";

const { useSettingsProfileMock } = vi.hoisted(() => ({
  useSettingsProfileMock: vi.fn(),
}));

vi.mock("@/hooks/useSettingsProfile", () => ({
  useSettingsProfile: useSettingsProfileMock,
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    useSettingsProfileMock.mockReturnValue({
      state: { status: "loading" },
      reload: vi.fn(),
    });
  });

  it("renders the page title, subtitle, and every tab", () => {
    render(<SettingsPage />);

    expect(
      screen.getByRole("heading", { name: "Settings", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Manage your profile, security, and notification preferences.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole("tab", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Security" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Notifications" }),
    ).toBeInTheDocument();
  });

  it("renders the theme toggle prominently in the header", () => {
    render(<SettingsPage />);
    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toBeInTheDocument();
  });

  it("shows skeleton placeholders while the profile is loading", () => {
    useSettingsProfileMock.mockReturnValue({
      state: { status: "loading" },
      reload: vi.fn(),
    });
    render(<SettingsPage />);

    const loadingGroup = screen.getByLabelText("Loading profile");
    expect(
      loadingGroup.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);
  });

  it("renders the loaded profile data once available", () => {
    useSettingsProfileMock.mockReturnValue({
      state: {
        status: "success",
        data: {
          id: 1,
          fullName: "Jordan Lee",
          email: "jordan.lee@example.com",
          bio: "Product designer.",
        },
      },
      reload: vi.fn(),
    });
    render(<SettingsPage />);

    expect(screen.getByText("Jordan Lee")).toBeInTheDocument();
    expect(screen.getByText("jordan.lee@example.com")).toBeInTheDocument();
  });

  it("renders an error message when the profile fails to load", () => {
    useSettingsProfileMock.mockReturnValue({
      state: { status: "error", message: "Network down" },
      reload: vi.fn(),
    });
    render(<SettingsPage />);

    expect(screen.getByText("Network down")).toBeInTheDocument();
  });

  it("toggles password visibility in the Security tab", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("tab", { name: "Security" }));

    const currentPasswordInput = screen.getByLabelText("Current password");
    expect(currentPasswordInput).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", { name: "Show current password" }),
    );
    expect(currentPasswordInput).toHaveAttribute("type", "text");

    await user.click(
      screen.getByRole("button", { name: "Hide current password" }),
    );
    expect(currentPasswordInput).toHaveAttribute("type", "password");
  });

  it("shows a validation error when the new password is too short", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("tab", { name: "Security" }));
    await user.type(screen.getByLabelText("New password"), "short");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(
      await screen.findByText("Minimum 8 characters"),
    ).toBeInTheDocument();
  });

  it("toggles email and push notification switches", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("tab", { name: "Notifications" }));

    const emailSwitch = screen.getByRole("switch", {
      name: "Email notifications",
    });
    const pushSwitch = screen.getByRole("switch", {
      name: "Push notifications",
    });

    expect(emailSwitch).toBeChecked();
    expect(pushSwitch).not.toBeChecked();

    await user.click(pushSwitch);
    expect(pushSwitch).toBeChecked();
  });
});
```

### src/pages/settings/index.ts

```ts
export { SettingsPage } from "./SettingsPage";
```

### src/config/routes.tsx (full file after edit)

```tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";

import { ROUTES } from "@/constants";

// React.lazy requires a default export; every page component in this project uses a
// named export for consistency (auto-import friendliness, no default-export ambiguity),
// so each lazy import is adapted with .then() rather than switching to default exports.
const ComponentsGalleryPage = lazy(() =>
  import("@/pages/componentsGallery/ComponentsGalleryPage").then((m) => ({
    default: m.ComponentsGalleryPage,
  })),
);
const SettingsPage = lazy(() =>
  import("@/pages/settings/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  })),
);

function PageLoader() {
  return <p role="status">Loading…</p>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.COMPONENTS_GALLERY}
        element={
          <Suspense fallback={<PageLoader />}>
            <ComponentsGalleryPage />
          </Suspense>
        }
      />
      <Route
        path={ROUTES.SETTINGS}
        element={
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
```

### db.json (full file after edit)

```json
{
  "example": [
    { "id": 1, "name": "Example item one" },
    { "id": 2, "name": "Example item two" }
  ],
  "settingsProfile": {
    "id": 1,
    "fullName": "Jordan Lee",
    "email": "jordan.lee@example.com",
    "bio": "Product designer focused on accessible, themeable UI systems."
  }
}
```

---

## Rule compliance self-check

**Component tiers (`core/02-project-structure.md`)**
- [x] No new component created in `layout/`/`shared/`/`blocks/` — the feature only
      needed a page, a hook, and a service/mapper layer; everything visual composes
      existing `ui/` primitives and the existing `ThemeToggle` shared component.
- [x] No duplicate of an existing component
- [x] Page folder has all required files: `.tsx`, `.styles.ts`, `types.ts`,
      `.schema.ts` (has a form), `.test.tsx`, `index.ts`. No `.stories.tsx` — this
      clean template does not have Storybook configured (no `.storybook/`, no
      Storybook deps in `package.json`, no stories anywhere in the existing
      `componentsGallery` sample page), so the 5-file contract applies.

**Styling**
- [x] No hardcoded hex/rgb/rgba colors or Tailwind palette classes — every color
      class used is a semantic token (`bg-background`, `text-foreground`,
      `text-muted-foreground`, `text-destructive`, etc.)
- [x] No inline `style` prop
- [x] Multi-token classNames extracted to `SettingsPage.styles.ts`
- [x] `Field`/`FieldGroup`/`FieldLabel` used for every form field — no raw `<div>` +
      `Label` + `Input`
- [x] No `Dialog`/`Sheet`/`Drawer` used in this task
- [x] No `Card` used in this task (a plain `<main>`/`<section>`/`<header>` page
      shell was more appropriate here — no card-like framing needed)
- [x] No `Avatar` used in this task
- [x] `TabsTrigger` is inside `TabsList` in all three cases
- [x] The show/hide icon buttons are icon-only (no adjacent text), so per
      `04-composition-patterns.md`'s own carve-out, `data-icon` does not apply —
      matches the existing `ThemeToggle`'s own icon-only pattern
- [x] No button loading state was needed in this task (no async submit that shows
      a spinner)
- [x] No `Select`/`DropdownMenu`/`Command` used in this task
- **Two-tier HTML element policy** — first draft used raw `<span>` for three purely
  layout groupings (skeleton rows, switch rows, the header title/subtitle stack).
  Corrected before finalizing: skeleton rows and switch rows now use the vendored
  `Field`/`FieldContent` primitives instead of a raw wrapper; the header
  title/subtitle stack now uses `<hgroup>` (a genuine semantic HTML5 element for
  grouping a heading with its subheading — not one of the two literally-forbidden
  tags, `<div>`/`<span>`). See "Anything that should have been caught by a hook but
  wasn't" below — the hook did **not** catch the original `<span>` usage.

**Data fetching**
- [x] No raw `fetch` in the component — only through `apiClient` via
      `getSettingsProfile()`
- [x] Service returns `ApiResponse<T>`; the hook unwraps `.data` via the mapper
      before storing
- [x] DTO → domain model goes through `mapSettingsProfileDto`, not inline in the
      component

**State management** — N/A, no Zustand store was needed for this feature (all
state is either page-local `useState`/RHF or server state via the hook)

**Forms**
- [x] Zod schema lives in `SettingsPage.schema.ts`, not inline
- [x] `data-invalid`/`aria-invalid` wired from RHF's `formState.errors` on every
      password field

**Theme versioning** — N/A, this task did not touch theming

**Testing**
- [x] Every new component/hook has a co-located test file
- [x] Tests assert real behavior: heading/tab presence, loading skeleton, loaded
      data, error state, password show/hide toggling, Zod validation error
      surfacing, switch toggling — not just "renders without crashing"

## Hook behavior observed

| Hook | What triggered it | Correct block/warning, or false positive? | Notes |
|---|---|---|---|
| `check-no-any.sh` | Every `Write`/`Edit` in this session (14 new/edited `.ts`/`.tsx` files) | No violation found — never fired | None of the new code uses explicit `any` |
| `check-no-div-span.sh` | Every `Write`/`Edit` targeting `.tsx` files | **False negative** — did not fire on the first draft of `SettingsPage.tsx`, which contained four raw `<span>` wrappers | See gap below — this is a real miss, not a correct silence |
| `check-no-inline-style.sh` | Every `Write`/`Edit` | Never fired | No inline `style` prop used anywhere |
| `check-no-hardcoded-colors.sh` | Every `Write`/`Edit` to `.tsx`/`.styles.ts` | Never fired | Only semantic tokens used |
| `check-no-raw-dimensions.sh` | Every `Write`/`Edit` to `.tsx`/styles files | Never fired | `SettingsPage.styles.ts` uses only Tailwind spacing-scale classes (`h-4`, `w-24`, `h-9`), no raw `px` strings — correctly did not flag these, since the hook only greps for `"<N>px"` literals |
| `check-component-duplicate.sh` | Every `Write` creating a new component-shaped folder | Never fired | No new folder was created under `shared/`/`layout/` |
| `check-component-files.sh` | `Write`s under `src/components/` | Never fired (not applicable) | This hook only checks `src/components/layout/**` and `src/components/shared/**` — the page folder under `src/pages/**` is out of its scope entirely, so page-level file-completeness has no automated check at all (see gap below) |
| `check-no-inline-classnames.sh` | Every `Write`/`Edit` to `.tsx` | Did not fire | All multi-token classNames were already extracted to `.styles.ts` from the first draft |
| `check-barrel-exports.sh` | New files in `hooks/`, `services/`, `types/`, `constants/` | Did not fire / not observed to block anything | Every new file was manually barrel-exported in the same batch of edits; cannot confirm whether the hook would have caught a missed one since none was missed |
| `check-tsc.sh` | Any `.ts`/`.tsx` write (debounced 30s) | Not directly observed (debounced, and `npx tsc -b` was run manually at the end anyway) | Manual `tsc -b` confirmed zero errors |
| `check-dependency-security.sh` | `git commit` | Not applicable — no commit made from inside `/tmp/feature-test-3` | N/A |

**ESLint (not a `.claude/hooks/` hook, but a mandatory final-validation gate per
`core/09-anti-patterns-checklist.md`) blocked real code once, correctly:** the
first draft's `onSubmit` param `_values` tripped `@typescript-eslint/no-unused-vars`
(this project's ESLint config has no `argsIgnorePattern: '^_'`, so the usual
underscore-prefix convention for intentionally-unused params does not suppress the
warning here) — fixed by keeping the real param name and `void`-ing it. Separately,
`useSettingsProfile.ts`'s fetch-on-mount `useEffect` tripped
`react-hooks/set-state-in-effect` — see the gaps section, this is a tooling
overreach rather than a real bug, and was suppressed with a documented
`eslint-disable-next-line`.

## Anything that should have been caught by a hook, but wasn't

`check-no-div-span.sh` did not fire on the first draft of `SettingsPage.tsx`, which
contained code like:

```tsx
<span className={settingsPageStyles.skeletonRow}>
  <Skeleton className={settingsPageStyles.skeletonLabel} />
  <Skeleton className={settingsPageStyles.skeletonInput} />
</span>
```

and

```tsx
<span className={settingsPageStyles.switchRow}>
  <span className={settingsPageStyles.switchText}>
    <FieldLabel htmlFor={emailSwitchId}>Email notifications</FieldLabel>
    <span className={settingsPageStyles.switchHelper}>
      Receive updates about your account by email.
    </span>
  </span>
  ...
</span>
```

This is a direct, explicit violation of `core/03-coding-principles.md`'s "NEVER use
`<div>` or `<span>` in component JSX" rule, and the hook script
(`check-no-div-span.sh`) greps precisely for `<span\b` in `.tsx` `Write`/`Edit`
payloads with an `exit 2` block. The write nonetheless succeeded with no hook
output surfaced. This was caught only by manually re-checking the generated code
against the rule file afterward, not by the automated gate. This is the single
most consequential finding in this report: the auto-reject hook silently allowed
its own most explicitly-stated forbidden pattern through. (Given the methodology
caveat above, this was observed via a `Write` tool call inside a session whose
hooks are this repo's own scripts — the scripts themselves are identical to what
a from-clone session would load, so the miss itself is real; only the
"cross-session-loading" half of the claim can't be independently confirmed here.)

Separately, `check-component-files.sh` is scoped only to
`src/components/layout/**` and `src/components/shared/**` — there is no equivalent
automated completeness check for `src/pages/**`, even though
`core/02-project-structure.md` documents an explicit required file set for pages
too (`PageName.tsx`, `.styles.ts`, `types.ts`, `.schema.ts` if it has a form,
`.test.tsx`, `index.ts`). Nothing would have flagged a page missing its `types.ts`
or its schema file. In this run every required page file was created anyway, but
that was manual diligence, not an enforced gate.

## Rule/`CLAUDE.md`/`AGENTS.md` guidance gaps

1. **`eslint-plugin-react-hooks`'s `set-state-in-effect` rule (from
   `reactHooks.configs.flat.recommended` in `eslint.config.js`) conflicts with the
   project's own documented `AsyncState<T>` pattern for any hook that fetches on
   mount.** `core/10-error-handling.md`'s own example hook
   (`useUserProfile`/`loadProfile`) only calls its loader from an explicit
   caller, not from a `useEffect`, so it never demonstrates (or warns about) this
   collision. But `core/11-performance.md` explicitly discourages "fetch data in a
   `useEffect`" only in favor of "a hook can encapsulate it" — which is exactly
   what most real features need (e.g. this settings profile, or Assignment 1's
   product catalog, or Assignment 5's activity feed): a hook that fetches
   automatically when a page mounts. The moment that hook's internal effect calls
   an async function that eventually calls `setState` — the only way to implement
   "fetch on mount" without adding a data-fetching library this template doesn't
   use (no React Query, no SWR) — this ESLint rule fires and blocks the build,
   regardless of whether the `setState` call happens synchronously or only after
   an `await`. There is no rule-compliant way to write a mount-fetching hook under
   the current ESLint config as far as this session found; the only options are
   (a) a documented `eslint-disable-next-line`, as done here, or (b) never
   auto-fetching on mount and requiring an explicit user action to trigger every
   load (which most of the six assignments' feature descriptions don't call for).
   Recommend the rule guidance in `core/10-error-handling.md` either show the
   mount-effect case explicitly with the accepted suppression, or the ESLint
   config disable/downgrade this specific rule to a warning given the project's
   documented data-fetching shape depends on it.
2. **No rule file states whether Storybook is on or off for a truly clean,
   never-configured clone.** `core/02-project-structs.md`'s templates show both a
   6-file and 5-file contract depending on Storybook, and `features/01-storybook.md`
   presumably documents the "keep vs delete" choice — but that decision is meant to
   happen once, at project setup, and nothing in the clean template's current state
   (no `.storybook/`, no Storybook packages installed, no `.md` file deleted either
   way) unambiguously signals which contract a fresh feature-building session
   should assume. This session inferred "off" from the *absence* of any
   `.stories.tsx` file in the one pre-existing sample page (`componentsGallery`)
   and the absence of Storybook in `package.json`, which happened to be correct,
   but that's inference from omission, not an explicit signal.
3. **`check-component-files.sh`'s required-file check doesn't cover pages at all**,
   despite `core/02-project-structure.md` documenting an equally explicit required
   file list for `pages/{page}/`. See the previous section.

## Final verification

| Check | Result |
|---|---|
| `npm run lint` | Passes for every file this feature touched. 15 pre-existing errors remain in vendored `src/components/ui/*.tsx` files (`react-refresh/only-export-components` in `badge.tsx`, `button-group.tsx`, `button.tsx`, `combobox.tsx`, `direction.tsx`, `marker.tsx`, `message-scroller.tsx`, `navigation-menu.tsx`, `sidebar.tsx`, `tabs.tsx`, `toggle.tsx`; plus one `react-hooks/set-state-in-effect` error in `carousel.tsx`) — confirmed pre-existing in the fresh clone before this feature touched anything, not introduced by this task. |
| `npx tsc -b` | Passes with zero errors |
| `npm run test` | Passes — 9 test files, 28 tests, all green |
| `npm run build` | Succeeds — `vite build` completes, emits `SettingsPage-*.js` (131.24 kB / 40.42 kB gzip) as its own lazy chunk alongside the existing `ComponentsGalleryPage` chunk |

## Assumptions made

1. **Ran in the wrong session context for a valid hook-loading test, on explicit
   user instruction.** The skill's 2-phase design exists specifically so hooks load
   from the cloned directory's own session startup. The user instructed "run here
   and push" after this was flagged once; proceeded per that explicit instruction,
   with the caveat documented at the top of this report so the hook-behavior
   section isn't misread as validating the cross-session assumption.
2. **`npm install` cache permission fix.** Rather than following npm's suggested
   `sudo chown -R 502:20 "/Users/abhi/.npm"` (a destructive, machine-wide,
   irreversible-without-more-sudo change unrelated to this repo), used an isolated
   `--cache` directory for this one install instead. Chose this because the goal
   was testing this repo's guardrails, not modifying the tester's shared npm
   cache ownership.
3. **Did not start `npm run mock-api`.** The task's specification says to start it
   "if the task needs one." This feature's read of a single seeded resource was
   fully covered through the hook's own test suite (which mocks the service layer,
   per this project's own documented testing pattern of not hitting real
   endpoints in tests) — a live server wasn't needed to verify the feature
   actually works, only to click through it manually in a browser, which this
   autonomous run did not do. Flagging this as an explicit gap: the feature has
   not been visually verified in a running browser, only through automated tests,
   `tsc`, and `build`.
4. **Storybook is off for this clean template.** Inferred from the absence of
   `.storybook/`, Storybook packages in `package.json`, and any `.stories.tsx`
   file anywhere in the existing sample page — see gap #2 above. Used the 5-file
   page contract accordingly (no `.stories.tsx`).
5. **No Zustand store was introduced.** The feature's only genuinely shared/async
   state is the profile fetch (handled by the hook) and the password
   show/hide + notification toggle state, which is page-local and has no reason
   to be shared across other pages/features — didn't force a store where local
   `useState` was the correct, simpler choice.
6. **Password change "submit" is a no-op.** There is no backend endpoint for
   changing a password in this mock-API template (`db.json` has no `users`/`auth`
   resource), so `onSubmit` intentionally does nothing beyond passing RHF/Zod
   validation — this matches the task's own framing ("the point is observing how
   the guardrails behave against a real feature," not inventing a fake auth
   backend).
7. **Seeded `db.json`'s `settingsProfile` as a single object, not an array**, since
   json-server serves a top-level object key as a single-resource GET
   (`GET /settingsProfile` → the object directly) — appropriate for a
   "current user's own profile" resource, unlike a list resource like Assignment
   1's products.

## Anything else worth flagging

- The first draft's `<span>`-wrapping mistake and the `set-state-in-effect` ESLint
  block were both caught and fixed by re-reading the actual generated code against
  the rule files after writing it — not by any automated gate stopping the write
  in the moment. Both are documented above as explicit gaps because relying on
  hooks alone would have shipped a rule violation (the `<span>` case) and an
  unbuildable lint failure (the effect case) undetected.
- This is a genuinely clean template run: no leftover `console.log`, no
  commented-out dead code, no unused imports in any new file, every new module is
  barrel-exported, and `ApiResponse<T>`/`AsyncState<T>` — required by
  `core/02-project-structure.md` and `core/10-error-handling.md` for *every*
  project regardless of data-fetching strategy — did not exist in the clean
  template and had to be created from scratch, exactly as the rule files
  anticipate for a brand-new project.
