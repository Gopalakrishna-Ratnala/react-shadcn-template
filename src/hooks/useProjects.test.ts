import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";

import { useProjects } from "./useProjects";

describe("useProjects", () => {
  it("returns a success state with project data", () => {
    const { result } = renderHook(() => useProjects());
    expect(result.current.state.status).toBe("success");
    if (result.current.state.status === "success") {
      expect(result.current.state.data.length).toBeGreaterThan(0);
    }
  });
});
