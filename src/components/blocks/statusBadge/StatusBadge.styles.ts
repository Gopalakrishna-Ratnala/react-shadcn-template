import { cva } from "class-variance-authority";

export const statusBadgeVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap not-italic",
  {
    variants: {
      tone: {
        info: "border-transparent bg-info/10 text-info",
        warning: "border-transparent bg-warning/10 text-warning",
        success: "border-transparent bg-success/10 text-success",
        destructive: "border-transparent bg-destructive/10 text-destructive",
        muted: "border-border bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      tone: "muted",
    },
  },
);
