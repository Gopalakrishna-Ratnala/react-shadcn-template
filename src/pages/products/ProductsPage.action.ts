import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/product";

import type { ProductInput } from "@/services/product/types";
import type { ActionFunctionArgs } from "react-router";

export interface ProductsActionData {
  ok: boolean;
  error?: string;
}

const parseProductInput = (formData: FormData): ProductInput => ({
  name: String(formData.get("name") ?? ""),
  category: String(formData.get("category") ?? ""),
  price: Number(formData.get("price") ?? 0),
  inStock: formData.get("inStock") === "true",
});

export const productsAction = async ({
  request,
}: ActionFunctionArgs): Promise<ProductsActionData> => {
  try {
    const formData = await request.formData();

    switch (request.method) {
      case "POST": {
        await createProduct(parseProductInput(formData));
        return { ok: true };
      }
      case "PATCH": {
        const id = Number(formData.get("id"));
        await updateProduct(id, parseProductInput(formData));
        return { ok: true };
      }
      case "DELETE": {
        const id = Number(formData.get("id"));
        await deleteProduct(id);
        return { ok: true };
      }
      default: {
        return { ok: false, error: `Unsupported method: ${request.method}` };
      }
    }
  } catch (error: unknown) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
