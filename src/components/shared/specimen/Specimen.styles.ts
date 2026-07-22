import { cn } from "@/lib/utils";

export const specimenContainerStyles = cn(
  "flex flex-col gap-3 rounded-lg border border-border bg-card p-4",
  "text-card-foreground shadow-sm",
);

export const specimenHeaderStyles = cn("flex flex-col gap-0.5");

export const specimenTitleStyles = cn(
  "text-sm font-semibold text-card-foreground",
);

export const specimenDescriptionStyles = cn("text-xs text-muted-foreground");

export const specimenBodyStyles = cn("flex flex-wrap items-center gap-3");
