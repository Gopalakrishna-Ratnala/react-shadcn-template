import type { StatusBadgeStatus } from "@/components/blocks";
import type { ProjectStatus } from "@/types";

export const PROJECT_STATUS_BADGE_MAP: Record<
  ProjectStatus,
  StatusBadgeStatus
> = {
  Planning: "default",
  "In progress": "info",
  "At risk": "warning",
  Completed: "success",
  Cancelled: "destructive",
};
