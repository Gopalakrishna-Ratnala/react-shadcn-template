import { useCallback } from "react";

import { toast } from "sonner";

import type { FormPreviewValues } from "@/pages/preview/form/FormPreviewPage.schema";

interface UseSaveFormPreviewResult {
  save: (values: FormPreviewValues) => Promise<void>;
}

export const useSaveFormPreview = (): UseSaveFormPreviewResult => {
  const save = useCallback(async (values: FormPreviewValues): Promise<void> => {
    await toast.promise(
      new Promise<FormPreviewValues>((resolve) => {
        setTimeout(() => resolve(values), 400);
      }),
      {
        loading: "Saving changes...",
        success: "Changes saved",
        error: "Failed to save changes",
      },
    );
  }, []);

  return { save };
};
