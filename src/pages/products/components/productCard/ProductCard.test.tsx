import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

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

  it("renders no action buttons when no callbacks are provided", () => {
    render(<ProductCard product={PRODUCT} />);
    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  it("calls onEdit with the product when Edit is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<ProductCard product={PRODUCT} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(onEdit).toHaveBeenCalledWith(PRODUCT);
  });

  it("calls onDelete with the product when Delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<ProductCard product={PRODUCT} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledWith(PRODUCT);
  });
});
