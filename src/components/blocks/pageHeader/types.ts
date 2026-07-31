import type { ReactNode } from "react";

export interface PageHeaderBreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems?: PageHeaderBreadcrumbItem[];
  actions?: ReactNode;
}
