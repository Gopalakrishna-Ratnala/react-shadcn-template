import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  inStock: z.boolean(),
});

// Split input (pre-coercion) from output (post-coercion) - useForm's generic
// needs the input shape; the submit handler needs the output shape.
export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;
