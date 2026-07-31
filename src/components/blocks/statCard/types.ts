import type { ReactNode } from "react";

export interface StatCardDelta {
  value: string;
  direction: "up" | "down";
}

export interface StatCardProps {
  label: string;
  value: string;
  delta?: StatCardDelta;
  icon?: ReactNode;
}
