import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  actionStyles,
  descriptionStyles,
  headerStyles,
  rowStyles,
  titleStyles,
  titleWrapStyles,
} from "./PageHeader.styles";
import type { PageHeaderProps } from "./types";

/**
 * Standard page header: optional breadcrumbs, a title/description block, and an
 * optional action slot. Used across every preview screen for a consistent top.
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
}: PageHeaderProps) {
  return (
    <header className={headerStyles}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <Fragment key={crumb.label}>
                  <BreadcrumbItem>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {isLast ? null : <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}
      <section className={rowStyles}>
        <section className={titleWrapStyles}>
          <h1 className={titleStyles}>{title}</h1>
          {description ? (
            <p className={descriptionStyles}>{description}</p>
          ) : null}
        </section>
        {action ? <section className={actionStyles}>{action}</section> : null}
      </section>
    </header>
  );
}
