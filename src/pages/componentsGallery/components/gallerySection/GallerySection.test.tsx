import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GallerySection } from "./GallerySection";

describe("GallerySection", () => {
  it("renders the title, optional description, and children", () => {
    render(
      <GallerySection id="foo" title="Foo" description="Bar baz">
        <p>Child content</p>
      </GallerySection>,
    );
    expect(screen.getByRole("heading", { name: "Foo" })).toBeInTheDocument();
    expect(screen.getByText("Bar baz")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("omits the description when not provided", () => {
    render(
      <GallerySection id="foo" title="Foo">
        <p>Child</p>
      </GallerySection>,
    );
    expect(screen.queryByText("Bar baz")).not.toBeInTheDocument();
  });
});
