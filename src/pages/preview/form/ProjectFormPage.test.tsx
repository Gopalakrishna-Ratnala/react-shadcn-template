import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { ProjectFormPage } from "./ProjectFormPage";

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProjectFormPage />
    </MemoryRouter>
  );

describe("ProjectFormPage", () => {
  it("renders all three form sections", () => {
    renderPage();

    expect(screen.getByText("Basic information")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
  });

  it("renders a disabled, auto-generated project code field", () => {
    renderPage();

    const code = screen.getByLabelText("Project code");
    expect(code).toBeDisabled();
    expect(code).toHaveValue("PRJ-2026-018");
  });

  it("renders helper text for the optional description with a live character count", () => {
    renderPage();

    expect(screen.getByText(/Optional\./)).toBeInTheDocument();
    expect(screen.getByText("0/280")).toBeInTheDocument();
  });

  it("shows accessible validation errors when required fields are empty on submit", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(screen.getByText("Project name must be at least 3 characters")).toBeInTheDocument();
    });
    expect(screen.getByText("Select a client for this project")).toBeInTheDocument();
    expect(screen.getByText("Add at least one team member")).toBeInTheDocument();
    expect(screen.getByLabelText("Project name")).toHaveAttribute("aria-invalid", "true");
  });

  it("updates the character count as the user types in the description", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Description"), "Hello");

    expect(screen.getByText("5/280")).toBeInTheDocument();
  });

  it("renders Cancel and Save actions", () => {
    renderPage();

    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      "/preview/listing"
    );
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});
