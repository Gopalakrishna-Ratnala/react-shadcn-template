import type { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { productCardStyles as styles } from "./ProductCard.styles";

import type { ProductCardProps } from "./types";

const formatPrice = (priceInCents: number): string =>
  (priceInCents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });

export const ProductCard = ({ product }: ProductCardProps): ReactElement => {
  return (
    <Card>
      <CardHeader className={styles.header}>
        <hgroup>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.category}</CardDescription>
        </hgroup>
        <Badge variant={product.inStock ? "default" : "outline"}>
          {product.inStock ? "In stock" : "Out of stock"}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className={styles.price}>{formatPrice(product.priceInCents)}</p>
      </CardContent>
    </Card>
  );
};
