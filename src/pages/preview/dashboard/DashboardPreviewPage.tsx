import type { ReactElement } from "react";

import { Plus } from "lucide-react";
import { Link } from "react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts";

import { PageHeader, StatCard, StatusBadge } from "@/components/blocks";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PROJECT_STATUS_BADGE_MAP, ROUTES } from "@/constants";

import {
  GOAL_BREAKDOWN,
  PROJECT_STATUS_SPLIT,
  RECENT_ACTIVITY,
  REVENUE_BY_MONTH,
} from "./DashboardPreviewPage.data";
import { dashboardPreviewPageStyles as styles } from "./DashboardPreviewPage.styles";

import type { ChartConfig } from "@/components/ui/chart";

const REVENUE_CHART_CONFIG: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  target: { label: "Target", color: "var(--chart-2)" },
};

const STATUS_CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const STATUS_CHART_CONFIG: ChartConfig =
  PROJECT_STATUS_SPLIT.reduce<ChartConfig>(
    (config, slice, index) => ({
      ...config,
      [slice.status]: {
        label: slice.status,
        color: STATUS_CHART_COLORS[index],
      },
    }),
    {},
  );

export const DashboardPreviewPage = (): ReactElement => {
  return (
    <section className={styles.wrapper}>
      <PageHeader
        title="Overview"
        description="Showing data for the last 30 days."
        actions={
          <Button>
            <Plus data-icon="inline-start" />
            New project
          </Button>
        }
      />

      <div className={styles.statGrid}>
        <StatCard
          label="Active projects"
          value="19"
          delta={{ value: "+3 vs last month", direction: "up" }}
        />
        <StatCard
          label="Revenue this month"
          value="$104,800"
          delta={{ value: "+8.9% vs last month", direction: "up" }}
        />
        <StatCard
          label="Avg. delivery time"
          value="6.2 days"
          delta={{ value: "-1.1 days vs last month", direction: "down" }}
        />
        <StatCard
          label="Client satisfaction"
          value="94%"
          delta={{ value: "+2 pts vs last month", direction: "up" }}
        />
      </div>

      <div className={styles.chartGrid}>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by month</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={REVENUE_CHART_CONFIG}>
              <BarChart data={REVENUE_BY_MONTH}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                <Bar dataKey="target" fill="var(--color-target)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project status split</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={STATUS_CHART_CONFIG}>
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="status" hideLabel />}
                />
                <Pie
                  data={PROJECT_STATUS_SPLIT}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={48}
                >
                  {PROJECT_STATUS_SPLIT.map((slice, index) => (
                    <Cell
                      key={slice.status}
                      fill={STATUS_CHART_COLORS[index]}
                    />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className={styles.bottomGrid}>
        <Card className={styles.activityCard}>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_ACTIVITY.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.project}</TableCell>
                    <TableCell>{row.client}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={PROJECT_STATUS_BADGE_MAP[row.status]}
                        label={row.status}
                      />
                    </TableCell>
                    <TableCell>
                      <time dateTime={row.updatedAt}>{row.updatedAt}</time>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Q3 goal</CardTitle>
          </CardHeader>
          <CardContent className={styles.progressContent}>
            <Progress value={72}>
              <div className={styles.progressRow}>
                <ProgressLabel className={styles.progressLabel}>
                  Revenue target
                </ProgressLabel>
                <ProgressValue className={styles.progressValue} />
              </div>
            </Progress>
            <Separator />
            <ul className={styles.goalList}>
              {GOAL_BREAKDOWN.map((item) => (
                <li key={item.label} className={styles.goalListRow}>
                  <span className={styles.progressLabel}>{item.label}</span>
                  <span className={styles.progressValue}>{item.value}</span>
                </li>
              ))}
            </ul>
            <Link
              to={ROUTES.PREVIEW_LISTING}
              className={buttonVariants({ variant: "outline" })}
            >
              View all projects
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
