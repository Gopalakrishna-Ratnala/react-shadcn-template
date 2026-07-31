import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";

import { ROUTES } from "@/constants";

import { PreviewShell } from "./PreviewShell";

const renderShell = (initialPath: string) => {
  const router = createMemoryRouter(
    [
      {
        Component: PreviewShell,
        children: [
          {
            path: ROUTES.PREVIEW_LISTING,
            Component: () => <p>Listing page</p>,
          },
          {
            path: ROUTES.PREVIEW_DASHBOARD,
            Component: () => <p>Dashboard page</p>,
          },
          { path: ROUTES.PREVIEW_FORM, Component: () => <p>Form page</p> },
          {
            path: ROUTES.PREVIEW_DETAILS,
            Component: () => <p>Details page</p>,
          },
          {
            path: ROUTES.COMPONENTS_GALLERY,
            Component: () => <p>Components page</p>,
          },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  return render(<RouterProvider router={router} />);
};

describe("PreviewShell", () => {
  it("renders the brand and nav links for every preview page", () => {
    renderShell(ROUTES.PREVIEW_LISTING);
    expect(screen.getByText("Divami · Preview")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detail" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "New project" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Components" }),
    ).toBeInTheDocument();
  });

  it("renders the active page's content via the outlet", () => {
    renderShell(ROUTES.PREVIEW_DASHBOARD);
    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });

  it("marks the current page's nav link as active", () => {
    renderShell(ROUTES.PREVIEW_FORM);
    expect(screen.getByRole("link", { name: "New project" })).toHaveClass(
      "bg-primary",
    );
  });
});
