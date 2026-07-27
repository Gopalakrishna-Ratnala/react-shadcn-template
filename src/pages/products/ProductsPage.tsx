import type { ChangeEvent, ReactElement } from "react";

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

import { ProductCard } from "./components";
import { productsPageStyles as styles } from "./ProductsPage.styles";

import type { ProductsLoaderData } from "./ProductsPage.loader";

export const ProductsPage = (): ReactElement => {
  const { products, searchTerm } =
    useLoaderData() as unknown as ProductsLoaderData;
  const navigation = useNavigation();
  const storeSearchTerm = useProductFiltersStore((state) => state.searchTerm);
  const setSearchTerm = useProductFiltersStore((state) => state.setSearchTerm);

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
    <div className={styles.wrapper}>
      <h1>Products</h1>

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
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
