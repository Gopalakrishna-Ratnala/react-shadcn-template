import type { ReactElement } from "react";

import { NavLink, Outlet, ScrollRestoration } from "react-router";

import { ThemeToggle } from "@/components/shared";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

import { previewShellStyles as styles } from "./PreviewShell.styles";

import type { PreviewNavItem } from "./types";

const NAV_ITEMS: PreviewNavItem[] = [
  { label: "Dashboard", to: ROUTES.PREVIEW_DASHBOARD },
  { label: "Projects", to: ROUTES.PREVIEW_LISTING },
  { label: "Detail", to: ROUTES.PREVIEW_DETAILS },
  { label: "New project", to: ROUTES.PREVIEW_FORM },
  { label: "Components", to: ROUTES.COMPONENTS_GALLERY },
];

export const PreviewShell = (): ReactElement => {
  return (
    <div className={styles.root}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <strong className={styles.brand}>Divami · Preview</strong>
          <nav className={styles.nav} aria-label="Preview pages">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(styles.navLinkBase, isActive && styles.navLinkActive)
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className={styles.actions}>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
};
