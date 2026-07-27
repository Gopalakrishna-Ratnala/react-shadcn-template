import { describe, expect, it } from "vitest";

import { mapProductDtoToProduct } from "./productMapper";

import type { ProductDto } from "@/services/product/types";

describe("mapProductDtoToProduct", () => {
  it("maps every DTO field to its domain equivalent", () => {
    const dto: ProductDto = {
      id: 1,
      product_name: "Oak Desk Lamp",
      unit_price: 42.5,
      category: "Lighting",
      in_stock: true,
    };

    expect(mapProductDtoToProduct(dto)).toEqual({
      id: 1,
      name: "Oak Desk Lamp",
      priceInCents: 4250,
      category: "Lighting",
      inStock: true,
    });
  });

  it("rounds a fractional-cent unit price to the nearest cent", () => {
    const dto: ProductDto = {
      id: 2,
      product_name: "Widget",
      unit_price: 19.999,
      category: "Misc",
      in_stock: false,
    };

    expect(mapProductDtoToProduct(dto).priceInCents).toBe(2000);
  });
});
