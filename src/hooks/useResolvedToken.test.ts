import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";

import { useResolvedToken } from "./useResolvedToken";

describe("useResolvedToken", () => {
  it("returns a string value for a CSS variable", () => {
    const { result } = renderHook(() => useResolvedToken("--primary"));
    expect(typeof result.current).toBe("string");
  });
});
