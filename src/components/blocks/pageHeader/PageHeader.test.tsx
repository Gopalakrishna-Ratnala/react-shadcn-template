import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders the title as a heading and the description", () => {
    render(<PageHeader title="Projects" description="All engagements" />);
    expect(
      screen.getByRole("heading", { name: "Projects" }),
    ).toBeInTheDocument();
    expect(screen.getByText("All engagements")).toBeInTheDocument();
  });
});
