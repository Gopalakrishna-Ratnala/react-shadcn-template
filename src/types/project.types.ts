export type ProjectStatus =
  "in-progress" | "in-review" | "completed" | "on-hold" | "at-risk";

export interface Project {
  id: string;
  name: string;
  clientName: string;
  status: ProjectStatus;
  ownerName: string;
  ownerInitials: string;
  updatedAt: string;
}
