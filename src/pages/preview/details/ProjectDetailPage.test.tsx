import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { ProjectDetailPage } from "./ProjectDetailPage";

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProjectDetailPage />
    </MemoryRouter>
  );

describe("ProjectDetailPage", () => {
  it("renders the record title, status badge, and action buttons", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Aurora Care Portal", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("In review")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /edit/i })).toHaveAttribute("href", "/preview/form");
    expect(screen.getByRole("button", { name: "Mark as complete" })).toBeInTheDocument();
  });

  it("renders the three tabs with Overview content visible by default", () => {
    renderPage();

    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Activity" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("About this project")).toBeInTheDocument();
    expect(screen.getByText("Client")).toBeInTheDocument();
    expect(screen.getByText("Aurora Health")).toBeInTheDocument();
  });

  it("switches to the Activity tab when selected", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("tab", { name: "Activity" }));

    await waitFor(() => {
      expect(screen.getByText(/updated the component inventory/)).toBeInTheDocument();
    });
  });

  it("opens the delete confirmation dialog with destructive confirm action", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.getByText("Delete this project?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete project" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep project" })).toBeInTheDocument();
  });
});
