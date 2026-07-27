import { mapProductDtoToProduct } from "@/services/mappers/productMapper";
import { getProducts } from "@/services/product";

import type { Product } from "@/types/product.types";
import type { LoaderFunctionArgs } from "react-router";

export interface ProductsLoaderData {
  products: Product[];
  searchTerm: string;
}

export const productsLoader = async ({
  request,
}: LoaderFunctionArgs): Promise<ProductsLoaderData> => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q") ?? "";

  const response = await getProducts(searchTerm || undefined);
  const products = response.data.map(mapProductDtoToProduct);

  return { products, searchTerm };
};
