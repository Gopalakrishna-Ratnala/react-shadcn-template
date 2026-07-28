import { useEffect, type ReactElement } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";

import { productFormDialogStyles as styles } from "./ProductFormDialog.styles";
import {
  productFormSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "../../ProductsPage.schema";

import type { ProductFormDialogProps } from "./types";
import type { ProductsActionData } from "../../ProductsPage.action";

const getDefaultValues = (
  product: ProductFormDialogProps["product"],
): ProductFormInput => ({
  name: product?.name ?? "",
  category: product?.category ?? "",
  price: product ? product.priceInCents / 100 : 0,
  inStock: product?.inStock ?? true,
});

export const ProductFormDialog = ({
  open,
  onOpenChange,
  mode,
  product,
}: ProductFormDialogProps): ReactElement => {
  const fetcher = useFetcher<ProductsActionData>();
  const isSubmitting = fetcher.state !== "idle";

  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getDefaultValues(product),
  });

  // Re-sync whenever the dialog opens (or targets a different product), so
  // "Edit" on a second product never shows the first product's stale values.
  useEffect(() => {
    form.reset(getDefaultValues(product));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form is stable from useForm; only re-run on open/product change
  }, [open, product]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (fetcher.data.ok) {
      toast.success(mode === "create" ? "Product created" : "Product updated");
      onOpenChange(false);
    } else {
      toast.error(fetcher.data.error ?? "Something went wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the fetcher settling
  }, [fetcher.state, fetcher.data]);

  const onSubmit = (values: ProductFormValues) => {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("category", values.category);
    formData.set("price", String(values.price));
    formData.set("inStock", String(values.inStock));
    if (mode === "edit" && product) {
      formData.set("id", String(product.id));
    }
    void fetcher.submit(formData, {
      method: mode === "create" ? "post" : "patch",
      action: ROUTES.PRODUCTS,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add product" : "Edit product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new item to the catalog."
              : "Update this product's details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="product-name">Name</FieldLabel>
              <Input
                id="product-name"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!form.formState.errors.category}>
              <FieldLabel htmlFor="product-category">Category</FieldLabel>
              <Input
                id="product-category"
                aria-invalid={!!form.formState.errors.category}
                {...form.register("category")}
              />
              {form.formState.errors.category && (
                <FieldError>
                  {form.formState.errors.category.message}
                </FieldError>
              )}
            </Field>

            <Field data-invalid={!!form.formState.errors.price}>
              <FieldLabel htmlFor="product-price">Price (USD)</FieldLabel>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                aria-invalid={!!form.formState.errors.price}
                {...form.register("price")}
              />
              {form.formState.errors.price && (
                <FieldError>{form.formState.errors.price.message}</FieldError>
              )}
            </Field>

            <Field className={styles.checkboxRow}>
              <Controller
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <Checkbox
                    id="product-in-stock"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <FieldLabel htmlFor="product-in-stock">In stock</FieldLabel>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
