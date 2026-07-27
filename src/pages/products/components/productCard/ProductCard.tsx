import type { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: ProductCardProps): ReactElement => {
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
      {(onEdit ?? onDelete) && (
        <CardFooter className={styles.footer}>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(product)}
            >
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
