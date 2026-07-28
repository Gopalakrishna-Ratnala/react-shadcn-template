import { useState, type ChangeEvent, type ReactElement } from "react";

import { Form, useLoaderData, useNavigation } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { useProductFiltersStore } from "@/store";

import {
  DeleteProductDialog,
  ProductCard,
  ProductFormDialog,
} from "./components";
import { productsLoader } from "./ProductsPage.loader";
import { productsPageStyles as styles } from "./ProductsPage.styles";

import type { Product } from "@/types/product.types";

interface FormDialogState {
  mode: "create" | "edit";
  product?: Product;
}

export const ProductsPage = (): ReactElement => {
  const { products, searchTerm } = useLoaderData<typeof productsLoader>();
  const navigation = useNavigation();
  const storeSearchTerm = useProductFiltersStore((state) => state.searchTerm);
  const setSearchTerm = useProductFiltersStore((state) => state.setSearchTerm);

  const [formDialog, setFormDialog] = useState<FormDialogState | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Reflects the router's own pending state for this navigation - no
  // component-level AsyncState<T> needed, since the loader is route-tied
  // (see PROJECT-CONTEXT.md Section 25, item 2).
  const isSearching =
    navigation.state === "loading" &&
    new URLSearchParams(navigation.location.search).has("q");

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.toolbar}>
        <h1>Products</h1>
        <Button onClick={() => setFormDialog({ mode: "create" })}>
          Add product
        </Button>
      </header>

      <Form method="get" role="search" className={styles.searchForm}>
        <Input
          key={searchTerm}
          type="search"
          name="q"
          aria-label="Search products"
          placeholder="Search products by name…"
          defaultValue={searchTerm}
          onChange={handleSearchInputChange}
        />
        <Button type="submit">Search</Button>
      </Form>

      {isSearching && <p className={styles.pending}>Searching…</p>}

      {products.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No products found</EmptyTitle>
            <EmptyDescription>
              {storeSearchTerm
                ? `No products match "${storeSearchTerm}".`
                : "There are no products yet."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className={styles.grid}>
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                onEdit={(target) =>
                  setFormDialog({ mode: "edit", product: target })
                }
                onDelete={setProductToDelete}
              />
            </li>
          ))}
        </ul>
      )}

      <ProductFormDialog
        open={formDialog !== null}
        onOpenChange={(open) => {
          if (!open) setFormDialog(null);
        }}
        mode={formDialog?.mode ?? "create"}
        product={formDialog?.product}
      />

      <DeleteProductDialog
        open={productToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
        product={productToDelete}
      />
    </section>
  );
};
