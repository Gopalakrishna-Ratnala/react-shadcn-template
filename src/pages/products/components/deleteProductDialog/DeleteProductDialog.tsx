import { useEffect, type ReactElement } from "react";

import { useFetcher } from "react-router";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ROUTES } from "@/constants";

import { deleteProductDialogStyles as styles } from "./DeleteProductDialog.styles";

import type { DeleteProductDialogProps } from "./types";
import type { ProductsActionData } from "../../ProductsPage.action";

export const DeleteProductDialog = ({
  open,
  onOpenChange,
  product,
}: DeleteProductDialogProps): ReactElement => {
  const fetcher = useFetcher<ProductsActionData>();
  const isDeleting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (fetcher.data.ok) {
      toast.success("Product deleted");
    } else {
      toast.error(fetcher.data.error ?? "Something went wrong");
    }
    onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the fetcher settling
  }, [fetcher.state, fetcher.data]);

  const handleConfirm = () => {
    if (!product) return;
    const formData = new FormData();
    formData.set("id", String(product.id));
    void fetcher.submit(formData, {
      method: "delete",
      action: ROUTES.PRODUCTS,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove{" "}
            {product && (
              <strong className={styles.productName}>{product.name}</strong>
            )}{" "}
            from the catalog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
