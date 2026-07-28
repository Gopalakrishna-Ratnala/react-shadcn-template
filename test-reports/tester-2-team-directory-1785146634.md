# Feature Test Report — Tester 2

**Feature task assigned:** Assignment 2 — **Team directory**: a grid/list of people
(seed `db.json` if needed) with a `ToggleGroup` to switch grid/list view,
`Avatar`+`AvatarFallback` per person, and a `Dialog` showing member detail on click
(must have a `DialogTitle`, `sr-only` if visually hidden). Stresses Zustand (view-mode
toggle state), `Dialog` + overlay-title rule, `ToggleGroup`, `Avatar`, accessibility.

**Your Node version:** v22.14.0 (npm 10.9.2) — below `package.json`'s
`engines.node: ">=22.22.1"`. `npm install` still succeeded; only `EBADENGINE` warnings
(`react-router@8.3.0` requires `>=22.22.0`). No failure attributable to Node version.

**Date:** 2026-07-27

## ⚠️ Read this first — procedural deviation from the skill's 2-phase design

**This run did NOT use the required second session started inside the clone.** The
Phase B prompt was pasted back into the *Phase A* session, whose startup working
directory was `/Users/manjusha/Desktop/react-shadcn-template`, not
`/tmp/feature-test-2`. This was flagged to the human at the time, who chose to
proceed anyway.

Practical consequence for this report:

- `.claude/settings.json` was loaded from the **template repo**, not the clone, and
  its hook commands resolve via `$CLAUDE_PROJECT_DIR` — so the hook *scripts* that
  ran were the template repo's copies, evaluated against files written into
  `/tmp/feature-test-2/src/...`.
- Hooks **did** fire (see "Hook behavior observed") — so this run is not a total
  blank — but the results are only valid to the extent the two repos' hook scripts
  are identical, and **absence** of a hook firing here is much weaker evidence than
  it would be in a properly-scoped run. Specifically, no PreToolUse blocking hook
  fired at all this run, and that should not be read as "nothing violated anything."
- **Anyone reviewing this: treat section "Hook behavior observed" as partial.** A
  clean re-run of assignment 2 in a properly-scoped session is still worth doing.

Everything else in this report (generated code, verification results, rule gaps) is
unaffected by the deviation and is fully valid.

## Setup

- [x] Clone completed without error
- [x] `npm install` succeeded — 704 packages added; `EBADENGINE` warnings as noted
      above; **8 pre-existing vulnerabilities (3 moderate, 5 high)** reported by npm
      audit on a clean clone, before any feature code was written
- [x] `npm run mock-api` started successfully — `GET http://localhost:3001/teamMembers`
      returned `200` with the seeded roster, confirming the new `db.json` resource is
      served correctly by json-server

## The feature-building session

Order of work:

1. Read the clone's existing patterns first (`apiClient.ts`, `config/env.ts`,
   `config/routes.tsx`, the `componentsGallery` page + its feature-scoped components,
   `test/setup.ts`, `vite.config.ts`, all relevant barrels) and the vendored
   primitives to be used (`avatar.tsx`, `toggle-group.tsx`, `dialog.tsx`, `card.tsx`,
   `button.tsx`), plus the Base UI `.d.ts` files for `ToggleGroup`/`Toggle`/`DialogRoot`
   to get the real prop contracts rather than guessing them.
2. Seeded `db.json` with a `teamMembers` array (8 people, deliberately snake_case DTO
   field names so the mapper layer has real work to do; 3 of the 8 have an empty
   `avatar_url` so the `AvatarFallback` path is exercised, and 1 is inactive).
3. Created the missing core types the rules require but the template ships empty:
   `src/types/common.types.ts` (`ApiResponse<T>`, `AsyncState<T>`) and
   `src/types/teamMember.types.ts` (`TeamMember`, `TeamDirectoryViewMode`).
4. Constants: new `src/constants/api.constants.ts` (`API_ENDPOINTS.TEAM_MEMBERS`),
   added `TEAM_DIRECTORY` to `routes.constants.ts`.
5. Service layer: `src/services/teamMember/` (`types.ts` DTO, `teamMemberService.ts`
   returning `ApiResponse<TeamMemberDto[]>`, `mocks.ts` test-only fixtures, `index.ts`)
   and `src/services/mappers/teamMemberMapper.ts` (DTO → domain, derives `initials`,
   normalises empty `avatar_url` to `null`) + its test.
6. Zustand store `src/store/teamDirectory/` — initially view state only
   (`viewMode`, `selectedMemberId`).
7. Hook `src/hooks/useTeamMembers.ts` — first written as the documented
   `useState<AsyncState<T>>` + mount-effect pattern.
8. Feature-scoped components under `src/pages/teamDirectory/components/`:
   `viewModeToggle/`, `teamMemberCard/`, `teamMemberDetailDialog/` — each a full
   5-file contract (Storybook is not installed in this template).
9. Page `src/pages/teamDirectory/` (5 files incl. test), wired into
   `src/config/routes.tsx` as a lazy route, barrels updated throughout.
10. Ran `npx tsc -b` (clean) then `npm run lint` — which surfaced **1 error in my own
    code**: `react-hooks/set-state-in-effect` on the mount effect in
    `useTeamMembers.ts`. Two rewrite attempts (re-ordering so `await` came first) did
    not satisfy the rule — it tracks setState transitively, not just synchronously.
    **Resolved by moving the async fetch into the Zustand store as an async action**
    (explicitly sanctioned by `state-management/01-zustand.md`), leaving the hook as a
    thin selector + mount trigger. See "Rule guidance gaps" — this is the most
    substantive finding of the run.
11. Updated the store/hook/page tests for the new shape, re-ran everything, ran
    `prettier --write` (5 files needed formatting), verified `format:check`, `tsc -b`,
    `test`, `build` all clean, and confirmed the real json-server endpoint responds.

---

## Generated code — the most important section, do not skip or summarize

### db.json

```json
{
  "example": [
    { "id": 1, "name": "Example item one" },
    { "id": 2, "name": "Example item two" }
  ],
  "teamMembers": [
    {
      "id": 1,
      "full_name": "Priya Raghavan",
      "job_title": "Principal Engineer",
      "department": "Platform",
      "email_address": "priya.raghavan@example.com",
      "location": "Bengaluru, IN",
      "avatar_url": "https://i.pravatar.cc/160?img=47",
      "joined_on": "2019-03-11",
      "is_active": true
    },
    {
      "id": 2,
      "full_name": "Marcus Bell",
      "job_title": "Design Lead",
      "department": "Design",
      "email_address": "marcus.bell@example.com",
      "location": "Austin, US",
      "avatar_url": "https://i.pravatar.cc/160?img=12",
      "joined_on": "2020-07-06",
      "is_active": true
    },
    {
      "id": 3,
      "full_name": "Sofia Almeida",
      "job_title": "Product Manager",
      "department": "Product",
      "email_address": "sofia.almeida@example.com",
      "location": "Lisbon, PT",
      "avatar_url": "",
      "joined_on": "2021-01-18",
      "is_active": true
    },
    {
      "id": 4,
      "full_name": "Dev Patel",
      "job_title": "Staff QA Engineer",
      "department": "Quality",
      "email_address": "dev.patel@example.com",
      "location": "Pune, IN",
      "avatar_url": "https://i.pravatar.cc/160?img=33",
      "joined_on": "2018-09-24",
      "is_active": false
    },
    {
      "id": 5,
      "full_name": "Hannah Vogel",
      "job_title": "Frontend Engineer",
      "department": "Platform",
      "email_address": "hannah.vogel@example.com",
      "location": "Berlin, DE",
      "avatar_url": "",
      "joined_on": "2022-05-02",
      "is_active": true
    },
    {
      "id": 6,
      "full_name": "Kenji Watanabe",
      "job_title": "Data Engineer",
      "department": "Data",
      "email_address": "kenji.watanabe@example.com",
      "location": "Tokyo, JP",
      "avatar_url": "https://i.pravatar.cc/160?img=68",
      "joined_on": "2020-11-30",
      "is_active": true
    },
    {
      "id": 7,
      "full_name": "Amara Okonkwo",
      "job_title": "Engineering Manager",
      "department": "Platform",
      "email_address": "amara.okonkwo@example.com",
      "location": "Lagos, NG",
      "avatar_url": "",
      "joined_on": "2017-04-17",
      "is_active": true
    },
    {
      "id": 8,
      "full_name": "Tomas Nowak",
      "job_title": "UX Researcher",
      "department": "Design",
      "email_address": "tomas.nowak@example.com",
      "location": "Kraków, PL",
      "avatar_url": "https://i.pravatar.cc/160?img=15",
      "joined_on": "2023-02-13",
      "is_active": true
    }
  ]
}
```

### src/types/common.types.ts

```ts
/**
 * Envelope every service method returns. Keeps the UI insulated from whether the
 * data came from json-server or a real backend — hooks unwrap `.data` before it
 * ever reaches a component.
 */
export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
  error?: string;
}

/** Discriminated union for any async read. Prevents "loading && error && data" states. */
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

### src/types/teamMember.types.ts

```ts
/** Stable, UI-facing domain model for a person in the team directory. */
export interface TeamMember {
  id: number;
  name: string;
  title: string;
  department: string;
  email: string;
  location: string;
  /** null when the API supplied no image — AvatarFallback renders instead. */
  avatarUrl: string | null;
  /** Derived in the mapper so every consumer shows the same fallback text. */
  initials: string;
  joinedOn: string;
  isActive: boolean;
}

/** How the directory lays its members out. Persisted in the team directory store. */
export type TeamDirectoryViewMode = "grid" | "list";
```

### src/types/index.ts

```ts
export type { ApiResponse, AsyncState } from "./common.types";
export type { TeamDirectoryViewMode, TeamMember } from "./teamMember.types";
```

### src/constants/api.constants.ts

```ts
export const API_ENDPOINTS = {
  TEAM_MEMBERS: "/teamMembers",
} as const;
```

### src/constants/routes.constants.ts

```ts
export const ROUTES = {
  COMPONENTS_GALLERY: "/components-gallery",
  TEAM_DIRECTORY: "/team-directory",
} as const;
```

### src/constants/index.ts

```ts
export { API_ENDPOINTS } from "./api.constants";
export { ROUTES } from "./routes.constants";
```

### src/services/teamMember/types.ts

```ts
/**
 * Raw API shape served by json-server from db.json's "teamMembers" key.
 * This is a contract with the backend — do not reshape it for UI convenience;
 * that is the mapper's job (see services/mappers/teamMemberMapper.ts).
 */
export interface TeamMemberDto {
  id: number;
  full_name: string;
  job_title: string;
  department: string;
  email_address: string;
  location: string;
  /** Empty string when the backend has no image for this person. */
  avatar_url: string;
  joined_on: string;
  is_active: boolean;
}
```

### src/services/teamMember/teamMemberService.ts

```ts
import { API_ENDPOINTS } from "@/constants";
import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types";

import type { TeamMemberDto } from "./types";

/**
 * Fetches the full team roster from json-server. Errors surface as the
 * `ApiError` thrown by apiClient — the calling hook maps them to AsyncState.
 */
export const getTeamMembers = async (
  signal?: AbortSignal,
): Promise<ApiResponse<TeamMemberDto[]>> => {
  const data = await apiClient.get<TeamMemberDto[]>(
    API_ENDPOINTS.TEAM_MEMBERS,
    { signal },
  );

  return { status: 200, data, message: "OK" };
};
```

### src/services/teamMember/mocks.ts

```ts
import type { TeamMemberDto } from "./types";

/**
 * Test-only fixtures. Never imported by app code — runtime data comes from
 * json-server (db.json). Kept deliberately small: two members, one with an
 * avatar and one without, so the fallback path is always covered.
 */
export const teamMemberDtoFixtures: TeamMemberDto[] = [
  {
    id: 1,
    full_name: "Priya Raghavan",
    job_title: "Principal Engineer",
    department: "Platform",
    email_address: "priya.raghavan@example.com",
    location: "Bengaluru, IN",
    avatar_url: "https://i.pravatar.cc/160?img=47",
    joined_on: "2019-03-11",
    is_active: true,
  },
  {
    id: 3,
    full_name: "Sofia Almeida",
    job_title: "Product Manager",
    department: "Product",
    email_address: "sofia.almeida@example.com",
    location: "Lisbon, PT",
    avatar_url: "",
    joined_on: "2021-01-18",
    is_active: true,
  },
];
```

### src/services/teamMember/index.ts

```ts
export { getTeamMembers } from "./teamMemberService";
export { teamMemberDtoFixtures } from "./mocks";
export type { TeamMemberDto } from "./types";
```

### src/services/mappers/teamMemberMapper.ts

```ts
import type { TeamMemberDto } from "@/services/teamMember/types";
import type { TeamMember } from "@/types";

const MAX_INITIALS = 2;

/** "Priya Raghavan" -> "PR"; falls back to "?" for an unusable name. */
const deriveInitials = (fullName: string): string => {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_INITIALS)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "?";
};

export const mapTeamMemberDtoToTeamMember = (
  dto: TeamMemberDto,
): TeamMember => ({
  id: dto.id,
  name: dto.full_name,
  title: dto.job_title,
  department: dto.department,
  email: dto.email_address,
  location: dto.location,
  avatarUrl: dto.avatar_url.trim() === "" ? null : dto.avatar_url,
  initials: deriveInitials(dto.full_name),
  joinedOn: dto.joined_on,
  isActive: dto.is_active,
});
```

### src/services/mappers/teamMemberMapper.test.ts

```ts
import { describe, expect, it } from "vitest";

import { teamMemberDtoFixtures } from "@/services/teamMember/mocks";

import { mapTeamMemberDtoToTeamMember } from "./teamMemberMapper";

describe("mapTeamMemberDtoToTeamMember", () => {
  it("renames DTO fields onto the domain model", () => {
    const [dto] = teamMemberDtoFixtures;

    expect(mapTeamMemberDtoToTeamMember(dto)).toEqual({
      id: 1,
      name: "Priya Raghavan",
      title: "Principal Engineer",
      department: "Platform",
      email: "priya.raghavan@example.com",
      location: "Bengaluru, IN",
      avatarUrl: "https://i.pravatar.cc/160?img=47",
      initials: "PR",
      joinedOn: "2019-03-11",
      isActive: true,
    });
  });

  it("treats an empty avatar_url as no avatar", () => {
    expect(
      mapTeamMemberDtoToTeamMember(teamMemberDtoFixtures[1]).avatarUrl,
    ).toBe(null);
  });

  it("derives at most two initials and copes with a single name", () => {
    const base = teamMemberDtoFixtures[0];

    expect(
      mapTeamMemberDtoToTeamMember({
        ...base,
        full_name: "Ada Byron King Lovelace",
      }).initials,
    ).toBe("AB");
    expect(
      mapTeamMemberDtoToTeamMember({ ...base, full_name: "Prince" }).initials,
    ).toBe("P");
    expect(
      mapTeamMemberDtoToTeamMember({ ...base, full_name: "   " }).initials,
    ).toBe("?");
  });
});
```

### src/services/mappers/index.ts

```ts
export { mapTeamMemberDtoToTeamMember } from "./teamMemberMapper";
```

### src/services/index.ts

```ts
export { apiClient, ApiError } from "./apiClient";

export { getTeamMembers, teamMemberDtoFixtures } from "./teamMember";
export type { TeamMemberDto } from "./teamMember";

export { mapTeamMemberDtoToTeamMember } from "./mappers";
```

### src/store/teamDirectory/types.ts

```ts
import type { AsyncState, TeamDirectoryViewMode, TeamMember } from "@/types";

export interface TeamDirectoryState {
  /** The roster as fetched from the API, including its loading/error phases. */
  roster: AsyncState<TeamMember[]>;
  /** Grid or list layout for the roster. Shared so any header/toolbar can read it. */
  viewMode: TeamDirectoryViewMode;
  /** Id of the member whose detail dialog is open; null when closed. */
  selectedMemberId: number | null;
}

export interface TeamDirectoryActions {
  /** Fetches the roster via the team member service and maps it to domain models. */
  loadRoster: (signal?: AbortSignal) => Promise<void>;
  setViewMode: (viewMode: TeamDirectoryViewMode) => void;
  selectMember: (memberId: number) => void;
  clearSelectedMember: () => void;
}

export type TeamDirectoryStore = TeamDirectoryState & TeamDirectoryActions;
```

### src/store/teamDirectory/teamDirectoryStore.ts

```ts
import { create } from "zustand";

import { mapTeamMemberDtoToTeamMember } from "@/services/mappers/teamMemberMapper";
import { getTeamMembers } from "@/services/teamMember/teamMemberService";

import type { TeamDirectoryState, TeamDirectoryStore } from "./types";

const FALLBACK_ERROR_MESSAGE = "Could not load the team directory.";

const initialState: TeamDirectoryState = {
  roster: { status: "idle" },
  viewMode: "grid",
  selectedMemberId: null,
};

/**
 * State for the team directory: the roster itself plus how it is being viewed.
 *
 * The fetch lives here rather than in a useState-based hook because this repo's
 * eslint config (react-hooks/set-state-in-effect) rejects a mount effect that
 * reaches a React setState — a store action is the sanctioned place for async
 * work (state-management/01-zustand.md).
 */
export const useTeamDirectoryStore = create<TeamDirectoryStore>((set) => ({
  ...initialState,
  loadRoster: async (signal) => {
    set({ roster: { status: "loading" } });

    try {
      const response = await getTeamMembers(signal);
      if (signal?.aborted) return;
      set({
        roster: {
          status: "success",
          data: response.data.map(mapTeamMemberDtoToTeamMember),
        },
      });
    } catch (error: unknown) {
      if (signal?.aborted) return;
      const message =
        error instanceof Error ? error.message : FALLBACK_ERROR_MESSAGE;
      set({ roster: { status: "error", message } });
    }
  },
  setViewMode: (viewMode) => {
    set({ viewMode });
  },
  selectMember: (memberId) => {
    set({ selectedMemberId: memberId });
  },
  clearSelectedMember: () => {
    set({ selectedMemberId: null });
  },
}));
```

### src/store/teamDirectory/teamDirectoryStore.test.ts

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { teamMemberDtoFixtures } from "@/services/teamMember/mocks";

import { useTeamDirectoryStore } from "./teamDirectoryStore";

function mockFetchResolved(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => "application/json" },
      json: async () => body,
      text: async () => JSON.stringify(body),
    }),
  );
}

describe("useTeamDirectoryStore", () => {
  beforeEach(() => {
    useTeamDirectoryStore.setState({
      roster: { status: "idle" },
      viewMode: "grid",
      selectedMemberId: null,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts idle, in grid view, with nobody selected", () => {
    expect(useTeamDirectoryStore.getState().roster).toEqual({ status: "idle" });
    expect(useTeamDirectoryStore.getState().viewMode).toBe("grid");
    expect(useTeamDirectoryStore.getState().selectedMemberId).toBeNull();
  });

  it("switches the view mode without touching the selection", () => {
    useTeamDirectoryStore.getState().selectMember(4);
    useTeamDirectoryStore.getState().setViewMode("list");

    expect(useTeamDirectoryStore.getState().viewMode).toBe("list");
    expect(useTeamDirectoryStore.getState().selectedMemberId).toBe(4);
  });

  it("clears the selected member", () => {
    useTeamDirectoryStore.getState().selectMember(7);
    useTeamDirectoryStore.getState().clearSelectedMember();

    expect(useTeamDirectoryStore.getState().selectedMemberId).toBeNull();
  });

  it("stores mapped domain models after a successful load", async () => {
    mockFetchResolved(teamMemberDtoFixtures);

    await useTeamDirectoryStore.getState().loadRoster();

    const { roster } = useTeamDirectoryStore.getState();
    if (roster.status !== "success") throw new Error("expected success");
    expect(roster.data).toHaveLength(2);
    expect(roster.data[0]).toMatchObject({
      name: "Priya Raghavan",
      initials: "PR",
    });
    expect(roster.data[1]).toMatchObject({ initials: "SA", avatarUrl: null });
  });

  it("stores an error message when the request fails", async () => {
    mockFetchResolved({ message: "nope" }, 500);

    await useTeamDirectoryStore.getState().loadRoster();

    expect(useTeamDirectoryStore.getState().roster.status).toBe("error");
  });

  it("leaves the roster untouched when the request was aborted", async () => {
    mockFetchResolved(teamMemberDtoFixtures);
    const controller = new AbortController();
    controller.abort();

    await useTeamDirectoryStore.getState().loadRoster(controller.signal);

    expect(useTeamDirectoryStore.getState().roster.status).toBe("loading");
  });
});
```

### src/store/teamDirectory/index.ts

```ts
export { useTeamDirectoryStore } from "./teamDirectoryStore";
export type {
  TeamDirectoryActions,
  TeamDirectoryState,
  TeamDirectoryStore,
} from "./types";
```

### src/store/index.ts

```ts
export { useTeamDirectoryStore } from "./teamDirectory";
export type {
  TeamDirectoryActions,
  TeamDirectoryState,
  TeamDirectoryStore,
} from "./teamDirectory";
```

### src/hooks/useTeamMembers.ts

```ts
import { useCallback, useEffect } from "react";

import { useTeamDirectoryStore } from "@/store";

/**
 * Loads the roster on mount and exposes it to the UI as domain models only —
 * the DTO never leaves the store's action. Aborts the in-flight request on
 * unmount so a slow response cannot resolve into an unmounted page.
 */
export const useTeamMembers = () => {
  const state = useTeamDirectoryStore((store) => store.roster);
  const loadRoster = useTeamDirectoryStore((store) => store.loadRoster);

  useEffect(() => {
    const controller = new AbortController();
    void loadRoster(controller.signal);
    return () => {
      controller.abort();
    };
  }, [loadRoster]);

  const retry = useCallback(() => {
    void loadRoster();
  }, [loadRoster]);

  return { state, retry };
};
```

### src/hooks/useTeamMembers.test.ts

```ts
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { teamMemberDtoFixtures } from "@/services/teamMember/mocks";
import { useTeamDirectoryStore } from "@/store";

import { useTeamMembers } from "./useTeamMembers";

function mockFetchResolved(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => "application/json" },
      json: async () => body,
      text: async () => JSON.stringify(body),
    }),
  );
}

describe("useTeamMembers", () => {
  beforeEach(() => {
    useTeamDirectoryStore.setState({
      roster: { status: "idle" },
      viewMode: "grid",
      selectedMemberId: null,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the roster on mount and returns domain models", async () => {
    mockFetchResolved(teamMemberDtoFixtures);
    const { result } = renderHook(() => useTeamMembers());

    await waitFor(() => {
      expect(result.current.state.status).toBe("success");
    });

    if (result.current.state.status !== "success") {
      throw new Error("expected a successful state");
    }
    expect(result.current.state.data).toHaveLength(2);
    expect(result.current.state.data[0]).toMatchObject({
      id: 1,
      name: "Priya Raghavan",
      initials: "PR",
    });
  });

  it("reports an error state when the request fails", async () => {
    mockFetchResolved({ message: "nope" }, 500);
    const { result } = renderHook(() => useTeamMembers());

    await waitFor(() => {
      expect(result.current.state.status).toBe("error");
    });
  });

  it("re-requests the roster on retry", async () => {
    mockFetchResolved(teamMemberDtoFixtures);
    const { result } = renderHook(() => useTeamMembers());

    await waitFor(() => {
      expect(result.current.state.status).toBe("success");
    });

    result.current.retry();

    await waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    });
  });

  it("aborts the in-flight request when the consumer unmounts", async () => {
    mockFetchResolved(teamMemberDtoFixtures);
    const { unmount } = renderHook(() => useTeamMembers());

    unmount();

    await waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringContaining("/teamMembers"),
        expect.objectContaining({ signal: expect.anything() }),
      );
    });
  });
});
```

### src/hooks/index.ts

```ts
export { useIsMobile } from "./use-mobile";
export { useTeamMembers } from "./useTeamMembers";
```

### src/pages/teamDirectory/components/viewModeToggle/types.ts

```ts
import type { TeamDirectoryViewMode } from "@/types";

export interface ViewModeToggleProps {
  /** Currently active layout. */
  value: TeamDirectoryViewMode;
  /** Called with the newly chosen layout; never called with the same value twice. */
  onValueChange: (viewMode: TeamDirectoryViewMode) => void;
}
```

### src/pages/teamDirectory/components/viewModeToggle/ViewModeToggle.styles.ts

```ts
export const viewModeToggleStyles = {
  group: "shrink-0",
};
```

### src/pages/teamDirectory/components/viewModeToggle/ViewModeToggle.tsx

```tsx
import { LayoutGridIcon, ListIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { TeamDirectoryViewMode } from "@/types";

import { viewModeToggleStyles } from "./ViewModeToggle.styles";
import type { ViewModeToggleProps } from "./types";

export function ViewModeToggle({ value, onValueChange }: ViewModeToggleProps) {
  return (
    <ToggleGroup
      className={viewModeToggleStyles.group}
      variant="outline"
      size="sm"
      spacing={0}
      value={[value]}
      // Base UI reports the whole pressed set. Single-select still allows
      // un-pressing the active item, which would yield an empty array — the
      // directory always needs a layout, so ignore that case.
      onValueChange={(groupValue) => {
        const [next] = groupValue;
        if (next && next !== value) {
          onValueChange(next as TeamDirectoryViewMode);
        }
      }}
      aria-label="Team directory layout"
    >
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGridIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <ListIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
```

### src/pages/teamDirectory/components/viewModeToggle/ViewModeToggle.test.tsx

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ViewModeToggle } from "./ViewModeToggle";

describe("ViewModeToggle", () => {
  it("marks the active layout as pressed", () => {
    render(<ViewModeToggle value="list" onValueChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "List view" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Grid view" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("reports the newly chosen layout", async () => {
    const onValueChange = vi.fn();
    render(<ViewModeToggle value="grid" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("button", { name: "List view" }));

    expect(onValueChange).toHaveBeenCalledWith("list");
  });

  it("ignores un-pressing the already active layout", async () => {
    const onValueChange = vi.fn();
    render(<ViewModeToggle value="grid" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Grid view" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
```

### src/pages/teamDirectory/components/viewModeToggle/index.ts

```ts
export { ViewModeToggle } from "./ViewModeToggle";
export type { ViewModeToggleProps } from "./types";
```

### src/pages/teamDirectory/components/teamMemberCard/types.ts

```ts
import type { TeamDirectoryViewMode, TeamMember } from "@/types";

export interface TeamMemberCardProps {
  member: TeamMember;
  /** Drives the card's internal layout — same data, two arrangements. */
  viewMode: TeamDirectoryViewMode;
  /** Called when the card is activated by click, Enter, or Space. */
  onSelect: (memberId: number) => void;
}
```

### src/pages/teamDirectory/components/teamMemberCard/TeamMemberCard.styles.ts

```ts
export const teamMemberCardStyles = {
  card: "relative transition-shadow focus-within:ring-2 focus-within:ring-ring/50 hover:ring-foreground/25",
  gridHeader: "flex flex-col items-start gap-2",
  listHeader: "flex flex-row flex-wrap items-center gap-x-3 gap-y-1",
  gridMeta: "flex flex-col gap-2",
  listMeta: "flex flex-row flex-wrap items-center gap-x-3 gap-y-1",
  location: "text-sm text-muted-foreground",
  /** Full-card hit area that is still a real, focusable button. */
  overlayTrigger: "absolute inset-0 h-auto w-auto rounded-xl",
};
```

### src/pages/teamDirectory/components/teamMemberCard/TeamMemberCard.tsx

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { teamMemberCardStyles } from "./TeamMemberCard.styles";
import type { TeamMemberCardProps } from "./types";

export function TeamMemberCard({
  member,
  viewMode,
  onSelect,
}: TeamMemberCardProps) {
  const isGrid = viewMode === "grid";

  return (
    <Card className={teamMemberCardStyles.card} size="sm">
      <CardHeader
        className={cn(
          isGrid
            ? teamMemberCardStyles.gridHeader
            : teamMemberCardStyles.listHeader,
        )}
      >
        <Avatar size="lg">
          {member.avatarUrl ? (
            <AvatarImage src={member.avatarUrl} alt={member.name} />
          ) : null}
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
        <CardTitle>{member.name}</CardTitle>
        <CardDescription>
          {member.title} · {member.department}
        </CardDescription>
      </CardHeader>

      <CardContent
        className={cn(
          isGrid
            ? teamMemberCardStyles.gridMeta
            : teamMemberCardStyles.listMeta,
        )}
      >
        <p className={teamMemberCardStyles.location}>{member.location}</p>
        <Badge variant={member.isActive ? "secondary" : "outline"}>
          {member.isActive ? "Active" : "On leave"}
        </Badge>
      </CardContent>

      {/* Stretched trigger: the whole card is clickable, but the accessible
          control is a real button rather than a container with a click handler. */}
      <Button
        variant="link"
        className={teamMemberCardStyles.overlayTrigger}
        aria-label={`View details for ${member.name}`}
        onClick={() => {
          onSelect(member.id);
        }}
      />
    </Card>
  );
}
```

### src/pages/teamDirectory/components/teamMemberCard/TeamMemberCard.test.tsx

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { TeamMember } from "@/types";

import { TeamMemberCard } from "./TeamMemberCard";

const member: TeamMember = {
  id: 3,
  name: "Sofia Almeida",
  title: "Product Manager",
  department: "Product",
  email: "sofia.almeida@example.com",
  location: "Lisbon, PT",
  avatarUrl: null,
  initials: "SA",
  joinedOn: "2021-01-18",
  isActive: true,
};

describe("TeamMemberCard", () => {
  it("renders the member's identity and role", () => {
    render(
      <TeamMemberCard member={member} viewMode="grid" onSelect={vi.fn()} />,
    );

    expect(screen.getByText("Sofia Almeida")).toBeInTheDocument();
    expect(screen.getByText("Product Manager · Product")).toBeInTheDocument();
    expect(screen.getByText("Lisbon, PT")).toBeInTheDocument();
  });

  it("falls back to initials when the member has no avatar image", () => {
    render(
      <TeamMemberCard member={member} viewMode="grid" onSelect={vi.fn()} />,
    );

    expect(screen.getByText("SA")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows an inactive member's status", () => {
    render(
      <TeamMemberCard
        member={{ ...member, isActive: false }}
        viewMode="list"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("On leave")).toBeInTheDocument();
  });

  it("reports the member id when its trigger is activated", async () => {
    const onSelect = vi.fn();
    render(
      <TeamMemberCard member={member} viewMode="grid" onSelect={onSelect} />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "View details for Sofia Almeida" }),
    );

    expect(onSelect).toHaveBeenCalledWith(3);
  });
});
```

### src/pages/teamDirectory/components/teamMemberCard/index.ts

```ts
export { TeamMemberCard } from "./TeamMemberCard";
export type { TeamMemberCardProps } from "./types";
```

### src/pages/teamDirectory/components/teamMemberDetailDialog/types.ts

```ts
import type { TeamMember } from "@/types";

export interface TeamMemberDetailDialogProps {
  /** The member to show. null keeps the dialog closed. */
  member: TeamMember | null;
  /** Called when the dialog is dismissed by any means (close button, Esc, backdrop). */
  onClose: () => void;
}
```

### src/pages/teamDirectory/components/teamMemberDetailDialog/TeamMemberDetailDialog.styles.ts

```ts
export const teamMemberDetailDialogStyles = {
  header: "flex flex-row items-center gap-3",
  identity: "flex flex-col gap-1",
  detailList: "flex flex-col gap-3",
  detailRow: "flex flex-col gap-0.5",
  detailLabel:
    "text-xs font-medium tracking-wide text-muted-foreground uppercase",
  detailValue: "text-sm text-foreground",
};
```

### src/pages/teamDirectory/components/teamMemberDetailDialog/TeamMemberDetailDialog.tsx

```tsx
import { format, parseISO } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { teamMemberDetailDialogStyles } from "./TeamMemberDetailDialog.styles";
import type { TeamMemberDetailDialogProps } from "./types";

export function TeamMemberDetailDialog({
  member,
  onClose,
}: TeamMemberDetailDialogProps) {
  if (!member) return null;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader className={teamMemberDetailDialogStyles.header}>
          <Avatar size="lg">
            {member.avatarUrl ? (
              <AvatarImage src={member.avatarUrl} alt={member.name} />
            ) : null}
            <AvatarFallback>{member.initials}</AvatarFallback>
          </Avatar>
          <DialogTitle>{member.name}</DialogTitle>
          <DialogDescription>
            {member.title} · {member.department}
          </DialogDescription>
        </DialogHeader>

        <ul className={teamMemberDetailDialogStyles.detailList}>
          <li className={teamMemberDetailDialogStyles.detailRow}>
            <small className={teamMemberDetailDialogStyles.detailLabel}>
              Email
            </small>
            <a
              className={teamMemberDetailDialogStyles.detailValue}
              href={`mailto:${member.email}`}
            >
              {member.email}
            </a>
          </li>
          <li className={teamMemberDetailDialogStyles.detailRow}>
            <small className={teamMemberDetailDialogStyles.detailLabel}>
              Location
            </small>
            <p className={teamMemberDetailDialogStyles.detailValue}>
              {member.location}
            </p>
          </li>
          <li className={teamMemberDetailDialogStyles.detailRow}>
            <small className={teamMemberDetailDialogStyles.detailLabel}>
              Joined
            </small>
            <time
              className={teamMemberDetailDialogStyles.detailValue}
              dateTime={member.joinedOn}
            >
              {format(parseISO(member.joinedOn), "d MMMM yyyy")}
            </time>
          </li>
          <li className={teamMemberDetailDialogStyles.detailRow}>
            <small className={teamMemberDetailDialogStyles.detailLabel}>
              Status
            </small>
            <Badge variant={member.isActive ? "secondary" : "outline"}>
              {member.isActive ? "Active" : "On leave"}
            </Badge>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
```

### src/pages/teamDirectory/components/teamMemberDetailDialog/TeamMemberDetailDialog.test.tsx

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { TeamMember } from "@/types";

import { TeamMemberDetailDialog } from "./TeamMemberDetailDialog";

const member: TeamMember = {
  id: 1,
  name: "Priya Raghavan",
  title: "Principal Engineer",
  department: "Platform",
  email: "priya.raghavan@example.com",
  location: "Bengaluru, IN",
  avatarUrl: "https://i.pravatar.cc/160?img=47",
  initials: "PR",
  joinedOn: "2019-03-11",
  isActive: true,
};

describe("TeamMemberDetailDialog", () => {
  it("renders nothing when no member is selected", () => {
    render(<TeamMemberDetailDialog member={null} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("names the dialog after the selected member", () => {
    render(<TeamMemberDetailDialog member={member} onClose={vi.fn()} />);

    expect(
      screen.getByRole("dialog", { name: /Priya Raghavan/ }),
    ).toBeInTheDocument();
  });

  it("shows the member's contact and tenure details", () => {
    render(<TeamMemberDetailDialog member={member} onClose={vi.fn()} />);

    expect(
      screen.getByRole("link", { name: "priya.raghavan@example.com" }),
    ).toHaveAttribute("href", "mailto:priya.raghavan@example.com");
    expect(screen.getByText("Bengaluru, IN")).toBeInTheDocument();
    expect(screen.getByText("11 March 2019")).toBeInTheDocument();
  });

  it("closes on the close button", async () => {
    const onClose = vi.fn();
    render(<TeamMemberDetailDialog member={member} onClose={onClose} />);

    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalled();
  });
});
```

### src/pages/teamDirectory/components/teamMemberDetailDialog/index.ts

```ts
export { TeamMemberDetailDialog } from "./TeamMemberDetailDialog";
export type { TeamMemberDetailDialogProps } from "./types";
```

### src/pages/teamDirectory/components/index.ts

```ts
export { TeamMemberCard } from "./teamMemberCard";
export type { TeamMemberCardProps } from "./teamMemberCard";

export { TeamMemberDetailDialog } from "./teamMemberDetailDialog";
export type { TeamMemberDetailDialogProps } from "./teamMemberDetailDialog";

export { ViewModeToggle } from "./viewModeToggle";
export type { ViewModeToggleProps } from "./viewModeToggle";
```

### src/pages/teamDirectory/types.ts

```ts
export {};
```

### src/pages/teamDirectory/TeamDirectoryPage.styles.ts

```ts
export const teamDirectoryPageStyles = {
  page: "mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8",
  header: "flex flex-row flex-wrap items-center justify-between gap-3",
  headings: "flex flex-col gap-1",
  title: "font-heading text-2xl font-medium text-foreground",
  subtitle: "text-sm text-muted-foreground",
  gridList: "grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  stackList: "flex list-none flex-col gap-3",
  skeletonGrid: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  skeletonCard: "h-32 w-full rounded-xl",
};
```

### src/pages/teamDirectory/TeamDirectoryPage.tsx

```tsx
import { UsersIcon } from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamMembers } from "@/hooks";
import { useTeamDirectoryStore } from "@/store";

import { teamDirectoryPageStyles } from "./TeamDirectoryPage.styles";
import {
  TeamMemberCard,
  TeamMemberDetailDialog,
  ViewModeToggle,
} from "./components";

const SKELETON_PLACEHOLDER_KEYS = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
];

export function TeamDirectoryPage() {
  const { state, retry } = useTeamMembers();
  const viewMode = useTeamDirectoryStore((store) => store.viewMode);
  const setViewMode = useTeamDirectoryStore((store) => store.setViewMode);
  const selectedMemberId = useTeamDirectoryStore(
    (store) => store.selectedMemberId,
  );
  const selectMember = useTeamDirectoryStore((store) => store.selectMember);
  const clearSelectedMember = useTeamDirectoryStore(
    (store) => store.clearSelectedMember,
  );

  const members = state.status === "success" ? state.data : [];
  const selectedMember =
    members.find((member) => member.id === selectedMemberId) ?? null;

  return (
    <main className={teamDirectoryPageStyles.page}>
      <header className={teamDirectoryPageStyles.header}>
        <hgroup className={teamDirectoryPageStyles.headings}>
          <h1 className={teamDirectoryPageStyles.title}>Team directory</h1>
          <p className={teamDirectoryPageStyles.subtitle}>
            Everyone in the organisation, with their role and where they work
            from.
          </p>
        </hgroup>
        <ViewModeToggle value={viewMode} onValueChange={setViewMode} />
      </header>

      <Separator />

      {(state.status === "idle" || state.status === "loading") && (
        <section
          className={teamDirectoryPageStyles.skeletonGrid}
          aria-busy="true"
          aria-label="Loading team members"
        >
          {SKELETON_PLACEHOLDER_KEYS.map((placeholderKey) => (
            <Skeleton
              key={placeholderKey}
              className={teamDirectoryPageStyles.skeletonCard}
            />
          ))}
        </section>
      )}

      {state.status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>Could not load the team directory</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
          <AlertAction>
            <Button variant="outline" size="sm" onClick={retry}>
              Try again
            </Button>
          </AlertAction>
        </Alert>
      )}

      {state.status === "success" && members.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            <EmptyTitle>No team members yet</EmptyTitle>
            <EmptyDescription>
              Once people are added to the roster they will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {state.status === "success" && members.length > 0 && (
        <ul
          className={
            viewMode === "grid"
              ? teamDirectoryPageStyles.gridList
              : teamDirectoryPageStyles.stackList
          }
        >
          {members.map((member) => (
            <li key={member.id}>
              <TeamMemberCard
                member={member}
                viewMode={viewMode}
                onSelect={selectMember}
              />
            </li>
          ))}
        </ul>
      )}

      <TeamMemberDetailDialog
        member={selectedMember}
        onClose={clearSelectedMember}
      />
    </main>
  );
}
```

### src/pages/teamDirectory/TeamDirectoryPage.test.tsx

```tsx
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { teamMemberDtoFixtures } from "@/services/teamMember/mocks";
import { useTeamDirectoryStore } from "@/store";

import { TeamDirectoryPage } from "./TeamDirectoryPage";

function mockFetchResolved(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => "application/json" },
      json: async () => body,
      text: async () => JSON.stringify(body),
    }),
  );
}

describe("TeamDirectoryPage", () => {
  beforeEach(() => {
    useTeamDirectoryStore.setState({
      roster: { status: "idle" },
      viewMode: "grid",
      selectedMemberId: null,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a loading placeholder before the roster arrives", () => {
    mockFetchResolved(teamMemberDtoFixtures);
    render(<TeamDirectoryPage />);

    expect(screen.getByLabelText("Loading team members")).toBeInTheDocument();
  });

  it("renders one card per member once loaded", async () => {
    mockFetchResolved(teamMemberDtoFixtures);
    render(<TeamDirectoryPage />);

    const list = await screen.findByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Priya Raghavan")).toBeInTheDocument();
    expect(screen.getByText("Sofia Almeida")).toBeInTheDocument();
  });

  it("shows an empty state when the roster has nobody in it", async () => {
    mockFetchResolved([]);
    render(<TeamDirectoryPage />);

    expect(await screen.findByText("No team members yet")).toBeInTheDocument();
  });

  it("surfaces a retryable error when the request fails", async () => {
    mockFetchResolved({ message: "Server exploded" }, 500);
    render(<TeamDirectoryPage />);

    expect(
      await screen.findByText("Could not load the team directory"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });

  it("switches layout through the toggle and keeps it in the store", async () => {
    mockFetchResolved(teamMemberDtoFixtures);
    render(<TeamDirectoryPage />);
    await screen.findByText("Priya Raghavan");

    await userEvent.click(screen.getByRole("button", { name: "List view" }));

    await waitFor(() => {
      expect(useTeamDirectoryStore.getState().viewMode).toBe("list");
    });
  });

  it("opens the detail dialog for the clicked member", async () => {
    mockFetchResolved(teamMemberDtoFixtures);
    render(<TeamDirectoryPage />);
    await screen.findByText("Priya Raghavan");

    await userEvent.click(
      screen.getByRole("button", { name: "View details for Priya Raghavan" }),
    );

    const dialog = await screen.findByRole("dialog", {
      name: /Priya Raghavan/,
    });
    expect(
      within(dialog).getByText("Principal Engineer · Platform"),
    ).toBeInTheDocument();
  });
});
```

### src/pages/teamDirectory/index.ts

```ts
export { TeamDirectoryPage } from "./TeamDirectoryPage";
```

### src/pages/index.ts

```ts
export { ComponentsGalleryPage } from "./componentsGallery";
export { TeamDirectoryPage } from "./teamDirectory";
```

### src/config/routes.tsx

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

const TeamDirectoryPage = lazy(() =>
  import("@/pages/teamDirectory/TeamDirectoryPage").then((m) => ({
    default: m.TeamDirectoryPage,
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
        path={ROUTES.TEAM_DIRECTORY}
        element={
          <Suspense fallback={<PageLoader />}>
            <TeamDirectoryPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
```

---

## Rule compliance self-check

**Component tiers (`core/02-project-structure.md`)**
- [x] New components placed in the correct tier — all three
      (`viewModeToggle`, `teamMemberCard`, `teamMemberDetailDialog`) are used by exactly
      one page, so they are feature-scoped under `pages/teamDirectory/components/`.
      Nothing was promoted to `shared/`/`blocks/` since nothing is reused yet.
      *Judgment call worth reviewing:* `ViewModeToggle` has generic props
      (`value`/`onValueChange`) and would arguably qualify for `blocks/` if a second
      page ever needed it — decision rule step 4 (used by exactly one page) fires
      before step 5 (generic props), so feature-scoped is correct today.
- [x] No component created that duplicates one that already exists — checked
      `components/shared/` (`errorBoundary`, `themeToggle`), `components/layout/`
      (empty), `components/blocks/` (empty), and `pages/componentsGallery/components/`
      (`colorSwatch`, `gallerySection`, `themeHistoryPanel`). No overlap.
- [x] Every component folder has its required files — 5-file contract
      (`.tsx`, `.styles.ts`, `types.ts`, `.test.tsx`, `index.ts`) for all three, since
      Storybook is not installed in this template (no `.storybook/`, no Storybook deps
      in `package.json`).

**Styling (`styling/shadcn/01-tailwind-shadcn-styling.md`, `04-composition-patterns.md`)**
- [x] No hardcoded hex/rgb/rgba colors or Tailwind palette classes — semantic tokens
      only (`text-muted-foreground`, `text-foreground`, `ring-ring/50`,
      `ring-foreground/25`)
- [x] No inline `style` prop anywhere in the new code
- [x] Multi-token `className`s extracted to `.styles.ts` — every new `.tsx` imports its
      style object; the only inline `className` values are references to those objects
      or `cn()` calls composing two imported bases
- [x] No arbitrary Tailwind values (`[...]`) anywhere — deliberately avoided
      `grid-cols-[auto_1fr]` for the list layout in favour of
      `flex flex-row flex-wrap items-center gap-x-3 gap-y-1`, which needs no arbitrary
      value and no extra wrapper element
- [x] Composition uses Base UI's `render` prop where needed, never `asChild` — no
      `asChild` in the new code; no `render` prop was required for this feature
- [x] N/A — no form in this assignment, so no `Field`/`FieldGroup` usage and no
      `.schema.ts`
- [x] `Dialog` has a `DialogTitle` — **visible**, not `sr-only`: it holds the member's
      name, which is exactly what the dialog is about, so hiding it would be worse.
      Also has a `DialogDescription`. Verified by test:
      `getByRole("dialog", { name: /Priya Raghavan/ })` passes, proving the accessible
      name is actually wired from the title.
- [x] `Card` composed with real sub-components — `Card` / `CardHeader` / `CardTitle` /
      `CardDescription` / `CardContent`. Nothing dumped into a single `CardContent`.
- [x] `Avatar` has an `AvatarFallback` — in both `TeamMemberCard` and
      `TeamMemberDetailDialog`; `AvatarImage` is rendered conditionally only when
      `avatarUrl` is non-null, and the mapper normalises `""` → `null` so the fallback
      path is deterministic rather than depending on a failed image load
- [x] N/A — no `Tabs` in this assignment
- [x] Icons: no manual `size-*` sizing on any icon inside a vendored component. The
      two `ToggleGroupItem` icons (`LayoutGridIcon`, `ListIcon`) are **icon-only with
      no adjacent text**, so per `04-composition-patterns.md`'s own explicit carve-out
      ("`data-icon` only applies when there's adjacent text to coordinate spacing
      with"), `data-icon` is correctly omitted. Each carries an `aria-label` instead.
      `UsersIcon` inside `EmptyMedia variant="icon"` likewise has no adjacent text.
- [x] N/A — no button loading state in this assignment (no `isLoading`/`isPending`
      props used anywhere)
- [x] N/A — no `Select`/`DropdownMenu`/`Command` in this assignment

**Data fetching (`data-fetching/01-fetch-client.md`, `02-api-services.md`, `03-data-layer.md`)**
- [x] No raw `fetch` in any component — the only `fetch` references in new code are
      `vi.stubGlobal("fetch", ...)` inside test files, mirroring the existing
      `apiClient.test.ts` pattern
- [x] Service returns `ApiResponse<T>` (`ApiResponse<TeamMemberDto[]>`); the consumer
      unwraps `.data` before it reaches state
- [x] DTO → domain mapping goes through `services/mappers/teamMemberMapper.ts`, never
      inline in a component. `TeamMemberDto` is imported by exactly two files (the
      service and the mapper) plus the test fixtures — it never reaches the UI.
- [ ] ⚠️ **Deviation:** `03-data-layer.md` specifies the flow
      `db.json → Service → Mapper → Hook → UI`, i.e. the **hook** calls service and
      mapper. Here the service+mapper call lives in the **Zustand store action** and
      the hook is a thin selector over it. Forced by
      `react-hooks/set-state-in-effect` — see "Rule guidance gaps" below. The layering
      itself is intact (UI still only ever sees `TeamMember`); only *which* layer owns
      the call moved.

**State management (`state-management/01-zustand.md`)**
- [x] No direct store state mutation — every change goes through `set({ ... })`
- [x] Store is domain-focused — one store for the team directory domain, holding the
      roster plus how it's being viewed. *Reviewable judgment call:* this now mixes
      server-derived data (`roster`) with UI state (`viewMode`, `selectedMemberId`) in
      one store. The rule permits "cached view state when appropriate" and requires
      domain focus; splitting into `teamRoster` + `teamDirectory` stores was the
      alternative and was judged over-engineering for one page.
- [x] Only necessary slices selected in components — five separate one-field selectors
      in `TeamDirectoryPage`, never `useTeamDirectoryStore()` bare
- [x] Async action follows the rule's guidance: calls a typed service only, sets
      loading/error explicitly, no JSX, no router logic

**Forms (`forms/01-rhf-zod.md`)**
- N/A — assignment 2 has no form.

**Theme versioning** — N/A, this task did not touch theming.

**Testing**
- [x] Every new component/hook/service/store/mapper has a co-located test:
      `ViewModeToggle.test.tsx` (3), `TeamMemberCard.test.tsx` (4),
      `TeamMemberDetailDialog.test.tsx` (4), `TeamDirectoryPage.test.tsx` (6),
      `useTeamMembers.test.ts` (4), `teamDirectoryStore.test.ts` (6),
      `teamMemberMapper.test.ts` (3)
- [x] Tests assert real behavior, not smoke tests — `aria-pressed` state on the toggle,
      the un-press-guard actually not firing the callback, `AvatarFallback` initials
      rendering *and* no `<img>` present, the dialog's accessible name coming from
      `DialogTitle`, `mailto:` href correctness, formatted join date, loading skeleton,
      empty state, error + retry button, view-mode change landing in the store, abort
      leaving the roster untouched, and initials edge cases (4-part name, single name,
      whitespace-only)
- [x] No `ThemeProvider` in test renders — matched the existing template convention
      (`ThemeToggle.test.tsx` and the gallery tests don't wrap either; `next-themes`
      is only mounted at the app root in `App.tsx`)

## Hook behavior observed

**Caveat: see the procedural-deviation note at the top of this report.** Hook scripts
ran from the template repo's `.claude/`, not the clone's.

| Hook | What triggered it | Correct block/warning, or false positive? | Notes |
|---|---|---|---|
| `check-barrel-exports.sh` | Writing `src/types/common.types.ts` before `src/types/index.ts` re-exported it | **Correct detection, wrong suggestion** | Message said: *"Add a re-export for 'common' … e.g. `export { common } from './common';`"* — both the symbol name and the module path are wrong for a types-only module. Correct form is `export type { ApiResponse, AsyncState } from "./common.types";`. The `.types.ts` suffix is stripped when deriving the module path, producing an unresolvable specifier if followed literally. |
| `check-barrel-exports.sh` | Writing `src/types/teamMember.types.ts` | Correct detection, same wrong suggestion (`export { teamMember } from './teamMember'`) | Same `.types.ts`-suffix bug. |
| `check-barrel-exports.sh` | Writing `src/constants/api.constants.ts` | Correct detection, same class of wrong suggestion (`export { api } from './api'`) | Same suffix-stripping bug, this time on `.constants.ts`. |
| `check-barrel-exports.sh` | Writing `src/services/teamMember/{types,teamMemberService,mocks}.ts` into a brand-new directory (fired 3×, once per file) | Correct | Different, better message for the no-index-at-all case: *"No index.ts found alongside … Create `src/services/teamMember/index.ts`"*. Correct and actionable. |
| `check-barrel-exports.sh` | Writing `src/services/mappers/teamMemberMapper.ts` (dir had only `.gitkeep`) | Correct | Same no-index message. |
| `check-barrel-exports.sh` | Writing `src/store/teamDirectory/{types,teamDirectoryStore}.ts` into a new directory | Correct | Same no-index message. |
| `check-barrel-exports.sh` | Writing `src/hooks/useTeamMembers.ts` | **Correct, and the suggestion was right this time** | `export { useTeamMembers } from './useTeamMembers';` — correct because the filename has no `.<kind>.ts` suffix to mis-strip. |
| `check-barrel-exports.sh` | **Re-writing `src/store/teamDirectory/types.ts`** during the store refactor, when `src/store/teamDirectory/index.ts` **already contained** `export type { TeamDirectoryActions, TeamDirectoryState, TeamDirectoryStore } from "./types";` | ❌ **FALSE POSITIVE** | The hook claimed the file was "not exported from index.ts" when it demonstrably was. It appears to match only value exports (`export {`) and not **type-only re-exports** (`export type {`). This will fire on every types-only module in the project, permanently, and is the most actionable hook bug found this run. |

**No PreToolUse hook blocked anything this run.** `check-no-any.sh`,
`check-no-div-span.sh`, `check-no-inline-style.sh`, `check-no-hardcoded-colors.sh`,
`check-no-raw-dimensions.sh`, `check-component-duplicate.sh` all stayed silent.
Given the deviation caveat I cannot claim that is purely because nothing violated
anything — though the code genuinely contains no `any`, no `<div>`/`<span>`, no inline
`style`, no hex/rgb/palette classes, and no raw px, so silence is at least consistent
with the code. `check-component-files.sh`, `check-no-inline-classnames.sh`,
`check-tsc.sh` and `check-theme-log-entry.sh` also produced no output at any point.
`check-tsc.sh`'s silence is notable: `tsc -b` was clean when run manually, but the hook
is documented as debounced 30s and never announced itself either way.

## Anything that should have been caught by a hook, but wasn't

1. **`<hgroup>` and other unlisted semantic elements pass unchallenged.**
   `TeamDirectoryPage.tsx` uses `<hgroup>` to bundle the `<h1>` and its subtitle so the
   header can be a two-child flex row. `<hgroup>` is on **neither** list in
   `CLAUDE.md`'s HTML Element Policy — not forbidden (`div`/`span`), not in the
   "Allowed" structural set (`main`/`section`/`article`/`aside`/`header`/`footer`/`nav`).
   `check-no-div-span.sh` only knows about `div`/`span`, so an element the policy
   doesn't sanction went through silently. Same would apply to `<dl>`/`<dt>`/`<dd>`,
   which I *avoided* using in the dialog's label/value list for exactly this reason
   (used `<ul>`/`<li>` + `<small>` + `<p>` instead) — arguably a worse semantic fit
   than a definition list, chosen only because `<dl>` isn't on the allowed list.
2. **The template's own shipped code violates its own hook.**
   `src/pages/componentsGallery/components/colorSwatch/ColorSwatch.tsx` (pre-existing,
   committed in the clone) contains two `<div>`s and two `<span>`s in production JSX.
   `check-no-div-span.sh` would block that file if it were re-saved, but nothing scans
   the existing tree, so the repo ships in a state its own guardrail rejects. Same for
   the vendored `ui/` primitives (expected — those are CLI-installed and exempt by
   convention) but `colorSwatch` is *project* code, not vendored.
3. **15 pre-existing lint errors ship in the clone.** Verified by `git stash -u` +
   `npm run lint` on the pristine tree: exactly the same 15 errors. So
   `npm run lint` **can never exit 0** on a fresh clone, yet
   `core/09-anti-patterns-checklist.md` lists "`npm run lint` exits with 0 errors" as a
   mandatory gate. No hook catches this because no hook runs lint.
4. **`npm audit` reports 8 vulnerabilities (3 moderate, 5 high) on a clean clone**, and
   `check-dependency-security.sh` is documented to *block `git commit`* when audit finds
   any vulnerability. So the template as shipped cannot be committed to without either
   running `/dependency-security` first or the hook mis-firing. Not exercised this run
   (no commit was made inside the clone), but it is a live contradiction.

## Rule/`CLAUDE.md`/`AGENTS.md` guidance gaps

1. **The documented async-data pattern is un-lintable under this repo's own ESLint
   config. This is the biggest gap found.**
   `core/10-error-handling.md` prescribes exactly this shape:
   `const [state, setState] = useState<AsyncState<T>>(...)` inside a hook, with a
   `load…()` function that sets `loading` → `success`/`error`. That documented example
   is *manually triggered*, so it never hits the problem. The moment a hook needs to
   **auto-load on mount** — which any list page needs, and this assignment requires —
   the mount effect calls a function that transitively reaches `setState`, and
   `eslint-plugin-react-hooks` v7's `react-hooks/set-state-in-effect` rule errors:
   > *Calling setState synchronously within an effect can trigger cascading renders*

   It tracks setState **transitively**, so re-ordering the function so `await` comes
   first does **not** silence it (confirmed by trying). No rule file anywhere in
   `.claude/rules/` says how to auto-load data on mount. `core/11-performance.md` says
   *"Never fetch data in a `useEffect` when a hook can encapsulate it — effects are a
   last resort for data fetching"* but never says what the non-effect mechanism
   actually is in a project with no React Query / no route loaders.
   **What I did:** moved the fetch into the Zustand store as an async action (which
   `state-management/01-zustand.md` explicitly sanctions: *"Async actions may call
   services… set loading/error states explicitly"*) and reduced the hook to a selector
   + mount trigger. This satisfies ESLint and keeps `AsyncState<T>`, but it
   **contradicts `03-data-layer.md`'s stated layer flow**, where the *hook* is the layer
   that calls service + mapper. Two rule files now point in different directions and
   the ESLint config picks the winner. **This needs an explicit decision recorded in
   the rules**, because every single data-loading page in every project from this
   template will hit it.
2. **No guidance on making a whole card clickable.** The assignment requires a Dialog
   "on click" of a member. `check-no-div-span.sh` and `core/08-accessibility.md` rule
   out a container with an `onClick`, and `Card` is a plain `div` component with no
   Base UI `render` prop to convert it into a `<button>`. I used the stretched-overlay
   pattern (a real `Button variant="link"` with `absolute inset-0` and an `aria-label`,
   as the last child of the `Card`). That's a standard accessible-card technique but
   nothing in the rules mentions it, so a different session would plausibly invent
   something different — or reach for a forbidden container click handler.
3. **`AGENTS.md` and `CLAUDE.md` still contain the "ask the user at project setup"
   flow** (styling library, state management, etc.) even though every one of those rows
   now reads "fixed for this template, not a choice." For an autonomous run, "ask the
   user for every choice below before writing any code" is dead text that directly
   conflicts with the skill's "never ask, pick and document" instruction. Harmless here
   but it is noise pointed the wrong way.
4. **The HTML Element Policy's "Allowed" list reads as exhaustive but isn't.** It omits
   `<hgroup>`, `<dl>`/`<dt>`/`<dd>`, `<table>`-family, `<form>`, `<label>`, `<a>`,
   `<button>`, `<blockquote>`, `<address>`. In practice `<a>` and `<button>` are
   obviously fine, which proves the list is illustrative — but it's written in a
   document that says "Every instruction below is REQUIRED," so an agent following it
   literally has to guess. I used `<hgroup>` and `<a>`, and *avoided* `<dl>` for this
   reason — a semantically worse choice driven purely by list ambiguity.
5. **No stated convention for empty page-level `types.ts`.**
   `core/02-project-structure.md`'s required page structure lists `types.ts` as a page
   file, but `TeamDirectoryPage` has no props and no page-local types. The template's
   own `componentsGallery/types.ts` has real content, so there was no example to mirror.
   I created `src/pages/teamDirectory/types.ts` containing `export {};` to satisfy the
   file contract — a placeholder file with no content, which is exactly the kind of
   thing `09-anti-patterns-checklist.md` would otherwise call out.
6. **`ApiResponse<T>` and `AsyncState<T>` are mandated but not shipped.**
   `core/02-project-structure.md` says `ApiResponse<T>` "MUST be defined in
   `src/types/common.types.ts` in every project," and `10-error-handling.md` says the
   same for `AsyncState<T>`. In a clean clone `src/types/index.ts` is `export {};` and
   `common.types.ts` doesn't exist. Every project from this template has to hand-create
   the two types the rules already assume exist — an easy thing for the template to
   ship pre-built.
7. **`ThemeProvider`-in-render testing rule contradicts the template's own tests.**
   `CLAUDE.md`'s manual-compliance list says *"Testing: … ThemeProvider in render."*
   None of the template's existing tests do this (`ThemeToggle.test.tsx`,
   `ColorSwatch.test.tsx`, the gallery tests). I followed the existing code, not the
   rule text.

## Final verification

| Check | Result |
|---|---|
| `npm run lint` | ⚠️ **15 errors — all pre-existing in vendored `src/components/ui/**`, 0 from this feature.** Proven by `git stash -u` on the pristine clone → identical 15. Breakdown: 14× `react-refresh/only-export-components`, 1× `react-hooks/set-state-in-effect` in `ui/carousel.tsx`. Scoped run over only the new/changed dirs (`src/hooks src/pages/teamDirectory src/store src/services src/types src/constants src/config`) exits **clean, 0 problems**. |
| `npx tsc -b` | ✅ **Pass** — exit 0, no output |
| `npm run test` | ✅ **Pass** — `Test Files 14 passed (14)`, `Tests 48 passed (48)`, duration 3.28s. (Baseline clone had 7 files / 18 tests; this feature added 7 files / 30 tests.) |
| `npm run build` | ✅ **Pass** — `tsc -b && vite build`, 2416 modules transformed, built in 307ms. `dist/assets/TeamDirectoryPage-huOaFO9V.js  98.26 kB │ gzip: 32.47 kB` — confirms the page is genuinely code-split into its own lazy chunk. |
| `npm run format:check` | ✅ **Pass** (extra check, not required by the skill) — 5 new files initially failed Prettier and were fixed with `prettier --write`; re-checked clean. Worth noting: nothing warns you about this during authoring, and `lint-staged` would have caught it only at commit time. |
| Live API check | ✅ `npm run mock-api` + `curl http://localhost:3001/teamMembers` → `200`, correct seeded payload |

## Assumptions made

1. **Feature-scoped over `shared/`** for all three components — decision rule step 4
   (used by exactly one page, no stated plan to reuse) fires before step 5. Noted above
   that `ViewModeToggle` is the one most likely to want promotion later.
2. **5-file contract, no `.stories.tsx`** — Storybook is not installed (no
   `.storybook/`, no Storybook deps), and the template's existing components are all
   5-file. No stories written.
3. **snake_case DTO field names in `db.json`** (`full_name`, `job_title`, `is_active`)
   rather than making the DTO identical to the domain model. `03-data-layer.md`'s own
   example does exactly this, and an identity mapper would have made the mapper layer
   untested theatre.
4. **`initials` derived in the mapper, not in the component** — so every consumer shows
   the same fallback text and the logic is unit-testable in one place. Capped at 2
   characters; falls back to `"?"` for an unusable name.
5. **Empty `avatar_url` normalised to `null` in the mapper**, and `AvatarImage` rendered
   conditionally on it — makes the `AvatarFallback` path deterministic instead of
   depending on a real failed image load, which jsdom can't reproduce.
6. **`DialogTitle` visible, not `sr-only`** — the assignment permits `sr-only` but the
   member's name is the dialog's actual subject, so hiding it would be strictly worse.
   The `sr-only` allowance is a fallback for when the design has no visible title.
7. **`TeamMemberDetailDialog` returns `null` when `member` is `null`** rather than
   staying mounted with `open={false}`. Simpler and keeps the "always has a
   `DialogTitle`" invariant trivially true; the cost is losing the close animation.
8. **Stretched-overlay `Button` for whole-card clickability** — see guidance gap 2.
9. **Roster lives in the same store as the view state**, not a separate `teamRoster`
   store. One page, one domain; splitting was judged over-engineering. Flagged above as
   reviewable.
10. **State starts at `{ status: "idle" }`** and the page treats `idle` and `loading`
    identically (both render the skeleton), so there is no flash of empty state before
    the first request resolves.
11. **Six skeleton placeholders with named string keys** (`"first"`…`"sixth"`) rather
    than `Array.from({length: 6})` with index keys — `core/11-performance.md` forbids
    array-index keys in dynamic lists. Arguably over-literal for a fixed-length static
    placeholder list, but it costs nothing.
12. **`Alert` + retry `Button` for the error state, `Empty` for the zero-results
    state** — neither was requested by the assignment, but
    `04-composition-patterns.md` explicitly names both as the right primitives instead
    of custom markup, and an `AsyncState<T>` union with an unhandled `error` branch
    would be worse. Deliberately did **not** add a toast (that's assignment 5's
    territory) or a `ThemeToggle` in the header (assignment 3's).
13. **`Separator` between header and content** — mild extra composition, same reasoning.
14. **Did not create `.env.local`.** `.env.example` documents
      `VITE_API_BASE_URL=http://localhost:3001`, `vite.config.ts` injects it for tests,
      and it is not needed for `tsc`/`test`/`build`. A human running `npm run dev` in
      this clone would need to copy it first.
15. **Did not touch the 8 pre-existing npm-audit vulnerabilities** or the 15
    pre-existing lint errors — out of scope for a feature test, and the skill forbids
    modifying repo files to fix things found during a run.
16. **Reported the ESLint-vs-rules conflict rather than suppressing it.** An
    `// eslint-disable-next-line react-hooks/set-state-in-effect` would have kept the
    documented hook pattern intact in one line. I judged a silent suppression on the
    project's very first data-loading page to be the wrong default — it would have
    hidden the single most useful finding of this run.

## Anything else worth flagging

- **The `check-barrel-exports.sh` type-only-export false positive is worth fixing
  first.** It will fire on every `types.ts` in every project built from this template,
  every time one is edited, which is precisely how warning fatigue starts — and once
  a hook is habitually ignored, its correct firings get ignored too.
- **Second: the `.types.ts`/`.constants.ts` suffix-stripping in the same hook's
  suggested fix.** An agent that follows the message literally writes an import
  specifier that doesn't resolve. The detection is right; only the generated example
  is wrong.
- **Third, and the real architectural one: the set-state-in-effect conflict.** It has
  no workaround that satisfies both `core/10-error-handling.md` and the ESLint config
  as written. Whichever way it's resolved (store actions own fetching / route loaders /
  an approved suppression / adopting a data library), it needs to be written down in
  `.claude/rules/`, because it is unavoidable on any page that loads a list.
- Base UI's `ToggleGroup` reports the **whole pressed set as an array** and, in
  single-select mode, still permits un-pressing the active item — yielding `[]`. A
  directory always needs *some* layout, so `ViewModeToggle` guards that case explicitly
  and has a test for it. Nothing in the rules or the vendored component's code hints at
  this; it was only found by reading `@base-ui/react`'s `.d.ts` directly. Likely to
  trip up assignment 3's `Tabs`/`InputGroup` work in a similar way — reading the Base
  UI type definitions rather than assuming Radix-style APIs is the general lesson.
- The vendored `src/components/ui/toggle-group.tsx` itself uses
  `style={{ "--gap": spacing }}` — an inline `style` prop that `check-no-inline-style.sh`
  would block if the file were ever re-saved. Expected for vendored code, but worth
  knowing that re-running `npx shadcn add toggle-group` would fight the hook.
