export interface ColorSwatchProps {
  /** Human-readable token name, e.g. "primary". */
  label: string;
  /** The CSS custom property backing the token, e.g. "--primary". */
  cssVariable: string;
  /** Single-token background class bound to the token (e.g. "bg-primary"). */
  swatchClassName: string;
}
