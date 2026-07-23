import { Link } from "react-router";
import { DownloadIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts";

import { PageHeader, StatCard, StatusBadge } from "@/components/blocks";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/constants";

import {
  activityCellMutedStyles,
  activityColumnStyles,
  bottomGridStyles,
  chartBoxStyles,
  chartsGridStyles,
  donutBoxStyles,
  goalCaptionStyles,
  goalCardBodyStyles,
  goalListLabelStyles,
  goalListRowStyles,
  goalListStyles,
  goalMetaRowStyles,
  goalValueStyles,
  pageStyles,
  statGridStyles,
} from "./DashboardPage.styles";
import type { ActivityEntry, DashboardStat, RevenuePoint, StatusSlice } from "./types";

const STATS: DashboardStat[] = [
  { label: "Active projects", value: "24", changePercent: 12, changeCaption: "vs last quarter" },
  { label: "Revenue this quarter", value: "$482K", changePercent: 9, changeCaption: "vs last quarter" },
  { label: "Billable utilization", value: "78%", changePercent: 4, changeCaption: "vs last quarter" },
  { label: "Client satisfaction", value: "4.6 / 5", changePercent: -3, changeCaption: "vs last quarter" },
];

const REVENUE: RevenuePoint[] = [
  { month: "Jan", revenue: 62, target: 60 },
  { month: "Feb", revenue: 71, target: 65 },
  { month: "Mar", revenue: 68, target: 70 },
  { month: "Apr", revenue: 82, target: 75 },
  { month: "May", revenue: 91, target: 80 },
  { month: "Jun", revenue: 88, target: 85 },
];

const STATUS_SLICES: StatusSlice[] = [
  { key: "inProgress", label: "In progress", count: 9 },
  { key: "inReview", label: "In review", count: 5 },
  { key: "completed", label: "Completed", count: 6 },
  { key: "onHold", label: "On hold", count: 2 },
  { key: "atRisk", label: "At risk", count: 2 },
];

const ACTIVITY: ActivityEntry[] = [
  {
    id: "act_1",
    actor: "Priya Sharma",
    action: "moved",
    target: "Northwind Mobile App",
    timestamp: "2h ago",
    tone: "info",
    statusLabel: "In progress",
  },
  {
    id: "act_2",
    actor: "Daniel Cho",
    action: "submitted for review",
    target: "Aurora Care Portal",
    timestamp: "5h ago",
    tone: "warning",
    statusLabel: "In review",
  },
  {
    id: "act_3",
    actor: "Owen Bennett",
    action: "shipped",
    target: "Lumen Storefront Refresh",
    timestamp: "Yesterday",
    tone: "success",
    statusLabel: "Completed",
  },
  {
    id: "act_4",
    actor: "Meera Iyer",
    action: "flagged a blocker on",
    target: "Vertex Ops Dashboard",
    timestamp: "Yesterday",
    tone: "destructive",
    statusLabel: "At risk",
  },
  {
    id: "act_5",
    actor: "Alicia Wong",
    action: "paused",
    target: "Solace Onboarding Flow",
    timestamp: "2 days ago",
    tone: "muted",
    statusLabel: "On hold",
  },
];

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  target: { label: "Target", color: "var(--chart-2)" },
} satisfies ChartConfig;

const statusChartConfig = {
  count: { label: "Projects" },
  inProgress: { label: "In progress", color: "var(--chart-1)" },
  inReview: { label: "In review", color: "var(--chart-2)" },
  completed: { label: "Completed", color: "var(--chart-3)" },
  onHold: { label: "On hold", color: "var(--chart-4)" },
  atRisk: { label: "At risk", color: "var(--chart-5)" },
} satisfies ChartConfig;

const GOAL_TARGET = 700;
const GOAL_BOOKED = 476;
const GOAL_PERCENT = Math.round((GOAL_BOOKED / GOAL_TARGET) * 100);

export function DashboardPage() {
  return (
    <section className={pageStyles} aria-label="Studio dashboard">
      <PageHeader
        title="Dashboard"
        description="Studio performance for Q3 2026 · Apr 1 – Jun 30"
        action={
          <Button type="button" variant="outline">
            <DownloadIcon />
            Export report
          </Button>
        }
      />

      <section className={statGridStyles} aria-label="Key metrics">
        {STATS.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            changePercent={stat.changePercent}
            changeCaption={stat.changeCaption}
          />
        ))}
      </section>

      <section className={chartsGridStyles} aria-label="Trends">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs target</CardTitle>
            <CardDescription>Monthly billings in thousands (USD)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className={chartBoxStyles}>
              <BarChart data={REVENUE} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
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
            <CardTitle>Projects by status</CardTitle>
            <CardDescription>Distribution across the active portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusChartConfig} className={donutBoxStyles}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
                <Pie data={STATUS_SLICES} dataKey="count" nameKey="key" innerRadius={55}>
                  {STATUS_SLICES.map((slice) => (
                    <Cell key={slice.key} fill={`var(--color-${slice.key})`} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="key" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className={bottomGridStyles} aria-label="Recent activity and goals">
        <Card className={activityColumnStyles}>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest updates across the studio</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team member</TableHead>
                  <TableHead>Update</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ACTIVITY.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.actor}</TableCell>
                    <TableCell>
                      {entry.action} {entry.target}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={entry.tone} label={entry.statusLabel} />
                    </TableCell>
                    <TableCell className={activityCellMutedStyles}>{entry.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quarterly revenue goal</CardTitle>
            <CardDescription>Booked against the Q3 target</CardDescription>
          </CardHeader>
          <CardContent className={goalCardBodyStyles}>
            <section className={goalMetaRowStyles} aria-label="Goal progress">
              <strong className={goalValueStyles}>${GOAL_BOOKED}K</strong>
              <small className={goalCaptionStyles}>of ${GOAL_TARGET}K target</small>
            </section>
            <Progress value={GOAL_PERCENT}>
              <ProgressLabel>Booked revenue</ProgressLabel>
              <ProgressValue />
            </Progress>
            <Separator />
            <ul className={goalListStyles}>
              <li className={goalListRowStyles}>
                <p className={goalListLabelStyles}>Signed this quarter</p>
                <strong>$318K</strong>
              </li>
              <li className={goalListRowStyles}>
                <p className={goalListLabelStyles}>In pipeline</p>
                <strong>$158K</strong>
              </li>
              <li className={goalListRowStyles}>
                <p className={goalListLabelStyles}>Remaining to goal</p>
                <strong>${GOAL_TARGET - GOAL_BOOKED}K</strong>
              </li>
            </ul>
            <Link to={ROUTES.PREVIEW_LISTING} className={buttonVariants({ variant: "outline" })}>
              View all projects
            </Link>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}

export default DashboardPage;
