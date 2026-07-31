import { cn } from "@/lib/utils";

/* ---------- Page shell ---------- */
export const pageRootStyles = cn("flex flex-col gap-6");

export const topBarStyles = cn("border-b border-border pb-4");

export const topBarInnerStyles = cn("flex flex-col gap-1");

export const topBarTitleWrapStyles = cn("flex flex-col");

export const topBarKickerStyles = cn(
  "text-xs font-medium uppercase tracking-wide text-primary",
);

export const topBarTitleStyles = cn(
  "text-base font-semibold tracking-tight text-foreground sm:text-lg",
);

export const topBarHelperStyles = cn("text-xs text-muted-foreground");

export const topBarActionsStyles = cn("flex items-center gap-2");

export const layoutStyles = cn("flex flex-col gap-8 lg:flex-row lg:gap-10");

/* ---------- In-page navigation ----------
   A vertical table-of-contents beside the continuous-scroll content. This is
   only one vertical nav on screen — PreviewShell's own nav is a horizontal
   top bar, so there's no longer a second-sidebar conflict here. */
export const navAsideStyles = cn(
  "flex shrink-0 flex-col gap-2 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:w-56 lg:overflow-y-auto",
);

export const navHeadingStyles = cn(
  "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
);

export const navListStyles = cn(
  "flex flex-row flex-wrap gap-1 lg:flex-col lg:flex-nowrap",
);

export const navLinkStyles = cn(
  "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors",
  "hover:bg-muted hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

export const mainStyles = cn("flex min-w-0 flex-1 flex-col gap-14");

/* ---------- Section scaffolding ---------- */
export const sectionStyles = cn("flex scroll-mt-24 flex-col gap-6");

export const sectionHeaderStyles = cn(
  "flex flex-col gap-1 border-b border-border pb-3",
);

export const sectionKickerStyles = cn(
  "text-xs font-semibold uppercase tracking-wide text-primary",
);

export const sectionTitleStyles = cn(
  "text-2xl font-semibold tracking-tight text-foreground",
);

export const sectionDescStyles = cn("max-w-2xl text-sm text-muted-foreground");

export const subGroupStyles = cn("flex flex-col gap-3");

export const subGroupTitleStyles = cn(
  "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
);

/* ---------- Generic layout helpers ---------- */
export const rowStyles = cn("flex flex-wrap items-center gap-3");

export const rowStartStyles = cn("flex flex-wrap items-start gap-3");

export const colStyles = cn("flex flex-col gap-3");

export const specimenGridStyles = cn(
  "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
);

export const specimenGridTwoStyles = cn(
  "grid grid-cols-1 gap-4 md:grid-cols-2",
);

export const noteStyles = cn("text-xs text-muted-foreground");

export const helperTextStyles = cn("text-xs text-muted-foreground");

export const errorTextStyles = cn("text-xs text-destructive");

export const fieldStackStyles = cn("flex w-full max-w-xs flex-col gap-1.5");

export const constrainedStyles = cn("w-full max-w-xs");

export const constrainedMdStyles = cn("w-full max-w-md");

/* ---------- Foundations: color swatches ---------- */
export const swatchGridStyles = cn(
  "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
);

/* ---------- Foundations: typography scale ---------- */
export const typeScaleListStyles = cn("flex flex-col");

export const typeRowStyles = cn(
  "flex flex-wrap items-baseline justify-between gap-3 border-b border-border py-3",
);

export const typeTokenStyles = cn("font-mono text-xs text-muted-foreground");

export const textXsStyles = cn("text-xs text-foreground");
export const textSmStyles = cn("text-sm text-foreground");
export const textBaseStyles = cn("text-base text-foreground");
export const textLgStyles = cn("text-lg text-foreground");
export const textXlStyles = cn("text-xl text-foreground");
export const text2xlStyles = cn("text-2xl text-foreground");
export const text3xlStyles = cn("text-3xl text-foreground");
export const text4xlStyles = cn(
  "text-4xl font-semibold tracking-tight text-foreground",
);

/* ---------- Foundations: weights ---------- */
export const weightRowStyles = cn(
  "flex items-baseline justify-between gap-3 border-b border-border py-2",
);
export const weightNormalStyles = cn("text-lg font-normal text-foreground");
export const weightMediumStyles = cn("text-lg font-medium text-foreground");
export const weightSemiboldStyles = cn("text-lg font-semibold text-foreground");
export const weightBoldStyles = cn("text-lg font-bold text-foreground");

/* ---------- Foundations: radius + shadow ---------- */
export const sampleGridStyles = cn("grid grid-cols-2 gap-4 sm:grid-cols-4");

export const sampleCaptionStyles = cn(
  "font-mono text-xs text-muted-foreground",
);

export const sampleCellStyles = cn("flex flex-col gap-2");

export const radiusBoxSmStyles = cn(
  "h-16 w-full rounded-sm border border-border bg-muted",
);
export const radiusBoxMdStyles = cn(
  "h-16 w-full rounded-md border border-border bg-muted",
);
export const radiusBoxLgStyles = cn(
  "h-16 w-full rounded-lg border border-border bg-muted",
);
export const radiusBoxFullStyles = cn(
  "h-16 w-full rounded-full border border-border bg-muted",
);

export const shadowBoxSmStyles = cn(
  "h-16 w-full rounded-md border border-border bg-card shadow-sm",
);
export const shadowBoxMdStyles = cn(
  "h-16 w-full rounded-md border border-border bg-card shadow-md",
);
export const shadowBoxLgStyles = cn(
  "h-16 w-full rounded-md border border-border bg-card shadow-lg",
);
export const shadowBoxFocusStyles = cn(
  "h-16 w-full rounded-md border border-border bg-card shadow-focus",
);

/* ---------- Foundations: icon sizes ---------- */
export const iconRowStyles = cn("flex items-end gap-6");
export const iconCellStyles = cn(
  "flex flex-col items-center gap-2 text-primary",
);
export const iconCaptionStyles = cn("font-mono text-xs text-muted-foreground");

/* ---------- Section 2: labels, kbd, marker ---------- */
export const kbdRowStyles = cn("flex flex-wrap items-center gap-4");
export const markerColStyles = cn("flex w-full max-w-md flex-col gap-4");

/* ---------- Section 7: feedback ---------- */
export const alertColStyles = cn("flex flex-col gap-3");
export const progressColStyles = cn("flex w-full max-w-md flex-col gap-4");
export const skeletonCardStyles = cn(
  "flex w-full max-w-sm flex-col gap-3 rounded-lg border border-border p-4",
);
export const skeletonRowStyles = cn("flex items-center gap-3");
export const skeletonLinesStyles = cn("flex flex-1 flex-col gap-2");

/* ---------- Section 8/9: overlays + menus ---------- */
export const overlayTriggerRowStyles = cn("flex flex-wrap items-center gap-3");
export const contextTargetStyles = cn(
  "flex h-28 w-full max-w-md items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground",
);
export const navMenuPanelStyles = cn("grid w-72 gap-1 p-2 md:grid-cols-1");
export const navMenuLinkStyles = cn(
  "flex flex-col gap-0.5 rounded-md p-2 hover:bg-muted",
);
export const navMenuLinkTitleStyles = cn("text-sm font-medium text-foreground");
export const navMenuLinkDescStyles = cn("text-xs text-muted-foreground");
export const commandWrapStyles = cn(
  "w-full max-w-md rounded-lg border border-border shadow-sm",
);

/* ---------- Section 10: navigation ---------- */
export const paginationWrapStyles = cn("flex w-full justify-start");
export const sidebarPairStyles = cn("grid grid-cols-1 gap-4 lg:grid-cols-2");
export const sidebarFrameStyles = cn(
  "h-96 overflow-hidden rounded-lg border border-border",
);
export const directionPairStyles = cn("grid grid-cols-1 gap-4 sm:grid-cols-2");
export const directionBlockStyles = cn(
  "flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground",
);
export const directionLabelStyles = cn(
  "flex flex-col gap-0.5 text-sm text-card-foreground",
);

/* ---------- Section 11: data display ---------- */
export const statGridStyles = cn(
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
);
export const statValueStyles = cn(
  "text-3xl font-semibold tracking-tight text-foreground",
);
export const statTrendStyles = cn("text-xs font-medium text-success");
export const mediaFigureStyles = cn(
  "flex size-full items-center justify-center bg-muted text-muted-foreground",
);
export const avatarRowStyles = cn("flex flex-wrap items-center gap-4");
export const separatorRowStyles = cn("flex h-6 items-center gap-4 text-sm");
export const aspectFigureStyles = cn(
  "flex size-full items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground",
);
export const aspectGridStyles = cn("grid grid-cols-1 gap-4 sm:grid-cols-2");
export const scrollAreaStyles = cn(
  "h-48 w-full max-w-xs rounded-md border border-border",
);
export const scrollAreaListStyles = cn("flex flex-col gap-2 p-4");
export const scrollAreaItemStyles = cn(
  "rounded-md border border-border px-3 py-2 text-sm text-foreground",
);
export const resizableGroupStyles = cn(
  "h-48 w-full max-w-2xl rounded-lg border border-border",
);
export const resizablePanelStyles = cn(
  "flex h-full items-center justify-center p-4 text-sm font-medium text-foreground",
);
export const itemListStyles = cn("flex w-full max-w-lg flex-col");
export const tableActionsStyles = cn("flex justify-end gap-1");
export const chartGridStyles = cn("grid grid-cols-1 gap-4 lg:grid-cols-3");
export const chartBodyStyles = cn("h-64 w-full");
export const cellNumericStyles = cn("text-right font-mono text-sm");

/* ---------- Section 12: media & files ---------- */
export const attachmentRowStyles = cn("flex flex-wrap gap-4");
export const carouselWrapStyles = cn("mx-12 w-full max-w-md");
export const carouselItemInnerStyles = cn(
  "flex aspect-video items-center justify-center rounded-lg border border-border bg-card text-card-foreground",
);
export const carouselItemLabelStyles = cn(
  "text-lg font-semibold text-foreground",
);

/* ---------- Section 13: messaging ---------- */
export const chatWrapStyles = cn(
  "flex w-full max-w-lg flex-col gap-4 rounded-lg border border-border bg-card p-4",
);
export const scrollerStyles = cn("h-72 w-full max-w-lg");
export const scrollerBodyStyles = cn("flex flex-col gap-3 p-1");

/* ---------- Skeletons ---------- */
export const skeletonAvatarStyles = cn("size-10 shrink-0 rounded-full");
export const skeletonLineStyles = cn("h-3 w-full rounded");
export const skeletonLineShortStyles = cn("h-3 w-2/3 rounded");
export const skeletonBlockStyles = cn("h-28 w-full rounded-md");
export const skeletonTitleStyles = cn("h-4 w-1/2 rounded");

/* ---------- Tabs / panels ---------- */
export const tabPanelStyles = cn(
  "rounded-lg border border-border bg-card p-4 text-sm text-card-foreground",
);

/* ---------- Popover / dialog body ---------- */
export const popoverBodyStyles = cn("flex flex-col gap-3");
export const dialogFormStyles = cn("flex flex-col gap-3 py-2");
export const timeStyles = cn("text-xs text-muted-foreground");
