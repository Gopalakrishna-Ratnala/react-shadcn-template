import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";

import { useToastPreview } from "./useToastPreview";

describe("useToastPreview", () => {
  it("exposes a handler for each toast severity", () => {
    const { result } = renderHook(() => useToastPreview());
    expect(typeof result.current.showInfo).toBe("function");
    expect(typeof result.current.showSuccess).toBe("function");
    expect(typeof result.current.showWarning).toBe("function");
    expect(typeof result.current.showError).toBe("function");
  });
});
