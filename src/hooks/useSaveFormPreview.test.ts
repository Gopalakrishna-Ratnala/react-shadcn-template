import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

import { useSaveFormPreview } from "./useSaveFormPreview";

import type { FormPreviewValues } from "@/pages/preview/form/FormPreviewPage.schema";

vi.mock("sonner", () => ({
  toast: { promise: vi.fn(() => Promise.resolve()) },
}));

const FORM_VALUES: FormPreviewValues = {
  fullName: "Jane Doe",
  email: "jane@company.com",
  projectType: "branding",
  notificationChannels: ["email"],
  autoRenew: true,
  contactMethod: "email",
  teamNotes: "",
  kickoffDate: "2026-08-01",
};

describe("useSaveFormPreview", () => {
  it("returns a save action", () => {
    const { result } = renderHook(() => useSaveFormPreview());
    expect(typeof result.current.save).toBe("function");
  });

  it("calls toast.promise with the submitted values", async () => {
    const { result } = renderHook(() => useSaveFormPreview());

    await act(async () => {
      await result.current.save(FORM_VALUES);
    });

    expect(toast.promise).toHaveBeenCalledOnce();
  });
});
