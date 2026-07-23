import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  it("renders an accessible search box and a labelled filter", () => {
    render(
      <FilterBar
        searchValue=""
        onSearchChange={vi.fn()}
        searchPlaceholder="Search projects…"
        filters={[
          {
            id: "status",
            label: "Filter by status",
            value: "all",
            options: [{ value: "all", label: "All statuses" }],
            onValueChange: vi.fn(),
          },
        ]}
        onClear={vi.fn()}
      />,
    );
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Filter by status" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear filters" }),
    ).toBeInTheDocument();
  });
});
