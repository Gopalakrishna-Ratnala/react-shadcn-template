import { createBrowserRouter } from "react-router";

import { RouteErrorFallback } from "@/components/blocks";
import { ROUTES } from "@/constants";

import { HydrateFallback } from "./routeFallback";

import type { RouteObject } from "react-router";

// Route-level `lazy` replaces the previous `React.lazy(...).then()` adapter.
// Unlike `React.lazy`, data-mode's `lazy` doesn't require a default export, so
// each page's named export can be returned directly as `Component` — no
// adapter needed. For routes with their own data fetching, `lazy` also
// resolves the route's `loader` alongside its `Component`, code-splitting both.
const routes: RouteObject[] = [
  {
    path: ROUTES.PRODUCTS,
    lazy: async () => {
      const { ProductsPage, productsLoader, productsAction } =
        await import("@/pages/products");
      return {
        Component: ProductsPage,
        loader: productsLoader,
        action: productsAction,
      };
    },
    HydrateFallback,
    ErrorBoundary: RouteErrorFallback,
  },
  {
    lazy: async () => {
      const { PreviewShell } = await import("@/components/layout/previewShell");
      return { Component: PreviewShell };
    },
    children: [
      {
        path: ROUTES.PREVIEW_LISTING,
        lazy: async () => {
          const { ListingPreviewPage } =
            await import("@/pages/preview/listing");
          return { Component: ListingPreviewPage };
        },
        HydrateFallback,
      },
      {
        path: ROUTES.PREVIEW_DASHBOARD,
        lazy: async () => {
          const { DashboardPreviewPage } =
            await import("@/pages/preview/dashboard");
          return { Component: DashboardPreviewPage };
        },
        HydrateFallback,
      },
      {
        path: ROUTES.PREVIEW_FORM,
        lazy: async () => {
          const { FormPreviewPage } = await import("@/pages/preview/form");
          return { Component: FormPreviewPage };
        },
        HydrateFallback,
      },
      {
        path: ROUTES.PREVIEW_DETAILS,
        lazy: async () => {
          const { DetailsPreviewPage } =
            await import("@/pages/preview/details");
          return { Component: DetailsPreviewPage };
        },
        HydrateFallback,
      },
      {
        path: ROUTES.COMPONENTS_GALLERY,
        lazy: async () => {
          const { ComponentsGalleryPage } =
            await import("@/pages/preview/componentsGallery");
          return { Component: ComponentsGalleryPage };
        },
        HydrateFallback,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
