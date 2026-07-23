import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { DashboardPage } from "./DashboardPage";

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );

describe("DashboardPage", () => {
  it("renders the page header with title and reporting period", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Studio performance for Q3 2026/)).toBeInTheDocument();
  });

  it("renders all four KPI stat cards", () => {
    renderPage();

    expect(screen.getByText("Active projects")).toBeInTheDocument();
    expect(screen.getByText("Revenue this quarter")).toBeInTheDocument();
    expect(screen.getByText("Billable utilization")).toBeInTheDocument();
    expect(screen.getByText("Client satisfaction")).toBeInTheDocument();
  });

  it("renders both chart cards", () => {
    renderPage();

    expect(screen.getByText("Revenue vs target")).toBeInTheDocument();
    expect(screen.getByText("Projects by status")).toBeInTheDocument();
  });

  it("renders the recent activity section with realistic rows", () => {
    renderPage();

    expect(screen.getByText("Recent activity")).toBeInTheDocument();
    expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
    expect(screen.getByText(/shipped Lumen Storefront Refresh/)).toBeInTheDocument();
  });

  it("renders the quarterly goal progress card with an export action", () => {
    renderPage();

    expect(screen.getByText("Quarterly revenue goal")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /export report/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all projects" })).toHaveAttribute(
      "href",
      "/preview/listing"
    );
  });
});
