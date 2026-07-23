import { cn } from "@/lib/utils";

import { statusBadgeVariants } from "./StatusBadge.styles";
import type { StatusBadgeProps } from "./types";

/**
 * A semantic status pill driven entirely by design tokens. Tones map to the
 * theme's status colors, so every badge re-skins with the active theme.
 */
export function StatusBadge({ tone, label, className }: StatusBadgeProps) {
  return (
    <mark className={cn(statusBadgeVariants({ tone }), className)}>{label}</mark>
  );
}
