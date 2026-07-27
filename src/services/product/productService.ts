import { API_ENDPOINTS } from "@/constants";
import { apiClient } from "@/services/apiClient";

import type { ProductDto } from "./types";
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
