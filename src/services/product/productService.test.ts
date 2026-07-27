import { describe, expect, it, vi } from "vitest";

import { apiClient } from "@/services/apiClient";

import { getProducts } from "./productService";

import type { ProductDto } from "./types";

vi.mock("@/services/apiClient", () => ({
  apiClient: { get: vi.fn() },
}));

const DTO: ProductDto = {
  id: 1,
  product_name: "Oak Desk Lamp",
  unit_price: 42.5,
  category: "Lighting",
  in_stock: true,
};

describe("getProducts", () => {
  it("returns an ApiResponse wrapping the raw DTO list", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce([DTO]);

    const result = await getProducts();

    expect(apiClient.get).toHaveBeenCalledWith("/products");
    expect(result).toEqual({ status: 200, data: [DTO], message: "OK" });
  });

  it("appends an encoded ?q= param when a search term is provided", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce([DTO]);

    await getProducts("desk lamp");

    expect(apiClient.get).toHaveBeenCalledWith("/products?q=desk%20lamp");
  });

  it("rethrows a real Error as-is", async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error("network down"));

    await expect(getProducts()).rejects.toThrow("network down");
  });

  it("wraps a non-Error rejection in a typed Error", async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce("not an Error instance");

    await expect(getProducts()).rejects.toThrow(
      "Unexpected error in getProducts",
    );
  });
});
