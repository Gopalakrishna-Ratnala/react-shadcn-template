import type { ProjectStatus } from "@/types";

export interface ListingProject {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  budget: string;
  dueDate: string;
  ownerName: string;
  ownerInitials: string;
}
