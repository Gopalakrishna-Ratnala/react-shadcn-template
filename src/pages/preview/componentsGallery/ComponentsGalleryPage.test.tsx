import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Toaster } from "@/components/ui/sonner";

import { ComponentsGalleryPage } from "./ComponentsGalleryPage";

// Defensive: several overlay/accordion specimens on this page have collapsed
// or hidden content by default. `hidden: true` ensures queries still find
// elements the accessibility tree currently marks as hidden.
const HIDDEN = { hidden: true };

describe("ComponentsGalleryPage", () => {
  it("renders a section nav link for every section", () => {
    render(<ComponentsGalleryPage />);
    expect(
      screen.getByRole("link", { name: /foundations/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /typography/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /buttons & actions/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /form fields — inputs/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /form fields — choice/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /date & calendar/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /feedback & status/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /overlays/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /menus & command/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /navigation/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /data display/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /media & files/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /messaging/i, ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /theme history/i, ...HIDDEN }),
    ).toBeInTheDocument();
  });

  it("renders every section's heading simultaneously (continuous scroll, not tab panels)", () => {
    render(<ComponentsGalleryPage />);
    expect(
      screen.getByRole("heading", { name: "Design tokens", ...HIDDEN }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Theme history", ...HIDDEN }),
    ).toBeInTheDocument();
  });

  it("fires a themed toast preview when a sonner button is clicked", async () => {
    render(
      <>
        <ComponentsGalleryPage />
        <Toaster />
      </>,
    );
    // Two elements share the accessible name "Info" (this sonner trigger and an
    // unrelated icon-only info button elsewhere) - the sonner one renders first.
    const [sonnerInfoButton] = screen.getAllByRole("button", {
      name: "Info",
      ...HIDDEN,
    });
    await userEvent.click(sonnerInfoButton);
    expect(await screen.findByText("Deployment queued")).toBeInTheDocument();
  });

  it("opens the alert dialog specimen", async () => {
    render(<ComponentsGalleryPage />);
    const triggers = screen.getAllByRole("button", {
      name: /delete/i,
      ...HIDDEN,
    });
    await userEvent.click(triggers[0]);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });
});
