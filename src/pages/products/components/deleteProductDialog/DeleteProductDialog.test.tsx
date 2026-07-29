import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

import { ROUTES } from "@/constants";

import { DeleteProductDialog } from "./DeleteProductDialog";

import type { DeleteProductDialogProps } from "./types";
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
  props: Partial<DeleteProductDialogProps>,
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
          <DeleteProductDialog
            open
            onOpenChange={onOpenChange}
            product={PRODUCT}
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

describe("DeleteProductDialog", () => {
  it("shows the target product's name in the confirmation copy", () => {
    renderDialog({}, async () => ({ ok: true }));

    expect(screen.getByText("Delete product?")).toBeInTheDocument();
    expect(screen.getByText("Oak Desk Lamp")).toBeInTheDocument();
  });

  it("submits a DELETE with the product's id, then closes and toasts success", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async ({ request }: ActionFunctionArgs) => {
      const formData = await request.formData();
      expect(request.method).toBe("DELETE");
      expect(formData.get("id")).toBe("1");
      return { ok: true };
    });
    const { onOpenChange } = renderDialog({}, action);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    expect(toast.success).toHaveBeenCalledWith("Product deleted");
  });

  it("toasts an error when the delete fails", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => ({ ok: false, error: "Server error" }));
    renderDialog({}, action);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
  });
});
