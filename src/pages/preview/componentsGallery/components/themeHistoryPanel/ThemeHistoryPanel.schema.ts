import { z } from "zod";

export const themeLogEntrySchema = z.object({
  date: z.string(),
  round: z.string(),
  file: z.string(),
  status: z.enum(["candidate", "rejected", "approved"]),
  notes: z.string().optional(),
});

export const themeLogSchema = z.array(themeLogEntrySchema);
