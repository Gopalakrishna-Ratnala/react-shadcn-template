import { ThemeProvider } from "next-themes";
import { BrowserRouter } from "react-router";

import { ErrorBoundary } from "@/components/shared";
import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "@/config/routes";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
