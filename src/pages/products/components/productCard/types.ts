import type { Product } from "@/types/product.types";

export interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}
