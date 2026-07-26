import { Palette } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { themeHistoryPanelStyles } from "./ThemeHistoryPanel.styles";
import type { ThemeCandidateStatus, ThemeHistoryPanelProps } from "./types";

const STATUS_VARIANT: Record<
  ThemeCandidateStatus,
  "default" | "secondary" | "destructive"
> = {
  approved: "default",
  candidate: "secondary",
  rejected: "destructive",
};

export function ThemeHistoryPanel({ entries }: ThemeHistoryPanelProps) {
  if (entries.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Palette />
          </EmptyMedia>
          <EmptyTitle>No theme candidates yet</EmptyTitle>
          <EmptyDescription>
            See styling/shadcn/03-theme-versioning.md for how to create one.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    );
  }

  return (
    <ul className={themeHistoryPanelStyles.list}>
      {entries.map((entry) => (
        <li key={entry.file} className={themeHistoryPanelStyles.entry}>
          <div className={themeHistoryPanelStyles.entryMain}>
            <span className={themeHistoryPanelStyles.entryFile}>
              {entry.file}
            </span>
            <span className={themeHistoryPanelStyles.entryMeta}>
              {entry.date} — {entry.round}
            </span>
            {entry.notes ? (
              <span className={themeHistoryPanelStyles.entryNotes}>
                {entry.notes}
              </span>
            ) : null}
          </div>
          <Badge variant={STATUS_VARIANT[entry.status]}>{entry.status}</Badge>
        </li>
      ))}
    </ul>
  );
}
