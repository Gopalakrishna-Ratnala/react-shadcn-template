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
    <div className={colorSwatchStyles.wrapper}>
      <div className={cn(colorSwatchStyles.swatch, bgClassName, textClassName)}>
        Aa
      </div>
      <div className={colorSwatchStyles.caption}>
        <span className={colorSwatchStyles.label}>{label}</span>
        <span className={colorSwatchStyles.token}>{token}</span>
      </div>
    </div>
  );
}
