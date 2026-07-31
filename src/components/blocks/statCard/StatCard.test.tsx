import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renders the label and value", () => {
    render(<StatCard label="Active projects" value="24" />);
    expect(screen.getByText("Active projects")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
  });

  it("renders an upward delta", () => {
    render(
      <StatCard
        label="Revenue"
        value="$42,000"
        delta={{ value: "+12% vs last month", direction: "up" }}
      />,
    );
    expect(screen.getByText("+12% vs last month")).toBeInTheDocument();
  });

  it("renders a downward delta", () => {
    render(
      <StatCard
        label="Avg. delivery time"
        value="6.2 days"
        delta={{ value: "-1.1 days", direction: "down" }}
      />,
    );
    expect(screen.getByText("-1.1 days")).toBeInTheDocument();
  });
});
