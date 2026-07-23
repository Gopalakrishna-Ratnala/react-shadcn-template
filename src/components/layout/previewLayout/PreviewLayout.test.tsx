import { describe, expect, it } from "vitest";
import { ThemeProvider } from "next-themes";
import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";

import { PreviewLayout } from "./PreviewLayout";

describe("PreviewLayout", () => {
  it("renders a switcher link for each preview page", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <MemoryRouter>
          <PreviewLayout />
        </MemoryRouter>
      </ThemeProvider>,
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Components" })).toBeInTheDocument();
  });
});
