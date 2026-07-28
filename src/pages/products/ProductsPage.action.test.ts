import { RouterContextProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/product";

import { productsAction } from "./ProductsPage.action";

import type { ActionFunctionArgs } from "react-router";

vi.mock("@/services/product", () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

const makeActionArgs = (
  method: string,
  formData: Record<string, string>,
): ActionFunctionArgs => {
  const body = new URLSearchParams(formData);
  const url = "http://localhost/products";
  return {
    request: new Request(url, { method, body }),
    url: new URL(url),
    pattern: "/products",
    params: {},
    context: new RouterContextProvider(),
  };
};

describe("productsAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST creates a product from the form fields", async () => {
    vi.mocked(createProduct).mockResolvedValueOnce({
      status: 201,
      data: {
        id: 1,
        product_name: "Oak Desk Lamp",
        unit_price: 42.5,
        category: "Lighting",
        in_stock: true,
      },
      message: "Created",
    });

    const result = await productsAction(
      makeActionArgs("POST", {
        name: "Oak Desk Lamp",
        category: "Lighting",
        price: "42.5",
        inStock: "true",
      }),
    );

    expect(createProduct).toHaveBeenCalledWith({
      name: "Oak Desk Lamp",
      category: "Lighting",
      price: 42.5,
      inStock: true,
    });
    expect(result).toEqual({ ok: true });
  });

  it("PATCH updates the product at the given id", async () => {
    vi.mocked(updateProduct).mockResolvedValueOnce({
      status: 200,
      data: {
        id: 3,
        product_name: "Wireless Keyboard",
        unit_price: 59,
        category: "Electronics",
        in_stock: false,
      },
      message: "Updated",
    });

    const result = await productsAction(
      makeActionArgs("PATCH", {
        id: "3",
        name: "Wireless Keyboard",
        category: "Electronics",
        price: "59",
        inStock: "false",
      }),
    );

    expect(updateProduct).toHaveBeenCalledWith(3, {
      name: "Wireless Keyboard",
      category: "Electronics",
      price: 59,
      inStock: false,
    });
    expect(result).toEqual({ ok: true });
  });

  it("DELETE removes the product at the given id", async () => {
    vi.mocked(deleteProduct).mockResolvedValueOnce({
      status: 200,
      data: null,
      message: "Deleted",
    });

    const result = await productsAction(makeActionArgs("DELETE", { id: "3" }));

    expect(deleteProduct).toHaveBeenCalledWith(3);
    expect(result).toEqual({ ok: true });
  });

  it("returns a generic ok:false message when the service throws, without leaking the raw error", async () => {
    vi.mocked(createProduct).mockRejectedValueOnce(new Error("network down"));

    const result = await productsAction(
      makeActionArgs("POST", {
        name: "Oak Desk Lamp",
        category: "Lighting",
        price: "42.5",
        inStock: "true",
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: "Something went wrong. Please try again.",
    });
  });

  it("returns ok:false for an unsupported method", async () => {
    const result = await productsAction(makeActionArgs("PUT", {}));

    expect(result).toEqual({ ok: false, error: "Unsupported method: PUT" });
  });

  it("POST rejects invalid form data instead of calling the service", async () => {
    const result = await productsAction(
      makeActionArgs("POST", {
        name: "",
        category: "Lighting",
        price: "-5",
        inStock: "true",
      }),
    );

    expect(createProduct).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("PATCH rejects a non-numeric id instead of calling the service", async () => {
    const result = await productsAction(
      makeActionArgs("PATCH", {
        id: "not-a-number",
        name: "Wireless Keyboard",
        category: "Electronics",
        price: "59",
        inStock: "false",
      }),
    );

    expect(updateProduct).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: false, error: "Invalid product id" });
  });

  it("DELETE rejects a non-numeric id instead of calling the service", async () => {
    const result = await productsAction(
      makeActionArgs("DELETE", { id: "not-a-number" }),
    );

    expect(deleteProduct).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: false, error: "Invalid product id" });
  });
});
