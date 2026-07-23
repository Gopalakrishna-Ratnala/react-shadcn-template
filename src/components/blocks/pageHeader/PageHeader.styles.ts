import { cn } from "@/lib/utils";

export const headerStyles = cn("flex flex-col gap-3");

export const rowStyles = cn(
  "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
);

export const titleWrapStyles = cn("flex flex-col gap-1");

export const titleStyles = cn(
  "text-2xl font-semibold tracking-tight text-foreground",
);

export const descriptionStyles = cn("max-w-2xl text-sm text-muted-foreground");

export const actionStyles = cn("flex flex-wrap items-center gap-2");
