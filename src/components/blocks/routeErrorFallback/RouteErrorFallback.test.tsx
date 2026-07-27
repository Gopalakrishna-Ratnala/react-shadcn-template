import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";
import { describe, expect, it } from "vitest";

import { RouteErrorFallback } from "./RouteErrorFallback";

const renderWithError = (loader: RouteObject["loader"]) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        loader,
        Component: () => null,
        ErrorBoundary: RouteErrorFallback,
      },
    ],
    { initialEntries: ["/"] },
  );
  return render(<RouterProvider router={router} />);
};

describe("RouteErrorFallback", () => {
  it("renders the default title and a thrown Error's message", async () => {
    renderWithError(() => {
      throw new Error("boom");
    });

    expect(
      await screen.findByText("This page failed to load"),
    ).toBeInTheDocument();
    expect(await screen.findByText("boom")).toBeInTheDocument();
  });

  it("renders a thrown Response's status text", async () => {
    renderWithError(() => {
      throw new Response("Not Found", { status: 404, statusText: "Not Found" });
    });

    expect(await screen.findByText("Not Found")).toBeInTheDocument();
  });
});
