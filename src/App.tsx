import type { ReactElement } from "react";

import { ThemeProvider } from "next-themes";
import { RouterProvider } from "react-router";

import { ErrorBoundary } from "@/components/shared";
import { Toaster } from "@/components/ui/sonner";
import { router } from "@/config/routes";

export const App = (): ReactElement => {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
};
