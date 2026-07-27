import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";

import { ThemeToggle } from "./ThemeToggle";

function renderWithThemeProvider() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  it("renders a toggle button", () => {
    renderWithThemeProvider();
    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toBeInTheDocument();
  });

  it("toggles the .dark class on <html> when clicked", async () => {
    const user = userEvent.setup();
    renderWithThemeProvider();

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
