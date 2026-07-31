import type {
  DashboardActivityRow,
  DashboardGoalBreakdownItem,
  DashboardRevenuePoint,
  DashboardStatusSlice,
} from "./types";

export const REVENUE_BY_MONTH: DashboardRevenuePoint[] = [
  { month: "Mar", revenue: 68000, target: 65000 },
  { month: "Apr", revenue: 74500, target: 70000 },
  { month: "May", revenue: 71000, target: 75000 },
  { month: "Jun", revenue: 89500, target: 80000 },
  { month: "Jul", revenue: 96200, target: 90000 },
  { month: "Aug", revenue: 104800, target: 100000 },
];

export const GOAL_BREAKDOWN: DashboardGoalBreakdownItem[] = [
  { label: "Signed this quarter", value: "$68,200" },
  { label: "In pipeline", value: "$41,500" },
  { label: "Remaining to goal", value: "$28,000" },
];

export const PROJECT_STATUS_SPLIT: DashboardStatusSlice[] = [
  { status: "In progress", count: 6 },
  { status: "Planning", count: 2 },
  { status: "At risk", count: 1 },
  { status: "Completed", count: 9 },
  { status: "Cancelled", count: 1 },
];

export const RECENT_ACTIVITY: DashboardActivityRow[] = [
  {
    id: "PRJ-101",
    project: "Brand refresh",
    client: "Acme Corp",
    status: "In progress",
    updatedAt: "2026-07-29",
  },
  {
    id: "PRJ-108",
    project: "Investor deck refresh",
    client: "Solace Robotics",
    status: "In progress",
    updatedAt: "2026-07-28",
  },
  {
    id: "PRJ-104",
    project: "Marketing site rebuild",
    client: "Acme Corp",
    status: "Completed",
    updatedAt: "2026-07-26",
  },
  {
    id: "PRJ-102",
    project: "Mobile app redesign",
    client: "Northwind Labs",
    status: "At risk",
    updatedAt: "2026-07-25",
  },
  {
    id: "PRJ-105",
    project: "AI copilot prototype",
    client: "Solace Robotics",
    status: "Planning",
    updatedAt: "2026-07-24",
  },
];
