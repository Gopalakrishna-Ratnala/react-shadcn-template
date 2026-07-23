export type StatusBadgeTone =
  | "info"
  | "warning"
  | "success"
  | "destructive"
  | "muted";

export interface StatusBadgeProps {
  tone: StatusBadgeTone;
  label: string;
  className?: string;
}
