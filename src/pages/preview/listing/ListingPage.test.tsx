import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import type { Project } from "@/types/project.types";

let mockState: { status: string; data?: Project[]; message?: string } = { status: "loading" };

vi.mock("@/hooks/useProjects", () => ({
  useProjects: () => ({ state: mockState }),
}));

import { ListingPage } from "./ListingPage";

const MOCK_PROJECTS: Project[] = [
  {
    id: "proj_1",
    name: "Aurora Care Portal",
    clientName: "Aurora Health",
    status: "in-review",
    ownerName: "Daniel Cho",
    ownerInitials: "DC",
    updatedAt: "2026-07-17T14:40:00Z",
  },
  {
    id: "proj_2",
    name: "Northwind Mobile App",
    clientName: "Northwind Traders",
    status: "in-progress",
    ownerName: "Priya Sharma",
    ownerInitials: "PS",
    updatedAt: "2026-07-18T09:15:00Z",
  },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <ListingPage />
    </MemoryRouter>
  );

describe("ListingPage", () => {
  it("renders the page heading, search field, and filters regardless of load state", () => {
    mockState = { status: "loading" };
    renderPage();

    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Filter by status" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Filter by client" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add new project" })).toHaveAttribute(
      "href",
      "/preview/form"
    );
  });

  it("shows loading placeholders without rendering project data", () => {
    mockState = { status: "loading" };
    renderPage();

    expect(screen.queryByText("Aurora Care Portal")).not.toBeInTheDocument();
    expect(screen.queryByText("No projects found")).not.toBeInTheDocument();
  });

  it("renders an error state with the failure message", () => {
    mockState = { status: "error", message: "Network unavailable" };
    renderPage();

    expect(screen.getByText("Couldn't load projects")).toBeInTheDocument();
    expect(screen.getByText("Network unavailable")).toBeInTheDocument();
  });

  it("renders project rows, status badges, and the pagination summary on success", () => {
    mockState = { status: "success", data: MOCK_PROJECTS };
    renderPage();

    expect(screen.getByText("Aurora Care Portal")).toBeInTheDocument();
    expect(screen.getByText("In review")).toBeInTheDocument();
    expect(screen.getByText("Northwind Mobile App")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Showing 2 of 2 projects")).toBeInTheDocument();
  });

  it("filters rows as the user types in search, and shows the empty state for no matches", async () => {
    mockState = { status: "success", data: MOCK_PROJECTS };
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("searchbox", { name: "Search" }), "Aurora");

    expect(screen.getByText("Aurora Care Portal")).toBeInTheDocument();
    expect(screen.queryByText("Northwind Mobile App")).not.toBeInTheDocument();

    await user.clear(screen.getByRole("searchbox", { name: "Search" }));
    await user.type(screen.getByRole("searchbox", { name: "Search" }), "no-such-project");

    expect(screen.getByText("No projects found")).toBeInTheDocument();
  });

  it("restores all rows when Clear filters is used from the empty state", async () => {
    mockState = { status: "success", data: MOCK_PROJECTS };
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("searchbox", { name: "Search" }), "no-such-project");
    expect(screen.getByText("No projects found")).toBeInTheDocument();

    const [clearFiltersButton] = screen.getAllByRole("button", { name: "Clear filters" });
    await user.click(clearFiltersButton);

    expect(screen.getByText("Aurora Care Portal")).toBeInTheDocument();
    expect(screen.getByText("Northwind Mobile App")).toBeInTheDocument();
  });

  it("forces the empty state on when the preview-empty-state switch is toggled", async () => {
    mockState = { status: "success", data: MOCK_PROJECTS };
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("switch", { name: /preview empty state/i }));

    expect(screen.getByText("No projects found")).toBeInTheDocument();
  });

  it("selects and deselects a row via its checkbox", async () => {
    mockState = { status: "success", data: MOCK_PROJECTS };
    const user = userEvent.setup();
    renderPage();

    const rowCheckbox = screen.getByRole("checkbox", { name: "Select Aurora Care Portal" });
    expect(rowCheckbox).not.toBeChecked();

    await user.click(rowCheckbox);
    expect(rowCheckbox).toBeChecked();

    await user.click(rowCheckbox);
    expect(rowCheckbox).not.toBeChecked();
  });
});
