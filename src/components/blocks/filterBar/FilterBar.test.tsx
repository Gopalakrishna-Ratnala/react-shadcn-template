import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  it("renders the search input with its label", () => {
    render(
      <FilterBar
        search={{ label: "Search projects", value: "", onChange: vi.fn() }}
        filters={[]}
        onClear={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Search projects")).toBeInTheDocument();
  });

  it("renders each filter select with its label", () => {
    render(
      <FilterBar
        search={{ label: "Search projects", value: "", onChange: vi.fn() }}
        filters={[
          {
            label: "Status",
            options: [{ label: "Active", value: "active" }],
            value: "",
            onValueChange: vi.fn(),
          },
        ]}
        onClear={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });

  it("calls onClear when the clear filters button is clicked", async () => {
    const onClear = vi.fn();
    render(
      <FilterBar
        search={{ label: "Search projects", value: "", onChange: vi.fn() }}
        filters={[]}
        onClear={onClear}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Clear filters" }),
    );
    expect(onClear).toHaveBeenCalledOnce();
  });
});
