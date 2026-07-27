import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RouteErrorFallback } from "@/components/blocks";
import { getProducts } from "@/services/product";
import { useProductFiltersStore } from "@/store";

import { ProductsPage } from "./ProductsPage";
import { productsLoader } from "./ProductsPage.loader";

import type { ProductDto } from "@/services/product/types";

vi.mock("@/services/product", () => ({
  getProducts: vi.fn(),
}));

const LAMP: ProductDto = {
  id: 1,
  product_name: "Oak Desk Lamp",
  unit_price: 42.5,
  category: "Lighting",
  in_stock: true,
};

const CHAIR: ProductDto = {
  id: 2,
  product_name: "Ergonomic Office Chair",
  unit_price: 189.99,
  category: "Furniture",
  in_stock: false,
};

const renderProductsPage = (initialEntry = "/products") => {
  const router = createMemoryRouter(
    [
      {
        path: "/products",
        loader: productsLoader,
        Component: ProductsPage,
        ErrorBoundary: RouteErrorFallback,
      },
    ],
    { initialEntries: [initialEntry] },
  );
  return render(<RouterProvider router={router} />);
};

const INITIAL_STORE_STATE = useProductFiltersStore.getState();

describe("ProductsPage", () => {
  afterEach(() => {
    useProductFiltersStore.setState(INITIAL_STORE_STATE, true);
  });

  it("renders the heading and every fetched product as a card", async () => {
    vi.mocked(getProducts).mockResolvedValueOnce({
      status: 200,
      data: [LAMP, CHAIR],
      message: "OK",
    });

    renderProductsPage();

    expect(
      await screen.findByRole("heading", { name: "Products", level: 1 }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Oak Desk Lamp")).toBeInTheDocument();
    expect(screen.getByText("Ergonomic Office Chair")).toBeInTheDocument();
  });

  it("renders a labelled search input and a submit button", async () => {
    vi.mocked(getProducts).mockResolvedValueOnce({
      status: 200,
      data: [LAMP],
      message: "OK",
    });

    renderProductsPage();

    expect(await screen.findByText("Oak Desk Lamp")).toBeInTheDocument();
    expect(screen.getByLabelText("Search products")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("renders the empty state when no products are returned", async () => {
    vi.mocked(getProducts).mockResolvedValueOnce({
      status: 200,
      data: [],
      message: "OK",
    });

    renderProductsPage();

    expect(await screen.findByText("No products found")).toBeInTheDocument();
    expect(screen.getByText("There are no products yet.")).toBeInTheDocument();
  });

  it("submitting a search re-runs the loader with the typed term", async () => {
    const user = userEvent.setup();
    vi.mocked(getProducts).mockResolvedValueOnce({
      status: 200,
      data: [LAMP, CHAIR],
      message: "OK",
    });

    renderProductsPage();
    await screen.findByText("Oak Desk Lamp");

    vi.mocked(getProducts).mockResolvedValueOnce({
      status: 200,
      data: [LAMP],
      message: "OK",
    });

    const searchInput = screen.getByLabelText("Search products");
    await user.type(searchInput, "lamp");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(getProducts).toHaveBeenLastCalledWith("lamp");
    });
    expect(
      screen.queryByText("Ergonomic Office Chair"),
    ).not.toBeInTheDocument();
  });
});
