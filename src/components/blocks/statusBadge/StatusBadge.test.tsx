import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders the provided label", () => {
    render(<StatusBadge tone="success" label="Completed" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
