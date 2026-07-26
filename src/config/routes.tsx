import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";

import { ROUTES } from "@/constants";

// React.lazy requires a default export; every page component in this project uses a
// named export for consistency (auto-import friendliness, no default-export ambiguity),
// so each lazy import is adapted with .then() rather than switching to default exports.
const ComponentsGalleryPage = lazy(() =>
  import("@/pages/componentsGallery/ComponentsGalleryPage").then((m) => ({
    default: m.ComponentsGalleryPage,
  })),
);

function PageLoader() {
  return <p role="status">Loading…</p>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.COMPONENTS_GALLERY}
        element={
          <Suspense fallback={<PageLoader />}>
            <ComponentsGalleryPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
