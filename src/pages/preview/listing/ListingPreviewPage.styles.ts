import { cn } from "@/lib/utils";

export const listingPreviewPageStyles = {
  wrapper: cn("flex flex-col gap-6"),
  emptyStateToggle: cn("flex items-center gap-2"),
  emptyStateLabel: cn("text-sm text-muted-foreground"),
  tableCard: cn("overflow-hidden rounded-lg border border-border"),
  ownerCell: cn("flex items-center gap-2"),
  numericCell: cn("text-right"),
  actionsCell: cn("text-right"),
  paginationFooter: cn(
    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  ),
  paginationSummary: cn("text-sm text-muted-foreground"),
  pagination: cn("sm:ml-auto"),
  emptyCell: cn("h-64"),
};
