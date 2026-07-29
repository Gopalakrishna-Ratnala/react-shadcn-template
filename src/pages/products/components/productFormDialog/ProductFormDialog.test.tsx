import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

import { ROUTES } from "@/constants";

import { ProductFormDialog } from "./ProductFormDialog";

import type { ProductFormDialogProps } from "./types";
import type { Product } from "@/types/product.types";
import type { ActionFunctionArgs } from "react-router";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const PRODUCT: Product = {
  id: 1,
  name: "Oak Desk Lamp",
  priceInCents: 4250,
  category: "Lighting",
  inStock: true,
};

const renderDialog = (
  props: Partial<ProductFormDialogProps>,
  action: (
    args: ActionFunctionArgs,
  ) => Promise<{ ok: boolean; error?: string }>,
) => {
  const onOpenChange = vi.fn();
  const router = createMemoryRouter(
    [
      {
        path: ROUTES.PRODUCTS,
        action,
        Component: () => (
          <ProductFormDialog
            open
            onOpenChange={onOpenChange}
            mode="create"
            {...props}
          />
        ),
      },
    ],
    { initialEntries: [ROUTES.PRODUCTS] },
  );
  render(<RouterProvider router={router} />);
  return { onOpenChange };
};

describe("ProductFormDialog", () => {
  it("shows the create-mode title and empty fields", () => {
    renderDialog({ mode: "create" }, async () => ({ ok: true }));

    expect(screen.getByText("Add product")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("pre-fills fields from the given product in edit mode", () => {
    renderDialog({ mode: "edit", product: PRODUCT }, async () => ({
      ok: true,
    }));

    expect(screen.getByText("Edit product")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Oak Desk Lamp");
    expect(screen.getByLabelText("Category")).toHaveValue("Lighting");
    expect(screen.getByLabelText("Price (USD)")).toHaveValue(42.5);
  });

  it("shows validation errors instead of submitting when fields are empty", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => ({ ok: true }));
    renderDialog({ mode: "create" }, action);

    await user.clear(screen.getByLabelText("Price (USD)"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it("submits a POST with the form fields on valid create, then closes and toasts success", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async ({ request }: ActionFunctionArgs) => {
      const formData = await request.formData();
      expect(request.method).toBe("POST");
      expect(formData.get("name")).toBe("Standing Desk");
      expect(formData.get("category")).toBe("Furniture");
      expect(formData.get("price")).toBe("99");
      expect(formData.get("inStock")).toBe("true");
      return { ok: true };
    });
    const { onOpenChange } = renderDialog({ mode: "create" }, action);

    await user.type(screen.getByLabelText("Name"), "Standing Desk");
    await user.type(screen.getByLabelText("Category"), "Furniture");
    await user.clear(screen.getByLabelText("Price (USD)"));
    await user.type(screen.getByLabelText("Price (USD)"), "99");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    expect(toast.success).toHaveBeenCalledWith("Product created");
  });

  it("includes the product id and uses PATCH when editing", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async ({ request }: ActionFunctionArgs) => {
      const formData = await request.formData();
      expect(request.method).toBe("PATCH");
      expect(formData.get("id")).toBe("1");
      return { ok: true };
    });
    renderDialog({ mode: "edit", product: PRODUCT }, action);

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });
  });

  it("toasts an error and keeps the dialog open when the action fails", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => ({ ok: false, error: "Server error" }));
    const { onOpenChange } = renderDialog(
      { mode: "edit", product: PRODUCT },
      action,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
