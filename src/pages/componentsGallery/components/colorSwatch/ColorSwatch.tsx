import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { colorSwatchStyles } from "./ColorSwatch.styles";
import type { ColorSwatchProps } from "./types";

export function ColorSwatch({
  label,
  token,
  bgClassName,
  textClassName,
}: ColorSwatchProps) {
  return (
    <figure className={colorSwatchStyles.wrapper}>
      <Card
        className={cn(colorSwatchStyles.swatch, bgClassName, textClassName)}
      >
        Aa
      </Card>
      <figcaption className={colorSwatchStyles.caption}>
        <p className={colorSwatchStyles.label}>{label}</p>
        <small className={colorSwatchStyles.token}>{token}</small>
      </figcaption>
    </figure>
  );
}
