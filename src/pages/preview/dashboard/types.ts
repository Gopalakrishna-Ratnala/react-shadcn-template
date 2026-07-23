import type { StatusBadgeTone } from "@/components/blocks";

export interface DashboardStat {
  label: string;
  value: string;
  changePercent: number;
  changeCaption: string;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  target: number;
}

export interface StatusSlice {
  key: string;
  label: string;
  count: number;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  tone: StatusBadgeTone;
  statusLabel: string;
}
