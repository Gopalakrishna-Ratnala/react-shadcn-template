import type { Product } from "@/types/product.types";

export interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  product?: Product;
}
