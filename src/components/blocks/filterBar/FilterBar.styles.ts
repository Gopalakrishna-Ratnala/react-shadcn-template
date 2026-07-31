import { cn } from "@/lib/utils";

export const filterBarStyles = {
  wrapper: cn(
    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  ),
  fields: cn("flex flex-col gap-3 sm:flex-row sm:items-center"),
  search: cn("w-full sm:w-64"),
  select: cn("w-full sm:w-40"),
  actions: cn("flex flex-wrap items-center gap-3"),
};
