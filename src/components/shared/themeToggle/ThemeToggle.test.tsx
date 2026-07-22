import { describe, expect, it } from "vitest";
import { ThemeProvider } from "next-themes";
import { render, screen } from "@testing-library/react";

import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  it("renders an accessible theme switch button", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName(/theme/i);
  });
});
