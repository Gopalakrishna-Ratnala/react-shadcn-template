import { describe, expect, it, vi } from "vitest";

import { apiClient } from "@/services/apiClient";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./productService";

import type { ProductDto, ProductInput } from "./types";

vi.mock("@/services/apiClient", () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

const DTO: ProductDto = {
  id: 1,
  product_name: "Oak Desk Lamp",
  unit_price: 42.5,
  category: "Lighting",
  in_stock: true,
};

const INPUT: ProductInput = {
  name: "Oak Desk Lamp",
  category: "Lighting",
  price: 42.5,
  inStock: true,
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

describe("createProduct", () => {
  it("POSTs the input mapped to the DTO shape", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce(DTO);

    const result = await createProduct(INPUT);

    expect(apiClient.post).toHaveBeenCalledWith("/products", {
      product_name: "Oak Desk Lamp",
      unit_price: 42.5,
      category: "Lighting",
      in_stock: true,
    });
    expect(result).toEqual({ status: 201, data: DTO, message: "Created" });
  });

  it("wraps a non-Error rejection in a typed Error", async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce("nope");

    await expect(createProduct(INPUT)).rejects.toThrow(
      "Unexpected error in createProduct",
    );
  });
});

describe("updateProduct", () => {
  it("PATCHes the input mapped to the DTO shape, at the id's path", async () => {
    vi.mocked(apiClient.patch).mockResolvedValueOnce(DTO);

    const result = await updateProduct(1, INPUT);

    expect(apiClient.patch).toHaveBeenCalledWith("/products/1", {
      product_name: "Oak Desk Lamp",
      unit_price: 42.5,
      category: "Lighting",
      in_stock: true,
    });
    expect(result).toEqual({ status: 200, data: DTO, message: "Updated" });
  });
});

describe("deleteProduct", () => {
  it("DELETEs at the id's path", async () => {
    vi.mocked(apiClient.del).mockResolvedValueOnce(undefined);

    const result = await deleteProduct(1);

    expect(apiClient.del).toHaveBeenCalledWith("/products/1");
    expect(result).toEqual({ status: 200, data: null, message: "Deleted" });
  });
});
