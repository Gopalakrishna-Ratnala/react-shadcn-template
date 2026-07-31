import { cn } from "@/lib/utils";

export const pageHeaderStyles = {
  wrapper: cn("flex flex-col gap-4"),
  breadcrumb: cn("flex flex-col gap-2"),
  row: cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"),
  heading: cn("flex flex-col gap-1"),
  title: cn("text-2xl font-semibold text-foreground"),
  description: cn("text-sm text-muted-foreground"),
  actions: cn("flex flex-wrap items-center gap-2"),
  breadcrumbItem: cn("flex items-center gap-1.5"),
};
