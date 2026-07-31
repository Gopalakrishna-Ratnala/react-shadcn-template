import { cn } from "@/lib/utils";

export const detailsPreviewPageStyles = {
  wrapper: cn("flex flex-col gap-6"),
  overviewGrid: cn("grid grid-cols-1 gap-4 lg:grid-cols-3"),
  descriptionCard: cn("lg:col-span-2"),
  descriptionContent: cn("flex flex-col gap-4"),
  propertiesList: cn("grid grid-cols-1 gap-3 sm:grid-cols-2"),
  propertyLabel: cn("text-sm text-muted-foreground"),
  propertyValue: cn("text-sm font-medium text-foreground"),
  metadataCard: cn("flex flex-col gap-4"),
  ownerRow: cn("flex items-center gap-3"),
  ownerName: cn("text-sm font-medium text-foreground"),
  ownerRole: cn("text-sm text-muted-foreground"),
  metaRow: cn("flex items-center justify-between text-sm"),
  metaLabel: cn("text-muted-foreground"),
  tagsRow: cn("flex flex-wrap gap-2"),
  placeholderCard: cn("text-sm text-muted-foreground"),
  activityList: cn("flex flex-col gap-4"),
  activityRow: cn("flex items-center justify-between gap-4 text-sm"),
  activityActor: cn("font-medium text-foreground"),
};
