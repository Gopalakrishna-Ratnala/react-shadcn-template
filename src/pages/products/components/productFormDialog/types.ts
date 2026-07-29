import type { Product } from "@/types/product.types";

export type ProductFormMode = "create" | "edit";

export interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ProductFormMode;
  product?: Product;
}
