# Data Fetching Strategy — Fetch + json-server (fixed) + Optional Data Layer

## HTTP client — fixed, not a choice

This project is local/frontend-only for now. **json-server** serves a real local REST
API from `db.json`; the app talks to it via a native-`fetch`-based `apiClient`
(`src/services/apiClient.ts`) — no HTTP library dependency. See `01-fetch-client.md`.

This was previously an open "pick Axios or an alternative" choice; it's now resolved
for this template. If a future project genuinely needs a different HTTP client (e.g.
swapping to a real backend that requires a different auth flow), that's a deliberate,
explicit decision to make with the user — not a default to fall back to.

## Step 2 — Enable optional data layer patterns (ask the user)

These two files add the full service/mock/mapper architecture on top of `apiClient`. They work together — keep both or delete both.

| Feature | File | Keep when | Delete when |
| --- | --- | --- | --- |
| API service rules | `02-api-services.md` | Project uses a structured service layer with typed DTOs | Simple project; minimal service patterns are enough |
| Data layer architecture | `03-data-layer.md` | Project uses DTO → mapper → domain model flow against json-server | No mapper layer needed |

## How to Switch (only if moving away from json-server entirely)

1. Delete `01-fetch-client.md` and replace with rules for the new client/library.
2. Delete `02-api-services.md` and `03-data-layer.md` if the project does not need a structured data layer.
3. In `CLAUDE.md`, update the Data Fetching rows to reflect what is kept.
4. Update the dependency in `package.json` (remove `json-server`, add the new library).
5. Replace `src/services/apiClient.ts` to match the new library's patterns.
6. Remove `db.json`, `.env.example`'s `VITE_API_BASE_URL`, and the `mock-api` script if no longer applicable.
