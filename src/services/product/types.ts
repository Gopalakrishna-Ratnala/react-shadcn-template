export interface ProductDto {
  id: number;
  product_name: string;
  unit_price: number;
  category: string;
  in_stock: boolean;
}

export interface ProductInput {
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}
