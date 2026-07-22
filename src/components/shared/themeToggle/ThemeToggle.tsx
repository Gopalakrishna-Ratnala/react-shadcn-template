import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

import { toggleButtonStyles } from "./ThemeToggle.styles";
import type { ThemeToggleProps } from "./types";

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(toggleButtonStyles, className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Icon icon={isDark ? SunIcon : MoonIcon} size="sm" />
    </Button>
  );
}
