import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  containerStyles,
  extraWrapStyles,
  searchStyles,
  selectStyles,
} from "./FilterBar.styles";
import type { FilterBarProps } from "./types";

/**
 * Reusable search + dropdown filter row. Filters render as Base UI selects
 * (accessible combobox role) whose options portal on open, so option labels
 * never collide with page content.
 */
export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  onClear,
  extra,
}: FilterBarProps) {
  return (
    <section className={containerStyles} aria-label="Filters">
      <Input
        type="search"
        aria-label="Search"
        value={searchValue}
        placeholder={searchPlaceholder}
        className={searchStyles}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      {filters.map((filter) => (
        <Select
          key={filter.id}
          value={filter.value}
          items={Object.fromEntries(
            filter.options.map((option) => [option.value, option.label]),
          )}
          onValueChange={(value) => filter.onValueChange(value ?? "")}
        >
          <SelectTrigger aria-label={filter.label} className={selectStyles}>
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      <section className={extraWrapStyles}>
        <Button type="button" variant="ghost" onClick={onClear}>
          Clear filters
        </Button>
        {extra}
      </section>
    </section>
  );
}
