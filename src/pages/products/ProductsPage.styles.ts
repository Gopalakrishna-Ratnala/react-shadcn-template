import { cn } from "@/lib/utils";

export const productsPageStyles = {
  wrapper: cn("mx-auto flex max-w-4xl flex-col gap-6 p-6"),
  searchForm: cn("flex items-center gap-2"),
  grid: cn("grid grid-cols-1 gap-4 sm:grid-cols-2"),
  pending: cn("text-sm text-muted-foreground"),
};
