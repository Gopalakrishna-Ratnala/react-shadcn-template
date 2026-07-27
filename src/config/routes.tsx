import { createBrowserRouter } from "react-router";

import { ROUTES } from "@/constants";

import { HydrateFallback } from "./routeFallback";

import type { RouteObject } from "react-router";

// Route-level `lazy` replaces the previous `React.lazy(...).then()` adapter.
// Unlike `React.lazy`, data-mode's `lazy` doesn't require a default export, so
// each page's named export can be returned directly as `Component` — no
// adapter needed.
const routes: RouteObject[] = [
  {
    path: ROUTES.COMPONENTS_GALLERY,
    lazy: async () => {
      const { ComponentsGalleryPage } =
        await import("@/pages/componentsGallery/ComponentsGalleryPage");
      return { Component: ComponentsGalleryPage };
    },
    HydrateFallback,
  },
];

export const router = createBrowserRouter(routes);
