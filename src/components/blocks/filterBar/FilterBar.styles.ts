import { cn } from "@/lib/utils";

export const containerStyles = cn(
  "flex flex-col gap-3 rounded-lg border border-border bg-card p-3",
  "sm:flex-row sm:flex-wrap sm:items-center",
);

export const searchStyles = cn("w-full sm:max-w-xs");

export const selectStyles = cn("w-full sm:w-44");

export const extraWrapStyles = cn(
  "flex flex-wrap items-center gap-2 sm:ml-auto",
);
