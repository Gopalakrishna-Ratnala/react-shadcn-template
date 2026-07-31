import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="Projects" />);
    expect(
      screen.getByRole("heading", { name: "Projects" }),
    ).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<PageHeader title="Projects" description="All active projects" />);
    expect(screen.getByText("All active projects")).toBeInTheDocument();
  });

  it("renders breadcrumb items with the last item as the current page", () => {
    render(
      <PageHeader
        title="Record detail"
        breadcrumbItems={[
          { label: "Projects", href: "/preview/listing" },
          { label: "Brand refresh" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("Brand refresh")).toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    render(
      <PageHeader title="Projects" actions={<button>Add project</button>} />,
    );
    expect(
      screen.getByRole("button", { name: "Add project" }),
    ).toBeInTheDocument();
  });
});
