import type { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";

import { statusBadgeVariants } from "./StatusBadge.styles";

import type { StatusBadgeProps } from "./types";

export const StatusBadge = ({
  status,
  label,
}: StatusBadgeProps): ReactElement => {
  return (
    <Badge variant="outline" className={statusBadgeVariants({ status })}>
      {label}
    </Badge>
  );
};
