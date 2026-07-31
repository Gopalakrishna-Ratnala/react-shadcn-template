import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DetailsPreviewPage } from "./DetailsPreviewPage";

describe("DetailsPreviewPage", () => {
  it("renders the record title, client, and status", () => {
    render(<DetailsPreviewPage />);
    expect(
      screen.getByRole("heading", { name: "Brand refresh" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Acme Corp").length).toBeGreaterThan(0);
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });

  it("renders the tabs", () => {
    render(<DetailsPreviewPage />);
    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Activity" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Settings" })).toBeInTheDocument();
  });

  it("switches to the activity tab and shows real activity entries", async () => {
    render(<DetailsPreviewPage />);
    await userEvent.click(screen.getByRole("tab", { name: "Activity" }));
    expect(
      screen.getByText("submitted the marketing site mockups for review", {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it("opens the delete confirmation dialog", async () => {
    render(<DetailsPreviewPage />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(
      screen.getByRole("alertdialog", { name: "Delete this project?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete project" }),
    ).toBeInTheDocument();
  });
});
