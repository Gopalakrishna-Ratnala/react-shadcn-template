import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComponentsGalleryPage } from "./ComponentsGalleryPage";

describe("ComponentsGalleryPage", () => {
  it("renders the page title and every nav section as a heading", () => {
    render(<ComponentsGalleryPage />);

    expect(
      screen.getByRole("heading", { name: "Components Gallery", level: 1 }),
    ).toBeInTheDocument();

    for (const label of [
      "Foundations",
      "Typography",
      "Buttons & Badges",
      "Form Inputs",
      "Feedback",
      "Theme History",
    ]) {
      expect(
        screen.getByRole("heading", { name: label, level: 2 }),
      ).toBeInTheDocument();
    }
  });

  it("renders the theme history section's empty state when THEME-LOG.json has no entries yet", () => {
    render(<ComponentsGalleryPage />);
    // THEME-LOG.json is empty by default in a fresh template - the panel should
    // show its empty-state copy rather than crashing.
    const historySection = screen
      .getByRole("heading", { name: "Theme History" })
      .closest("section");
    expect(historySection).not.toBeNull();
    expect(
      within(historySection as HTMLElement).getByText(
        "No theme candidates yet",
      ),
    ).toBeInTheDocument();
  });

  it("associates FieldLabel with its input via htmlFor (Field composition works)", () => {
    render(<ComponentsGalleryPage />);
    // getByLabelText only succeeds if FieldLabel's htmlFor genuinely matches the
    // input's id - this proves the Field/FieldLabel composition is wired
    // correctly, not just that it renders without crashing.
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });
});
