import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ColorSwatch } from "./ColorSwatch";

describe("ColorSwatch", () => {
  it("renders the label and token name", () => {
    render(
      <ColorSwatch
        label="Primary"
        token="--primary"
        bgClassName="bg-primary"
        textClassName="text-primary-foreground"
      />,
    );
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("--primary")).toBeInTheDocument();
  });
});
