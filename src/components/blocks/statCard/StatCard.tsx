import type { ReactElement } from "react";

import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

import { statCardStyles as styles } from "./StatCard.styles";

import type { StatCardProps } from "./types";

export const StatCard = ({
  label,
  value,
  delta,
  icon,
}: StatCardProps): ReactElement => {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.label}>{label}</CardTitle>
        {icon && <span className={styles.icon}>{icon}</span>}
      </CardHeader>
      <CardContent>
        <p className={styles.value}>{value}</p>
        {delta && (
          <p
            className={cn(
              styles.delta,
              delta.direction === "up" ? styles.deltaUp : styles.deltaDown,
            )}
          >
            <Icon
              icon={delta.direction === "up" ? TrendingUp : TrendingDown}
              size="sm"
            />
            {delta.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
