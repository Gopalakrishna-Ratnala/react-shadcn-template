import type { ReactNode } from "react";

export interface GallerySectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}
