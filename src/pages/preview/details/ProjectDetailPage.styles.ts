import { cn } from "@/lib/utils";

export const pageStyles = cn("flex flex-col gap-6");

export const headerActionsStyles = cn("flex flex-wrap items-center gap-2");

export const overviewGridStyles = cn("grid grid-cols-1 gap-4 lg:grid-cols-3");

export const overviewMainStyles = cn("flex flex-col gap-4 lg:col-span-2");

export const descriptionBodyStyles = cn(
  "flex flex-col gap-3 text-sm leading-relaxed",
);

export const propertyListStyles = cn(
  "grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2",
);

export const propertyItemStyles = cn("flex flex-col gap-1");

export const propertyLabelStyles = cn("text-sm text-muted-foreground");

export const propertyValueStyles = cn("text-sm font-medium");

export const metaCardBodyStyles = cn("flex flex-col gap-5");

export const ownerRowStyles = cn("flex items-center gap-3");

export const ownerNameStyles = cn("text-sm font-medium");

export const ownerRoleStyles = cn("text-sm text-muted-foreground");

export const metaListStyles = cn(
  "grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 text-sm",
);

export const activityListStyles = cn("flex flex-col gap-3");

export const metaRowStyles = cn(
  "flex items-center justify-between gap-4 text-sm",
);

export const metaLabelStyles = cn("text-muted-foreground");

export const tagRowStyles = cn("flex flex-wrap gap-2");

export const placeholderStyles = cn(
  "flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground",
);
