import { cn } from "@/lib/utils";

export const bodyStyles = cn("flex flex-col gap-1");

export const labelStyles = cn("text-sm text-muted-foreground");

export const valueStyles = cn(
  "text-2xl font-semibold tracking-tight text-foreground",
);

export const trendRowStyles = cn("flex flex-wrap items-center gap-2");

export const trendBaseStyles = cn(
  "inline-flex items-center gap-0.5 text-xs font-medium not-italic",
);

export const trendUpStyles = cn("text-success");

export const trendDownStyles = cn("text-destructive");

export const captionStyles = cn("text-xs text-muted-foreground");
