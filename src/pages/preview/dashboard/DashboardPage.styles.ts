import { cn } from "@/lib/utils";

export const pageStyles = cn("flex flex-col gap-6");

export const statGridStyles = cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4");

export const chartsGridStyles = cn("grid grid-cols-1 gap-4 lg:grid-cols-2");

export const bottomGridStyles = cn("grid grid-cols-1 gap-4 lg:grid-cols-3");

export const activityColumnStyles = cn("lg:col-span-2");

export const chartBoxStyles = cn("aspect-video w-full");

export const donutBoxStyles = cn("mx-auto aspect-square max-h-64");

export const activityCellMutedStyles = cn("text-sm text-muted-foreground");

export const goalCardBodyStyles = cn("flex flex-col gap-4");

export const goalMetaRowStyles = cn("flex items-baseline justify-between");

export const goalValueStyles = cn("text-2xl font-semibold");

export const goalCaptionStyles = cn("text-sm text-muted-foreground");

export const goalListStyles = cn("flex flex-col gap-3");

export const goalListRowStyles = cn("flex items-center justify-between text-sm");

export const goalListLabelStyles = cn("text-muted-foreground");
