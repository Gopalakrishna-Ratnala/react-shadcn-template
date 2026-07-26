export interface ColorSwatchProps {
  /** Human-readable label, e.g. "Primary" */
  label: string;
  /** The CSS custom property name, e.g. "--primary" */
  token: string;
  /** Tailwind background utility bound to the token, e.g. "bg-primary" */
  bgClassName: string;
  /** Tailwind text utility for the foreground pairing, e.g. "text-primary-foreground" */
  textClassName?: string;
}
