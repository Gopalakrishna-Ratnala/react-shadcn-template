import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renders the label, value, and change", () => {
    render(
      <StatCard
        label="Active projects"
        value="24"
        changePercent={12}
        changeCaption="vs last quarter"
      />,
    );
    expect(screen.getByText("Active projects")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("12%")).toBeInTheDocument();
  });
});
