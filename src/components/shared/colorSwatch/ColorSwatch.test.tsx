import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";

import { ColorSwatch } from "./ColorSwatch";

describe("ColorSwatch", () => {
  it("renders the token label", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <ColorSwatch
          label="primary"
          cssVariable="--primary"
          swatchClassName="bg-primary"
        />
      </ThemeProvider>,
    );
    expect(screen.getByText("primary")).toBeInTheDocument();
  });
});
