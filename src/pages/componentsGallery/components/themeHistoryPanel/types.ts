export type ThemeCandidateStatus = "candidate" | "rejected" | "approved";

export interface ThemeLogEntry {
  date: string;
  round: string;
  file: string;
  status: ThemeCandidateStatus;
  notes?: string;
}

export interface ThemeHistoryPanelProps {
  entries: ThemeLogEntry[];
}
