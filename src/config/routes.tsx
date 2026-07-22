import { lazy, Suspense } from "react";

import { Navigate, Route, Routes } from "react-router";

import { ROUTES } from "@/constants";

const ComponentsGalleryPage = lazy(() =>
  import("@/pages/preview/componentsGallery").then((module) => ({
    default: module.ComponentsGalleryPage,
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
      <Route
        path="*"
        element={<Navigate to={ROUTES.COMPONENTS_GALLERY} replace />}
      />
    </Routes>
  );
}
