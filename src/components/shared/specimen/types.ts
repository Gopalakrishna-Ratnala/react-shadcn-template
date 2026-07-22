import type { ReactNode } from "react";

export interface SpecimenProps {
  /** Short label describing the variant/state being demonstrated. */
  title: string;
  /** Optional supporting note (e.g. usage or state detail). */
  description?: ReactNode;
  /** The rendered component demo. */
  children: ReactNode;
  /** Layout override for the demo body (defaults to a wrapping flex row). */
  bodyClassName?: string;
  className?: string;
}
