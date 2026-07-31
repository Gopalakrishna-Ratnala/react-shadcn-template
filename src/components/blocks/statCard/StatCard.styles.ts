import { cn } from "@/lib/utils";

export const statCardStyles = {
  card: cn("gap-3"),
  header: cn("flex flex-row items-center justify-between gap-2 space-y-0"),
  label: cn("text-sm font-medium text-muted-foreground"),
  icon: cn("text-muted-foreground"),
  value: cn("text-2xl font-semibold text-foreground"),
  delta: cn("flex items-center gap-1 text-sm"),
  deltaUp: cn("text-success"),
  deltaDown: cn("text-destructive"),
};
