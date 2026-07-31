import type { ReactElement } from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { filterBarStyles as styles } from "./FilterBar.styles";

import type { FilterBarProps } from "./types";

export const FilterBar = ({
  search,
  filters,
  onClear,
  extra,
}: FilterBarProps): ReactElement => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.fields}>
        <InputGroup className={styles.search}>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            aria-label={search.label}
            placeholder={search.label}
            value={search.value}
            onChange={search.onChange}
          />
        </InputGroup>

        {filters.map((filter) => (
          <Select
            key={filter.label}
            value={filter.value}
            onValueChange={(value) => filter.onValueChange(value ?? "")}
          >
            <SelectTrigger aria-label={filter.label} className={styles.select}>
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ))}
      </div>

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onClear}>
          Clear filters
        </Button>
        {extra}
      </div>
    </div>
  );
};
