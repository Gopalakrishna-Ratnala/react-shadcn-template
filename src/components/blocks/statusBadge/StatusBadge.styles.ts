import { cva } from "class-variance-authority";

export const statusBadgeVariants = cva("", {
  variants: {
    status: {
      default: "border-border bg-muted text-muted-foreground",
      destructive: "bg-destructive/10 text-destructive dark:bg-destructive/20",
      success: "bg-success/10 text-success dark:bg-success/20",
      warning: "bg-warning/10 text-warning dark:bg-warning/20",
      info: "bg-info/10 text-info dark:bg-info/20",
    },
  },
  defaultVariants: {
    status: "default",
  },
});
