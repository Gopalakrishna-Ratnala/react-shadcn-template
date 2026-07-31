import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ListingPreviewPage } from "./ListingPreviewPage";

describe("ListingPreviewPage", () => {
  it("renders the project rows", () => {
    render(<ListingPreviewPage />);
    expect(screen.getByText("Brand refresh")).toBeInTheDocument();
    expect(screen.getAllByText("Acme Corp").length).toBeGreaterThan(0);
  });

  it("filters rows by search term", async () => {
    render(<ListingPreviewPage />);
    await userEvent.type(
      screen.getByLabelText("Search projects"),
      "Brand refresh",
    );
    expect(screen.getByText("Brand refresh")).toBeInTheDocument();
    expect(screen.queryByText("Mobile app redesign")).not.toBeInTheDocument();
  });

  it("shows the empty state when the preview toggle is switched on", async () => {
    render(<ListingPreviewPage />);
    await userEvent.click(
      screen.getByRole("switch", { name: "Preview empty state" }),
    );
    expect(screen.getByText("No projects found")).toBeInTheDocument();
  });

  it("shows a clear filters action in the empty state when filters produced zero rows", async () => {
    render(<ListingPreviewPage />);
    await userEvent.type(
      screen.getByLabelText("Search projects"),
      "no such project",
    );
    expect(screen.getByText("No projects found")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Clear filters" }).length,
    ).toBeGreaterThan(1);
  });

  it("renders the owner column and paginates results", async () => {
    render(<ListingPreviewPage />);
    expect(screen.getAllByText("Priya Nair").length).toBeGreaterThan(0);
    expect(screen.getByText("Showing 5 of 10 projects")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByText("Showing 5 of 10 projects")).toBeInTheDocument();
  });
});
