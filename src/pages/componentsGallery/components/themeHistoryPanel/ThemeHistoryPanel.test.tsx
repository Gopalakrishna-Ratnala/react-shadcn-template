import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeHistoryPanel } from "./ThemeHistoryPanel";

import type { ThemeLogEntry } from "./types";

const entries: ThemeLogEntry[] = [
  {
    date: "2026-07-24",
    round: "initial-design",
    file: "2026-07-24_initial-design_v1-navy-corporate.css",
    status: "rejected",
    notes: "Too corporate for the brief",
  },
  {
    date: "2026-07-24",
    round: "initial-design",
    file: "2026-07-24_initial-design_v3-bold-tech.css",
    status: "approved",
    notes: "Client preferred stronger accent contrast",
  },
];

describe("ThemeHistoryPanel", () => {
  it("renders the empty state when there are no entries", () => {
    render(<ThemeHistoryPanel entries={[]} />);
    expect(screen.getByText(/No theme candidates yet/)).toBeInTheDocument();
  });

  it("renders every entry with its filename, date, round, and status", () => {
    render(<ThemeHistoryPanel entries={entries} />);

    expect(
      screen.getByText("2026-07-24_initial-design_v1-navy-corporate.css"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("2026-07-24_initial-design_v3-bold-tech.css"),
    ).toBeInTheDocument();
    expect(screen.getByText("rejected")).toBeInTheDocument();
    expect(screen.getByText("approved")).toBeInTheDocument();
  });

  it("renders notes when present", () => {
    render(<ThemeHistoryPanel entries={entries} />);
    expect(screen.getByText("Too corporate for the brief")).toBeInTheDocument();
  });
});
