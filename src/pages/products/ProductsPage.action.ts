import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/product";

import { productFormSchema } from "./ProductsPage.schema";

import type { ProductInput } from "@/services/product/types";
import type { ActionFunctionArgs } from "react-router";

export interface ProductsActionData {
  ok: boolean;
  error?: string;
}

// Thrown only for known, safe-to-surface input problems (bad form data, bad
// id) - the outer catch below shows this message verbatim, but falls back to
// a generic message for anything else (e.g. a raw ApiError from the service
// layer), so internal request/network details never reach the user directly.
class ProductInputError extends Error {}

const parseProductInput = (formData: FormData): ProductInput => {
  const result = productFormSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    inStock: formData.get("inStock") === "true",
  });

  if (!result.success) {
    throw new ProductInputError(
      result.error.issues[0]?.message ?? "Invalid product data",
    );
  }

  return result.data;
};

const parseId = (formData: FormData): number => {
  const id = Number(formData.get("id"));
  if (Number.isNaN(id)) throw new ProductInputError("Invalid product id");
  return id;
};

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
        const id = parseId(formData);
        await updateProduct(id, parseProductInput(formData));
        return { ok: true };
      }
      case "DELETE": {
        const id = parseId(formData);
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
      error:
        error instanceof ProductInputError
          ? error.message
          : "Something went wrong. Please try again.",
    };
  }
};
