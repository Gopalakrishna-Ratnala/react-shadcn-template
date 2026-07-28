import type { ProductDto } from "@/services/product/types";
import type { Product } from "@/types/product.types";

export const mapProductDtoToProduct = (dto: ProductDto): Product => ({
  id: dto.id,
  name: dto.product_name,
  priceInCents: Math.round(dto.unit_price * 100),
  category: dto.category,
  inStock: dto.in_stock,
});
