import { useCallback, useEffect, useState } from "react";

/**
 * Reads the resolved value of a CSS design token (e.g. "--primary") from the
 * document root, recomputing whenever the active theme changes (the `.dark`
 * class / inline styles on <html> flip). Used by the design-system preview to
 * display each token's live value.
 */
export function useResolvedToken(cssVariable: string): string {
  const read = useCallback(
    () =>
      typeof window === "undefined"
        ? ""
        : getComputedStyle(document.documentElement)
            .getPropertyValue(cssVariable)
            .trim(),
    [cssVariable],
  );

  const [value, setValue] = useState<string>(read);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setValue(read());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => {
      observer.disconnect();
    };
  }, [read]);

  return value;
}
