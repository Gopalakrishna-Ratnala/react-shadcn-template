import { cn } from "@/lib/utils";

export const dashboardPreviewPageStyles = {
  wrapper: cn("flex flex-col gap-6"),
  statGrid: cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"),
  chartGrid: cn("grid grid-cols-1 gap-4 lg:grid-cols-2"),
  bottomGrid: cn("grid grid-cols-1 gap-4 lg:grid-cols-3"),
  activityCard: cn("lg:col-span-2"),
  progressContent: cn("flex flex-col gap-4"),
  progressRow: cn("flex w-full items-center justify-between text-sm"),
  progressLabel: cn("text-muted-foreground"),
  progressValue: cn("font-medium text-foreground"),
  goalList: cn("flex flex-col gap-2"),
  goalListRow: cn("flex items-center justify-between text-sm"),
};
