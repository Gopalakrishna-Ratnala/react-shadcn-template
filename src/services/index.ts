export { apiClient, ApiError } from "./apiClient";
export {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./product";
export type { ProductDto, ProductInput } from "./product";
export { mapProductDtoToProduct } from "./mappers/productMapper";
