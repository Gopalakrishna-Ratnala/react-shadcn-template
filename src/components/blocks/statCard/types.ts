export interface StatCardProps {
  label: string;
  value: string;
  /** Signed percentage change; positive renders success, negative destructive. */
  changePercent: number;
  changeCaption: string;
}
