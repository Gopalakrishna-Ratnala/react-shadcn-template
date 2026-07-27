import { cn } from "@/lib/utils";

export const productCardStyles = {
  header: cn("flex flex-row items-start justify-between gap-2"),
  price: cn("text-lg font-semibold text-foreground"),
  meta: cn("flex items-center gap-2 text-sm text-muted-foreground"),
  footer: cn("flex justify-end gap-2"),
};
