# Data Fetching Strategy — Choose One + Optional Add-Ons

## Step 1 — Pick your HTTP client (choose one, delete the rest)

| Strategy | File to keep | File to delete |
| --- | --- | --- |
| **Axios** (default) | `01-axios.md` | — |
| Other (TanStack Query, SWR, fetch) | *(add when needed)* | `01-axios.md` |

## Step 2 — Enable optional data layer patterns (ask the user)

These two files add the full service/mock/mapper architecture on top of the HTTP client. They work together — keep both or delete both.

| Feature | File | Keep when | Delete when |
| --- | --- | --- | --- |
| API service rules | `02-api-services.md` | Project uses a structured service layer with typed DTOs | Simple project; minimal service patterns are enough |
| Data layer architecture | `03-data-layer.md` | Project uses mocks → mapper → domain model flow | No mock/mapper layer needed |

## How to Switch

1. Delete the HTTP client file you are NOT using.
2. Delete `02-api-services.md` and `03-data-layer.md` if the project does not need a structured data layer.
3. In `CLAUDE.md`, update the Data Fetching rows to reflect what is kept.
4. Update the dependency in `package.json`.
5. Replace or remove `src/services/apiClient.ts` to match the new library's patterns.
