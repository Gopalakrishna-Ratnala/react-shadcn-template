import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FormPreviewPage } from "./FormPreviewPage";

vi.mock("@/hooks", async () => {
  const actual = await vi.importActual<typeof import("@/hooks")>("@/hooks");
  return { ...actual, useSaveFormPreview: () => ({ save: vi.fn() }) };
});

describe("FormPreviewPage", () => {
  it("renders every section", () => {
    render(<FormPreviewPage />);
    expect(screen.getByText("Basic information")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
  });

  it("shows a validation error on the email field", async () => {
    render(<FormPreviewPage />);
    expect(
      await screen.findByText(
        "Enter a valid email address, like jane@company.com",
      ),
    ).toBeInTheDocument();
  });

  it("shows helper text and a disabled field", () => {
    render(<FormPreviewPage />);
    expect(
      screen.getByText(
        "Anything the delivery team should know before kickoff.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Legacy team ID")).toBeDisabled();
  });

  it("renders the footer actions", async () => {
    render(<FormPreviewPage />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("lets the user fill in the full name field", async () => {
    render(<FormPreviewPage />);
    await userEvent.type(screen.getByLabelText("Full name"), "Jane Doe");
    expect(screen.getByLabelText("Full name")).toHaveValue("Jane Doe");
  });
});
