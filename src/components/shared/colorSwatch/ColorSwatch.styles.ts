import { cn } from "@/lib/utils";

export const swatchContainerStyles = cn("flex flex-col gap-1.5");

export const swatchChipStyles = cn(
  "h-14 w-full rounded-md border border-border shadow-sm",
);

export const swatchCaptionStyles = cn("flex flex-col gap-0.5");

export const swatchLabelStyles = cn(
  "font-mono text-xs font-medium text-foreground",
);

export const swatchValueStyles = cn(
  "font-mono text-xs text-muted-foreground uppercase",
);
