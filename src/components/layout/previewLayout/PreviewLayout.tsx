import { NavLink, Outlet } from "react-router";

import { ThemeToggle } from "@/components/shared";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

import {
  actionsStyles,
  barInnerStyles,
  barStyles,
  brandStyles,
  mainStyles,
  navLinkActiveStyles,
  navLinkBaseStyles,
  navStyles,
  rootStyles,
} from "./PreviewLayout.styles";
import type { PreviewNavItem } from "./types";

const NAV_ITEMS: PreviewNavItem[] = [
  { to: ROUTES.PREVIEW_DASHBOARD, label: "Dashboard" },
  { to: ROUTES.PREVIEW_LISTING, label: "Projects" },
  { to: ROUTES.PREVIEW_DETAILS, label: "Detail" },
  { to: ROUTES.PREVIEW_FORM, label: "New project" },
  { to: ROUTES.COMPONENTS_GALLERY, label: "Components" },
];

/**
 * Frames every preview screen with a sticky demo control bar for switching
 * between the sample pages, plus the global theme toggle.
 */
export function PreviewLayout() {
  return (
    <section className={rootStyles}>
      <header className={barStyles}>
        <section className={barInnerStyles}>
          <strong className={brandStyles}>Divami · Preview</strong>
          <nav className={navStyles} aria-label="Preview pages">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(navLinkBaseStyles, isActive && navLinkActiveStyles)
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <section className={actionsStyles}>
            <ThemeToggle />
          </section>
        </section>
      </header>
      <main className={mainStyles}>
        <Outlet />
      </main>
    </section>
  );
}
