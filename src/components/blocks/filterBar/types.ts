import type { ReactNode } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  options: FilterOption[];
  onValueChange: (value: string) => void;
}

export interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: FilterConfig[];
  onClear: () => void;
  extra?: ReactNode;
}
