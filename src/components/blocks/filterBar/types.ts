import type { ChangeEvent, ReactNode } from "react";

export interface FilterBarSearchProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface FilterBarFilterOption {
  label: string;
  value: string;
}

export interface FilterBarFilter {
  label: string;
  options: FilterBarFilterOption[];
  value: string;
  onValueChange: (value: string) => void;
}

export interface FilterBarProps {
  search: FilterBarSearchProps;
  filters: FilterBarFilter[];
  onClear: () => void;
  extra?: ReactNode;
}
