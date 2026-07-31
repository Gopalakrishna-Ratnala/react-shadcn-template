import { toast } from "sonner";

interface UseToastPreviewResult {
  showInfo: () => string | number;
  showSuccess: () => string | number;
  showWarning: () => string | number;
  showError: () => string | number;
}

/**
 * Fires themed toast previews for the design-system gallery. Toast calls live
 * in a hook (never directly in a component) per the notifications rule.
 */
export function useToastPreview(): UseToastPreviewResult {
  return {
    showInfo: () =>
      toast.info("Deployment queued", {
        description: "Aurora API v2.3 is building now.",
      }),
    showSuccess: () =>
      toast.success("Theme published", {
        description: "Nova design tokens are live in production.",
      }),
    showWarning: () =>
      toast.warning("Usage nearing limit", {
        description: "82% of this month's render credits used.",
      }),
    showError: () =>
      toast.error("Export failed", {
        description: "Could not reach the asset service. Retry?",
      }),
  };
}
