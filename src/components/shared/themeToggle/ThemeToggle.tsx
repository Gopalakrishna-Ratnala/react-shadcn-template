import type { ReactElement } from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import { themeToggleStyles } from "./ThemeToggle.styles";

export const ThemeToggle = (): ReactElement => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className={themeToggleStyles.button}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className={themeToggleStyles.icon} />
      <Moon className={themeToggleStyles.iconDark} />
    </Button>
  );
};
