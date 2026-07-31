import type { ProjectStatus } from "@/types";

export interface DashboardRevenuePoint {
  month: string;
  revenue: number;
  target: number;
}

export interface DashboardGoalBreakdownItem {
  label: string;
  value: string;
}

export interface DashboardStatusSlice {
  status: ProjectStatus;
  count: number;
}

export interface DashboardActivityRow {
  id: string;
  project: string;
  client: string;
  status: ProjectStatus;
  updatedAt: string;
}
