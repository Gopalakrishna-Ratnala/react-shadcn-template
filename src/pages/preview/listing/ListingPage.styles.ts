import { cn } from "@/lib/utils";

export const pageStyles = cn("flex flex-col gap-6");

export const tableCardContentStyles = cn("p-0");

export const checkboxCellStyles = cn("w-10");

export const ownerCellStyles = cn("flex items-center gap-2");

export const ownerNameStyles = cn("text-sm");

export const updatedCellStyles = cn("text-sm text-muted-foreground");

export const rowActionsCellStyles = cn("w-10 text-right");

export const emptyStateContentStyles = cn(
  "flex flex-col items-center gap-4 py-12",
);

export const paginationFooterStyles = cn("flex items-center justify-between");

export const paginationSummaryStyles = cn("text-sm text-muted-foreground");

export const previewEmptyToggleStyles = cn(
  "flex items-center gap-2 text-sm text-muted-foreground",
);
