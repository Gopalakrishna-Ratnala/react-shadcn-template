import { RouterContextProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { getProducts } from "@/services/product";

import { productsLoader } from "./ProductsPage.loader";

import type { ProductDto } from "@/services/product/types";
import type { LoaderFunctionArgs } from "react-router";

vi.mock("@/services/product", () => ({
  getProducts: vi.fn(),
}));

const DTO: ProductDto = {
  id: 1,
  product_name: "Oak Desk Lamp",
  unit_price: 42.5,
  category: "Lighting",
  in_stock: true,
};

const makeLoaderArgs = (search = ""): LoaderFunctionArgs => {
  const url = `http://localhost/products${search}`;
  return {
    request: new Request(url),
    url: new URL(url),
    pattern: "/products",
    params: {},
    context: new RouterContextProvider(),
  };
};

describe("productsLoader", () => {
  it("fetches all products and returns an empty searchTerm when there's no ?q=", async () => {
    vi.mocked(getProducts).mockResolvedValueOnce({
      status: 200,
      data: [DTO],
      message: "OK",
    });

    const result = await productsLoader(makeLoaderArgs());

    expect(getProducts).toHaveBeenCalledWith(undefined);
    expect(result).toEqual({
      searchTerm: "",
      products: [
        {
          id: 1,
          name: "Oak Desk Lamp",
          priceInCents: 4250,
          category: "Lighting",
          inStock: true,
        },
      ],
    });
  });

  it("passes the ?q= param through to the service and echoes it back", async () => {
    vi.mocked(getProducts).mockResolvedValueOnce({
      status: 200,
      data: [],
      message: "OK",
    });

    const result = await productsLoader(makeLoaderArgs("?q=lamp"));

    expect(getProducts).toHaveBeenCalledWith("lamp");
    expect(result).toEqual({ searchTerm: "lamp", products: [] });
  });

  it("propagates a rejected getProducts call so the router's ErrorBoundary can catch it", async () => {
    vi.mocked(getProducts).mockRejectedValueOnce(
      new Error("Service unavailable"),
    );

    await expect(productsLoader(makeLoaderArgs())).rejects.toThrow(
      "Service unavailable",
    );
  });
});
