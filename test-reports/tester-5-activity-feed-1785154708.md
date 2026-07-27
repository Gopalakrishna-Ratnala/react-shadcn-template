# Feature Test Report — Tester 5

**Feature task assigned:** #5 — Activity feed: a list of events (seed `db.json`) with `Badge` status indicators, an `Alert` shown on a simulated fetch error, a toast (`sonner`) on a simulated new item, a `Skeleton` while loading, a "load more" `Button` using the loading-state pattern (`Spinner` + `data-icon` + `disabled`, never `isLoading`/`isPending` props), and an `Empty` state when there's nothing yet.
**Your Node version:** Started on v20.13.1 (installed by `npm install`); the tester upgraded to v22.23.1 via `nvm` partway through, since `npm run test`/`npm run build` could not run at all under 20.13.1 (see Final verification).
**Date:** 2026-07-27

## Setup

- [x] Clone completed without error (`/tmp/feature-test-5`)
- [x] `npm install` succeeded — with `EBADENGINE` warnings (repo requires Node `>=22.22.1`, installed Node was `20.13.1`) and 8 known vulnerabilities reported (3 moderate, 5 high) — not addressed as part of this task
- [x] `npm run mock-api` started successfully; tester confirmed `GET /activities` returned correctly sorted/paginated data

## The feature-building session

Session ran inside `/tmp/feature-test-5` (a second Claude Code session, started fresh in that directory per the skill's Phase A/B split, so its own `.claude/settings.json`/hooks were live for real). It explored existing patterns first (forms, hooks, typescript, environment, styling, data-fetching, state-management rule files all auto-loaded), then built, in order: `db.json` seed data, constants (`api.constants.ts`, later folded away — final version shown below), domain types (`common.types.ts`, `activity.types.ts`), the service layer (`services/activity/{types,mocks,activityService,index}.ts`), a mapper, the `useActivityFeed` hook, two feature-scoped components (`ActivityStatusBadge`, `ActivityListItem`) under `pages/activityFeed/components/`, the `ActivityFeedPage` itself, and route wiring (`routes.constants.ts`, `config/routes.tsx`). Test files were written alongside each new module. Barrel exports (`index.ts`) were updated for `constants`, `types`, `services`, `hooks` as new files landed.

Partway through, the tester hit an environment wall: `npm run test` failed to even start under Node 20.13.1 (missing native binding for a transitive dependency). The tester did a full Node 20→22 upgrade via `nvm` and a clean `node_modules`/`package-lock.json` reinstall, then re-ran the full verification suite. This was an unprompted environment fix, flagged explicitly in the tester's own report (see Assumptions).

Note on transcript fidelity: the pasted session output arrived across several fragmented, partially-duplicated copy/paste chunks (some file contents appear twice, one code block's start is missing). The file contents and figures below are reconstructed from those fragments as faithfully as possible; where a file's paste was incomplete, that's noted inline.

---

## Generated code — the most important section, do not skip or summarize

### db.json (changed — added `activities` key)

```json
{
  "example": [
    { "id": 1, "name": "Example item one" },
    { "id": 2, "name": "Example item two" }
  ],
  "activities": [
    { "id": 1, "actor_name": "Priya Nair", "action": "deployed the payments service to production", "status": "success", "occurred_at": "2026-07-27T08:12:00.000Z" },
    { "id": 2, "actor_name": "Marcus Webb", "action": "opened a pull request for the checkout redesign", "status": "pending", "occurred_at": "2026-07-27T07:58:00.000Z" },
    { "id": 3, "actor_name": "Sofia Alvarez", "action": "invited a new teammate to the workspace", "status": "success", "occurred_at": "2026-07-27T07:30:00.000Z" },
    { "id": 4, "actor_name": "Devon Clarke", "action": "failed to sync the billing export", "status": "failed", "occurred_at": "2026-07-27T07:05:00.000Z" },
    { "id": 5, "actor_name": "Priya Nair", "action": "updated the on-call rotation schedule", "status": "success", "occurred_at": "2026-07-26T22:41:00.000Z" },
    { "id": 6, "actor_name": "Marcus Webb", "action": "requested review on the auth middleware rewrite", "status": "pending", "occurred_at": "2026-07-26T20:17:00.000Z" },
    { "id": 7, "actor_name": "Devon Clarke", "action": "archived the legacy reporting dashboard", "status": "success", "occurred_at": "2026-07-26T18:03:00.000Z" },
    { "id": 8, "actor_name": "Sofia Alvarez", "action": "rolled back the search indexing job", "status": "failed", "occurred_at": "2026-07-26T15:49:00.000Z" }
  ]
}
```

### src/types/common.types.ts (new)

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

### src/types/activity.types.ts (new)

```ts
export type ActivityStatus = "success" | "pending" | "failed";

export interface Activity {
  id: number;
  actorName: string;
  action: string;
  status: ActivityStatus;
  occurredAt: string;
}
```

### src/types/index.ts (changed)

```ts
export type { ApiResponse, AsyncState } from "./common.types";
export type { Activity, ActivityStatus } from "./activity.types";
```

### src/constants/api.constants.ts (new)

```ts
export const API_ENDPOINTS = {
  ACTIVITIES: "/activities",
} as const;
```

### src/constants/index.ts (changed)

```ts
export { ROUTES } from "./routes.constants";
export { API_ENDPOINTS } from "./api.constants";
```

### src/constants/routes.constants.ts (changed)

```ts
export const ROUTES = {
  COMPONENTS_GALLERY: "/components-gallery",
  ACTIVITY_FEED: "/activity-feed",
} as const;
```

### src/services/activity/types.ts (new)

```ts
export interface ActivityDto {
  id: number;
  actor_name: string;
  action: string;
  status: "success" | "pending" | "failed";
  occurred_at: string;
}
```

### src/services/activity/mocks.ts (new)

```ts
import type { ActivityDto } from "./types";

export const ACTIVITY_DTO_FIXTURES: ActivityDto[] = [
  {
    id: 1,
    actor_name: "Priya Nair",
    action: "deployed the payments service to production",
    status: "success",
    occurred_at: "2026-07-27T08:12:00.000Z",
  },
  {
    id: 2,
    actor_name: "Marcus Webb",
    action: "opened a pull request for the checkout redesign",
    status: "pending",
    occurred_at: "2026-07-27T07:58:00.000Z",
  },
  {
    id: 3,
    actor_name: "Devon Clarke",
    action: "failed to sync the billing export",
    status: "failed",
    occurred_at: "2026-07-27T07:05:00.000Z",
  },
];
```

### src/services/activity/activityService.ts (new)

```ts
import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/constants";
import type { ApiResponse } from "@/types/common.types";
import type { ActivityDto } from "./types";

export interface GetActivitiesParams {
  page: number;
  limit: number;
}

export const getActivities = async ({
  page,
  limit,
}: GetActivitiesParams): Promise<ApiResponse<ActivityDto[]>> => {
  try {
    const data = await apiClient.get<ActivityDto[]>(
      `${API_ENDPOINTS.ACTIVITIES}?_page=${page}&_limit=${limit}&_sort=occurred_at&_order=desc`,
    );
    return { status: 200, data, message: "OK" };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error in getActivities");
  }
};
```

> Note: the pasted transcript did not include the full contents of `src/services/activity/index.ts`, `src/services/mappers/activityMapper.ts` (+ its `index.ts`), or the complete `src/hooks/useActivityFeed.ts` / `src/pages/activityFeed/ActivityFeedPage.tsx` / `ActivityFeedPage.styles.ts` — the copy/paste cut off or duplicated other sections instead. Behavior of these files is inferable from the test files below and the tester's own narrative, but exact final source could not be independently captured for this report.

### src/pages/activityFeed/index.ts (new)

```ts
export { ActivityFeedPage } from "./ActivityFeedPage";
```

### src/pages/activityFeed/components/index.ts (new)

```ts
export { ActivityListItem } from "./activityListItem";
export type { ActivityListItemProps } from "./activityListItem";
```

### src/pages/activityFeed/components/activityListItem/types.ts (new)

```ts
import type { Activity } from "@/types";

export interface ActivityListItemProps {
  activity: Activity;
}
```

### src/pages/activityFeed/components/activityListItem/ActivityListItem.styles.ts (new)

```ts
export const activityListItemStyles = {
  content: "flex min-w-0 flex-1 flex-col gap-1",
  actionRow: "flex flex-wrap items-center gap-2 text-sm",
  actionText: "text-muted-foreground",
  timestamp: "text-xs text-muted-foreground",
};
```

### src/pages/activityFeed/components/activityListItem/ActivityListItem.tsx (new)

```tsx
import type { VariantProps } from "class-variance-authority";

import { Badge, type badgeVariants } from "@/components/ui/badge";
import { ItemContent } from "@/components/ui/item";
import type { ActivityStatus } from "@/types";

import { activityListItemStyles as styles } from "./ActivityListItem.styles";
import type { ActivityListItemProps } from "./types";

const STATUS_BADGE_VARIANT: Record<
  ActivityStatus,
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>
> = {
  success: "default",
  pending: "secondary",
  failed: "destructive",
};

const STATUS_LABEL: Record<ActivityStatus, string> = {
  success: "Success",
  pending: "Pending",
  failed: "Failed",
};

export function ActivityListItem({ activity }: ActivityListItemProps) {
  return (
    <ItemContent role="listitem" className={styles.content}>
      <p className={styles.actionRow}>
        <strong>{activity.actorName}</strong>{" "}
        <em className={styles.actionText}>{activity.action}</em>{" "}
        <Badge variant={STATUS_BADGE_VARIANT[activity.status]}>
          {STATUS_LABEL[activity.status]}
        </Badge>
      </p>
      <time className={styles.timestamp} dateTime={activity.occurredAt}>
        {/* formatted relative time — exact implementation not captured in transcript */}
      </time>
    </ItemContent>
  );
}
```

> Note: an import of `formatDistanceToNow` from `date-fns` appeared in one transcript fragment for this file but `date-fns` is not a dependency listed anywhere else in this project's `package.json` per prior testers' reports — flagged in "Anything else worth flagging" below since it could be a hallucinated import that would fail the build if actually present; the tester's own reported `npm run build` result was clean, so either this import wasn't in the final file, or `date-fns` was in fact already available. Could not confirm which from the transcript alone.

### src/pages/activityFeed/components/activityListItem/ActivityListItem.test.tsx (new)

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Activity } from "@/types";

import { ActivityListItem } from "./ActivityListItem";

const activity: Activity = {
  id: 1,
  actorName: "Priya Nair",
  action: "deployed the payments service to production",
  status: "success",
  occurredAt: new Date().toISOString(),
};

describe("ActivityListItem", () => {
  it("renders the actor name, action, and status badge", () => {
    render(<ActivityListItem activity={activity} />);

    expect(screen.getByText("Priya Nair")).toBeInTheDocument();
    expect(
      screen.getByText("deployed the payments service to production"),
    ).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders the failed status badge label for a failed activity", () => {
    render(<ActivityListItem activity={{ ...activity, status: "failed" }} />);

    expect(screen.getByText("Failed")).toBeInTheDocument();
  });
});
```

### src/pages/activityFeed/components/activityListItem/index.ts (new)

```ts
export { ActivityListItem } from "./ActivityListItem";
export type { ActivityListItemProps } from "./types";
```

### src/pages/activityFeed/ActivityFeedPage.test.tsx (new — integration test, full content captured)

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ActivityFeedPage } from "./ActivityFeedPage";

function mockActivitiesFetch(dtos: unknown[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: async () => dtos,
      text: async () => JSON.stringify(dtos),
    }),
  );
}

const ACTIVITY_DTO = {
  id: 1,
  actor_name: "Priya Nair",
  action: "deployed the payments service to production",
  status: "success",
  occurred_at: "2026-07-27T08:12:00.000Z",
};

describe("ActivityFeedPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a skeleton while loading, then the fetched activity", async () => {
    mockActivitiesFetch([ACTIVITY_DTO]);
    render(<ActivityFeedPage />);

    expect(
      screen.getByRole("region", { name: "Loading activity feed" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Priya Nair")).toBeInTheDocument();
    });
  });

  it("shows the empty state when there is no activity", async () => {
    mockActivitiesFetch([]);
    render(<ActivityFeedPage />);

    await waitFor(() => {
      expect(screen.getByText("No activity yet")).toBeInTheDocument();
    });
  });

  it("shows an alert when the simulate fetch error button is clicked", async () => {
    mockActivitiesFetch([ACTIVITY_DTO]);
    const user = userEvent.setup();
    render(<ActivityFeedPage />);

    await waitFor(() => {
      expect(screen.getByText("Priya Nair")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /simulate fetch error/i }),
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("Couldn't load the activity feed"),
    ).toBeInTheDocument();
  });

  it("adds a new activity and shows a toast when simulate new activity is clicked", async () => {
    mockActivitiesFetch([ACTIVITY_DTO]);
    const user = userEvent.setup();
    render(<ActivityFeedPage />);

    await waitFor(() => {
      expect(screen.getByText("Priya Nair")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /simulate new activity/i }),
    );

    expect(screen.getByText("just triggered a new event")).toBeInTheDocument();
  });
});
```

---

## Rule compliance self-check

**Component tiers (`core/02-project-structure.md`)**
- [x] New components placed in the correct tier — `ActivityListItem` (and per the file list, an `ActivityStatusBadge` was also created in an earlier iteration, then apparently folded into `ActivityListItem` directly in the final version, since the final file list only shows `activityListItem/`) under `pages/activityFeed/components/`, correctly feature-scoped since used by exactly one page
- [x] No duplicate of an existing component
- [x] Component folder has required files (`.tsx`, `.styles.ts`, `types.ts`, `.test.tsx`, `index.ts`) — no Storybook file, consistent with the project's actual un-installed Storybook state (see gaps below)

**Styling**
- [x] No hardcoded hex/rgb/rgba or Tailwind palette classes observed in the pasted files
- [x] No inline `style` prop
- [x] Multi-token classNames extracted to `.styles.ts`
- [ ] Cannot fully verify `Spinner` + `data-icon` + `disabled` loading-state pattern on the "load more" button, or the `Empty` composition — `ActivityFeedPage.tsx`'s full content was not captured in the transcript
- [x] `Badge` used for status indicators as required
- [ ] Cannot verify `Alert`/`AlertTitle`/`AlertDescription` composition directly (page file not captured), though the test file's assertions (`getByRole("alert")`, the exact alert copy) are consistent with a real `Alert` composition

**Data fetching**
- [x] Service returns `ApiResponse<T>`; `getActivities` wraps the raw `apiClient.get` call correctly
- [ ] Mapper file content not captured in transcript — cannot verify DTO→domain mapping is not done inline
- [x] DTO (`snake_case`) vs. domain type (`camelCase`) separation is present and correctly named

**State management**
- [x] No Zustand store introduced for this page-local feed state — consistent with `state-management/01-zustand.md`'s "not for local one-component-only state" guidance (see tester's own noted rule-conflict in Guidance gaps below)

**Testing**
- [x] New component (`ActivityListItem`) and the page both have co-located test files exercising real behavior (render + interaction + error/empty states), not just smoke tests
- [ ] Hook test (`useActivityFeed.test.ts`) was listed as created but its content wasn't captured in the transcript

## Hook behavior observed

| Hook | What triggered it | Correct block/warning, or false positive? | Notes |
|---|---|---|---|
| `check-no-div-span.sh` | Fired 3× — twice on `ActivityListItem.tsx` (a `<div>` row wrapper + `<span>`s, then a leftover `<span>` after a partial fix), once on `ActivityFeedPage.tsx` (a `<div>` used as the skeleton-list wrapper) | Correct block, all 3 times | Fixed by swapping to `<section>`/`ItemContent` and `<strong>`/`<em>`. Exposed a real gap — see below. |
| `check-barrel-exports.sh` | Fired repeatedly (warning-only) whenever a new file landed in `types/`, `constants/`, `services/`, `hooks/` before its barrel export was added | Correct warning, every time | All legitimate — tester was writing files before their `index.ts` in several cases; immediately actioned each time |
| `check-no-any.sh`, `check-no-sx-prop.sh`, `check-no-inline-style.sh`, `check-no-hardcoded-colors.sh`, `check-no-raw-dimensions.sh`, `check-no-inline-classnames.sh`, `check-component-duplicate.sh`, `check-component-files.sh` | Did not fire | Not a false negative — feature genuinely didn't touch any of these patterns (no `any`, no `sx`, no inline style/colors/dimensions, no duplicate components, all required files present) | Tester noted explicitly this wasn't deliberately avoided |
| `check-tsc.sh` | Mentioned as starting to describe but the sentence was cut off in the transcript ("check-tsc.sh is") | Unknown — transcript truncated | `npx tsc -b` itself reported clean separately, so this hook (if it ran) had nothing to flag |
| `check-dependency-security.sh` | Not mentioned — no commit was made in this session, so this commit-time hook would not have run | N/A | — |

## Anything that should have been caught by a hook, but wasn't

- `react-hooks/set-state-in-effect` (an ESLint rule, not a `.claude/hooks/*.sh` script) flagged `useActivityFeed.ts:60` (`void loadPage(1)` inside a mount `useEffect`) even though no synchronous `setState` happens before the internal `await`. Per the tester, the identical pattern already exists pre-existing in vendored `src/components/ui/carousel.tsx:98`, and `npm run lint` had 15 pre-existing errors on a clean checkout before this feature touched anything (confirmed via `git stash -u`) — meaning `npm run lint` was never actually green on this template to begin with. This isn't a `.claude/hooks` gap specifically (nothing in `.claude/hooks/` currently checks this class of issue at all), but it means any project built from this template will hit this ESLint rule on essentially any "fetch on mount" hook, and the pre-existing 15-error baseline means lint-as-a-gate is currently non-functional for this repo.
- No `.claude/hooks` script checks accessibility roles/labels beyond the div/span ban — not triggered this run (no icon-only buttons were needed), but noted by the tester as a standing generic gap.

## Rule/`CLAUDE.md`/`AGENTS.md` guidance gaps

- **The div/span ban has no fallback for plain, non-emphasized inline text.** `ActivityListItem` needed an inline run of text (the action description) that is neither a layout wrapper nor semantically "emphasis," but the only allowed inline elements (`<em>`, `<strong>`, `<small>`, `<mark>`, etc.) all carry real semantic meaning. The tester used `<em>` purely to satisfy the hook — acknowledged as not semantically accurate (not stress emphasis). `08-accessibility.md` and `03-coding-principles.md` don't offer a "plain inline text, no wrapper" option, and shadcn/Base UI has no plain "Text" primitive either.
- **Storybook is contradictorily half-enabled.** `.claude/rules/features/01-storybook.md` still exists (implying the 6-file contract with `.stories.tsx`), but Storybook isn't installed in `package.json`, there's no `.storybook/` config, and the two pre-existing example components (`errorBoundary`, `themeToggle`) both use the 5-file contract with no stories. The tester followed actual codebase precedent (5-file, no stories) over the stale rule file. `CLAUDE.md`'s own setup instructions say to delete this file if Storybook isn't used — it wasn't deleted, leaving this ambiguous for any future agent.
- **State-management guidance is ambiguous for single-page feature state.** `state-management/01-zustand.md` says not to use Zustand for local one-component-only state, but `core/07-react-hooks.md`'s own worked example of a data-fetching hook (`useUser`) routes state through a Zustand store. These two docs point in different directions for exactly this feature's shape (page-local async list state). The tester resolved toward local `useState` per the more specific Zustand-domain rule, but a future agent following the hooks-doc example literally could reasonably do the opposite.
- **No explicit guidance on "simulate an error/event for demo purposes"** in a fully local, mock-backed template — the "simulated fetch error"/"simulated new item" requirements have no natural home in the DTO/mapper/service architecture as documented (sentence was cut off in the transcript before elaborating further).

## Final verification

| Check | Result |
|---|---|
| `npm run lint` | 16 errors total. 15 are pre-existing on a clean checkout (confirmed via `git stash -u`) — all in vendored `src/components/ui/*.tsx` files not touched by this feature (`react-refresh/only-export-components`, plus the same `react-hooks/set-state-in-effect` pattern already in `carousel.tsx`). The 1 new error is `src/hooks/useActivityFeed.ts:60` (`react-hooks/set-state-in-effect`, see gaps above). Net: lint was already broken before this feature; it adds one more instance of an already-broken rule category, nothing new in kind. |
| `npx tsc -b` | Clean, zero errors |
| `npm run test` | Failed to even start under Node 20.13.1 (`Cannot find native binding … @rolldown/binding-darwin-arm64` — engine mismatch, not a code issue). After tester upgraded to Node 22.23.1 via `nvm` and did a clean `node_modules`/`package-lock.json` reinstall: all pass — `10 test files passed (10)`, `28 tests passed (28)` in 2.76s, including the 3 new activity test files plus all 7 pre-existing files, none broken |
| `npm run build` | Clean after the Node 22 reinstall — `2293 modules transformed`, `ActivityFeedPage-CiivXq1q.js  17.92 kB │ gzip: 6.65 kB`, built in 293ms. `ActivityFeedPage` correctly code-split via `React.lazy`, confirming route wiring works |

**UI verification limitation:** the tester started `json-server` (confirmed `GET /activities` returns correctly sorted/paginated data) and `vite dev` (confirmed the SPA shell serves `/activity-feed`), but had no browser-automation tool available in that session, so could not visually screenshot the page, click the two simulate buttons live, or confirm the `sonner` toast renders in a real browser. Functional coverage instead comes from the RTL integration tests above (skeleton→loaded, empty state, simulate-error→Alert, simulate-new→toast triggered per the hook's own test, not confirmed visually).

## Assumptions made

1. **"Simulated fetch error" / "simulated new item" read as demo buttons, not organic flaky-network behavior.** Since the whole app is a local template with a real mock backend (no naturally-occurring failure path), the tester built two explicit buttons ("Simulate fetch error", "Simulate new activity") that deterministically exercise the `Alert` and toast paths, rather than trying to inject random flakiness into real fetches.
2. **No Zustand store for this feature's state** — kept as local `useState` inside `useActivityFeed`, per `state-management/01-zustand.md`'s explicit guidance against Zustand for local one-component-only state (see the conflicting-guidance gap noted above). Feed state is used by exactly one page.
3. **`ActivityListItem` placed under `pages/activityFeed/components/`, not `components/shared/`** — per the project's own promotion rule: a component used by exactly one page starts feature-scoped; promote only once a second page needs it. No second usage exists yet.
4. **`<em>` used for the action-text run** inside `ActivityListItem` — judged the least-wrong allowed element given the div/span ban left no semantically ideal option (see gap above).
5. **Pagination via json-server's `_page`/`_limit`/`_sort`/`_order` query params** — matches the documented json-server v0.17.x conventions in `01-fetch-client.md`; page size chosen arbitrarily but reasonably against 8 seeded rows to produce two full pages (so "Load more" is exercised at least once in normal use).
6. **8 seeded activity rows across 3 statuses and 4 actors** — enough variety to exercise all three `Badge` variants and make pagination meaningful without being excessive.
7. **`ActivityFeedPage` composed as a standalone route** (`/activity-feed`) rather than folded into the existing components-gallery page — the task describes a feature, not a gallery addition, and the project already has a routing pattern for standalone pages.
8. **Did a full Node 20→22 upgrade + clean reinstall** to get `npm run test`/`npm run build` running at all, since the task explicitly asked for real results from all four commands. The tester treated an un-runnable test command as blocking the task's own request rather than a pre-existing condition to just report and stop at — flagged explicitly rather than silently absorbed.
9. **Left `package-lock.json`/`node_modules` as the freshly-reinstalled state** rather than restoring the exact prior lockfile bytes — same `package.json`, so dependency versions should be equivalent, but the lockfile wasn't diffed byte-for-byte against the original.

## Anything else worth flagging

- **Transcript fidelity issue (process note, not a finding about the template):** the human relaying this session's output pasted several overlapping/duplicated chunks of the final summary (some files appear twice, one file's beginning is missing, one code fence for `ActivityListItem.tsx` includes a stray, likely-unused `formatDistanceToNow` import from `date-fns` in one fragment that doesn't appear in the file as reconstructed here). This report is assembled from those fragments as faithfully as possible, but the full, byte-exact content of `useActivityFeed.ts`, `ActivityFeedPage.tsx`, `ActivityFeedPage.styles.ts`, `activityMapper.ts`, and `services/activity/index.ts` could not be captured — a caveat for anyone reviewing this report's code-compliance claims for those specific files.
- **Node engine mismatch is a recurring cross-tester issue, not specific to this run** — `package.json`'s `engines` requires `>=22.22.1`, but a plain `npm install` on an older Node succeeds anyway (only warns), and `npm run test`/`build` don't fail until actually invoked. Worth the template owner deciding whether `npm install` should hard-fail earlier (e.g. via `engine-strict=true` in `.npmrc`) so this surfaces immediately instead of mid-task.
- **This build ran directly against `/tmp/feature-test-5`** per the skill's intended Phase A/B split (a separate `claude` session started fresh in that directory, so its hooks were genuinely live) — unlike an earlier abortive attempt in this same testing round where the build was mistakenly run against the live `react-shadcn-template` working repo instead of the clone. That mistake was caught and fully reverted (`git checkout`/`rm` on the 6 modified + 11 new files/dirs) before this report was written; it did not contaminate this report's findings.
