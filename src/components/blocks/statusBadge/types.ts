export type StatusBadgeStatus =
  "success" | "warning" | "destructive" | "info" | "default";

export interface StatusBadgeProps {
  status: StatusBadgeStatus;
  label: string;
}
