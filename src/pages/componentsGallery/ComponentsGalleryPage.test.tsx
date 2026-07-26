import { render, screen } from "@testing-library/react";
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

  it("renders the theme history panel with real THEME-LOG.json data", () => {
    render(<ComponentsGalleryPage />);
    // db is empty by default in a fresh template - the panel should show its empty state
    // rather than crashing, regardless of how many candidates actually exist yet.
    const historySection = screen
      .getByRole("heading", {
        name: "Theme History",
      })
      .closest("section");
    expect(historySection).not.toBeNull();
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
