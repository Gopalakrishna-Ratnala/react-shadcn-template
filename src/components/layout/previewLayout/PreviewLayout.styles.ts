import { cn } from "@/lib/utils";

export const rootStyles = cn(
  "flex min-h-screen flex-col bg-background font-sans text-foreground",
);

export const barStyles = cn(
  "sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur",
);

export const barInnerStyles = cn(
  "mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-2.5",
);

export const brandStyles = cn(
  "hidden shrink-0 text-sm font-semibold whitespace-nowrap text-foreground sm:block",
);

export const navStyles = cn(
  "flex flex-1 flex-wrap items-center gap-1",
);

export const navLinkBaseStyles = cn(
  "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
  "hover:bg-muted hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

export const navLinkActiveStyles = cn(
  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
);

export const actionsStyles = cn("flex shrink-0 items-center gap-2");

export const mainStyles = cn("mx-auto w-full max-w-7xl px-4 py-6");
