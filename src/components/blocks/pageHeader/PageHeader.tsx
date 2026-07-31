import type { ReactElement } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { pageHeaderStyles as styles } from "./PageHeader.styles";

import type { PageHeaderProps } from "./types";

export const PageHeader = ({
  title,
  description,
  breadcrumbItems,
  actions,
}: PageHeaderProps): ReactElement => {
  return (
    <div className={styles.wrapper}>
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb className={styles.breadcrumb}>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              return (
                <li key={item.label} className={styles.breadcrumbItem}>
                  <BreadcrumbItem>
                    {isLast || !item.href ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </li>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className={styles.row}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
};
