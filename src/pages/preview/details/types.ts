import type { ProjectStatus } from "@/types";

export interface DetailsProperty {
  label: string;
  value: string;
}

export interface DetailsActivityEntry {
  id: string;
  actorName: string;
  summary: string;
  timestamp: string;
}

export interface DetailsRecord {
  title: string;
  client: string;
  status: ProjectStatus;
  description: string;
  properties: DetailsProperty[];
  ownerName: string;
  ownerInitials: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}
