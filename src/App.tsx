import { BrowserRouter } from "react-router";

import { ErrorBoundary } from "@/components/shared";
import { AppRoutes } from "@/config/routes";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
