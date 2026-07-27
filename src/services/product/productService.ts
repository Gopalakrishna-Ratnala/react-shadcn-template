import { API_ENDPOINTS } from "@/constants";
import { apiClient } from "@/services/apiClient";

import type { ProductDto, ProductInput } from "./types";
import type { ApiResponse } from "@/types/common.types";

export const getProducts = async (
  searchTerm?: string,
): Promise<ApiResponse<ProductDto[]>> => {
  try {
    const path = searchTerm
      ? `${API_ENDPOINTS.PRODUCTS}?q=${encodeURIComponent(searchTerm)}`
      : API_ENDPOINTS.PRODUCTS;
    const data = await apiClient.get<ProductDto[]>(path);
    return { status: 200, data, message: "OK" };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error in getProducts");
  }
};

const toDto = (input: ProductInput): Omit<ProductDto, "id"> => ({
  product_name: input.name,
  unit_price: input.price,
  category: input.category,
  in_stock: input.inStock,
});

export const createProduct = async (
  input: ProductInput,
): Promise<ApiResponse<ProductDto>> => {
  try {
    const data = await apiClient.post<ProductDto>(
      API_ENDPOINTS.PRODUCTS,
      toDto(input),
    );
    return { status: 201, data, message: "Created" };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error in createProduct");
  }
};

export const updateProduct = async (
  id: number,
  input: ProductInput,
): Promise<ApiResponse<ProductDto>> => {
  try {
    const data = await apiClient.patch<ProductDto>(
      `${API_ENDPOINTS.PRODUCTS}/${id}`,
      toDto(input),
    );
    return { status: 200, data, message: "Updated" };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error in updateProduct");
  }
};

export const deleteProduct = async (id: number): Promise<ApiResponse<null>> => {
  try {
    await apiClient.del(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    return { status: 200, data: null, message: "Deleted" };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Unexpected error in deleteProduct");
  }
};
