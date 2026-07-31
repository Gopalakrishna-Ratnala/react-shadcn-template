import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it.each([
    ["success", "Completed"],
    ["warning", "At risk"],
    ["destructive", "Overdue"],
    ["info", "In review"],
    ["default", "Draft"],
  ] as const)("renders the %s status with its label", (status, label) => {
    render(<StatusBadge status={status} label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
