import { lazy, Suspense } from "react";

import { Navigate, Route, Routes } from "react-router";

import { PreviewLayout } from "@/components/layout";
import { ROUTES } from "@/constants";

const DashboardPage = lazy(() => import("@/pages/preview/dashboard"));
const ListingPage = lazy(() => import("@/pages/preview/listing"));
const ProjectDetailPage = lazy(() => import("@/pages/preview/details"));
const ProjectFormPage = lazy(() => import("@/pages/preview/form"));
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
      <Route element={<PreviewLayout />}>
        <Route
          path={ROUTES.PREVIEW_DASHBOARD}
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.PREVIEW_LISTING}
          element={
            <Suspense fallback={<PageLoader />}>
              <ListingPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.PREVIEW_DETAILS}
          element={
            <Suspense fallback={<PageLoader />}>
              <ProjectDetailPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.PREVIEW_FORM}
          element={
            <Suspense fallback={<PageLoader />}>
              <ProjectFormPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.COMPONENTS_GALLERY}
          element={
            <Suspense fallback={<PageLoader />}>
              <ComponentsGalleryPage />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="*"
        element={<Navigate to={ROUTES.PREVIEW_DASHBOARD} replace />}
      />
    </Routes>
  );
}
