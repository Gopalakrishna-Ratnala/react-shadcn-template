import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Specimen } from "./Specimen";

describe("Specimen", () => {
  it("renders its title and children", () => {
    render(
      <Specimen title="Primary" description="Default state">
        <button type="button">Demo</button>
      </Specimen>,
    );
    expect(
      screen.getByRole("heading", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Demo" })).toBeInTheDocument();
  });
});
