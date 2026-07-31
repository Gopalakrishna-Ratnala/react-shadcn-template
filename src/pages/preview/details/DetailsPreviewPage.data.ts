import type { DetailsActivityEntry, DetailsRecord } from "./types";

export const DETAILS_RECORD: DetailsRecord = {
  title: "Brand refresh",
  client: "Acme Corp",
  status: "In progress",
  description:
    "A full brand refresh for Acme Corp covering logo, typography, color system, and a refreshed marketing site — kicked off after their Series B to support a broader go-to-market push.",
  properties: [
    { label: "Client", value: "Acme Corp" },
    { label: "Budget", value: "$48,000" },
    { label: "Due date", value: "2026-08-15" },
    { label: "Engagement type", value: "Fixed-scope" },
  ],
  ownerName: "Priya Nair",
  ownerInitials: "PN",
  createdAt: "2026-05-12",
  updatedAt: "2026-07-29",
  tags: ["Branding", "Marketing site", "Priority"],
};

export const DETAILS_ACTIVITY: DetailsActivityEntry[] = [
  {
    id: "act-1",
    actorName: "Priya Nair",
    summary: "submitted the marketing site mockups for review",
    timestamp: "2026-07-29",
  },
  {
    id: "act-2",
    actorName: "Owen Bennett",
    summary: "approved the updated color system",
    timestamp: "2026-07-24",
  },
  {
    id: "act-3",
    actorName: "Daniel Cho",
    summary: "left 3 comments on the typography spec",
    timestamp: "2026-07-18",
  },
  {
    id: "act-4",
    actorName: "Priya Nair",
    summary: "created the project brief and kicked off the engagement",
    timestamp: "2026-05-12",
  },
];
