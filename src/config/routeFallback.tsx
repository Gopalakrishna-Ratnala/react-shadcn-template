import type { ReactElement } from "react";

// Only shown on the very first page load while the matched route's `lazy()`
// import is still resolving — React Router skips it entirely on client-side
// navigations once the app has hydrated, so it's not a general-purpose
// route-transition spinner (that's `useNavigation()`'s job, added when a
// real multi-route nav exists to justify it).
export const HydrateFallback = (): ReactElement => {
  return <p role="status">Loading…</p>;
};
