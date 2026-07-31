import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { DashboardPreviewPage } from "./DashboardPreviewPage";

const renderPage = () =>
  render(
    <MemoryRouter>
      <DashboardPreviewPage />
    </MemoryRouter>,
  );

describe("DashboardPreviewPage", () => {
  it("renders the page title and action", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Overview" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /new project/i }),
    ).toBeInTheDocument();
  });

  it("renders every stat card", () => {
    renderPage();
    expect(screen.getByText("Active projects")).toBeInTheDocument();
    expect(screen.getByText("Revenue this month")).toBeInTheDocument();
    expect(screen.getByText("Avg. delivery time")).toBeInTheDocument();
    expect(screen.getByText("Client satisfaction")).toBeInTheDocument();
  });

  it("renders the recent activity table and the goal progress card", () => {
    renderPage();
    expect(screen.getByText("Recent activity")).toBeInTheDocument();
    expect(screen.getByText("Brand refresh")).toBeInTheDocument();
    expect(screen.getByText("Q3 goal")).toBeInTheDocument();
    expect(screen.getByText("Revenue target")).toBeInTheDocument();
  });

  it("renders the goal breakdown list and a cross-link to the listing page", () => {
    renderPage();
    expect(screen.getByText("Signed this quarter")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View all projects" }),
    ).toBeInTheDocument();
  });
});
