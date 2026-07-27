import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductCard } from "./ProductCard";

import type { Product } from "@/types/product.types";

const PRODUCT: Product = {
  id: 1,
  name: "Oak Desk Lamp",
  priceInCents: 4250,
  category: "Lighting",
  inStock: true,
};

describe("ProductCard", () => {
  it("renders the product's name, category, and formatted price", () => {
    render(<ProductCard product={PRODUCT} />);

    expect(screen.getByText("Oak Desk Lamp")).toBeInTheDocument();
    expect(screen.getByText("Lighting")).toBeInTheDocument();
    expect(screen.getByText("$42.50")).toBeInTheDocument();
  });

  it("shows an 'In stock' badge when the product is in stock", () => {
    render(<ProductCard product={PRODUCT} />);
    expect(screen.getByText("In stock")).toBeInTheDocument();
  });

  it("shows an 'Out of stock' badge when the product is not in stock", () => {
    render(<ProductCard product={{ ...PRODUCT, inStock: false }} />);
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });
});
