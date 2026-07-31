import { cn } from "@/lib/utils";

export const previewShellStyles = {
  root: cn("flex min-h-screen flex-col bg-background text-foreground"),
  bar: cn(
    "sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur",
  ),
  barInner: cn("mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-2.5"),
  brand: cn(
    "hidden shrink-0 text-sm font-semibold whitespace-nowrap text-foreground sm:block",
  ),
  nav: cn("flex flex-1 flex-wrap items-center gap-1"),
  navLinkBase: cn(
    "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
    "hover:bg-muted hover:text-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  ),
  navLinkActive: cn(
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
  ),
  actions: cn("flex shrink-0 items-center gap-2"),
  main: cn("mx-auto w-full max-w-7xl px-4 py-6"),
};
