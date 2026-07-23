import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

import {
  bodyStyles,
  captionStyles,
  labelStyles,
  trendBaseStyles,
  trendDownStyles,
  trendRowStyles,
  trendUpStyles,
  valueStyles,
} from "./StatCard.styles";
import type { StatCardProps } from "./types";

/**
 * A single metric tile: label, value, and a signed trend indicator wired to the
 * success/destructive tokens.
 */
export function StatCard({
  label,
  value,
  changePercent,
  changeCaption,
}: StatCardProps) {
  const isPositive = changePercent >= 0;

  return (
    <Card>
      <CardContent className={bodyStyles}>
        <p className={labelStyles}>{label}</p>
        <strong className={valueStyles}>{value}</strong>
        <p className={trendRowStyles}>
          <em
            className={cn(
              trendBaseStyles,
              isPositive ? trendUpStyles : trendDownStyles,
            )}
          >
            <Icon
              icon={isPositive ? ArrowUpRightIcon : ArrowDownRightIcon}
              size="sm"
            />
            {Math.abs(changePercent)}%
          </em>
          <small className={captionStyles}>{changeCaption}</small>
        </p>
      </CardContent>
    </Card>
  );
}
