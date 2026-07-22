import { useResolvedToken } from "@/hooks";
import { cn } from "@/lib/utils";

import {
  swatchCaptionStyles,
  swatchChipStyles,
  swatchContainerStyles,
  swatchLabelStyles,
  swatchValueStyles,
} from "./ColorSwatch.styles";
import type { ColorSwatchProps } from "./types";

export function ColorSwatch({
  label,
  cssVariable,
  swatchClassName,
}: ColorSwatchProps) {
  const value = useResolvedToken(cssVariable);

  return (
    <figure className={swatchContainerStyles}>
      <p className={cn(swatchChipStyles, swatchClassName)} aria-hidden="true" />
      <figcaption className={swatchCaptionStyles}>
        <code className={swatchLabelStyles}>{label}</code>
        <code className={swatchValueStyles}>{value || cssVariable}</code>
      </figcaption>
    </figure>
  );
}
