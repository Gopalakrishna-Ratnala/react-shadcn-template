import type { ReactNode } from "react";

export interface PageHeaderCrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: PageHeaderCrumb[];
  action?: ReactNode;
}
