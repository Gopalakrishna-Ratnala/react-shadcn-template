import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";
import { describe, expect, it, vi } from "vitest";

import { HydrateFallback } from "@/config/routeFallback";

import { RouteErrorFallback } from "./RouteErrorFallback";

const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderWithError = (loader: RouteObject["loader"]) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        loader,
        Component: () => null,
        ErrorBoundary: RouteErrorFallback,
        HydrateFallback,
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

  it("triggers a full re-navigation when Try again is clicked", async () => {
    const user = userEvent.setup();

    renderWithError(() => {
      throw new Error("boom");
    });

    await screen.findByText("boom");
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(mockNavigate).toHaveBeenCalledWith(0);
  });
});
