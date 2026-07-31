import { z } from "zod";

export const formPreviewSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email address, like jane@company.com"),
  projectType: z.string().min(1, "Select a project type"),
  notificationChannels: z
    .array(z.string())
    .min(1, "Select at least one notification channel"),
  autoRenew: z.boolean(),
  contactMethod: z.string().min(1, "Select a contact method"),
  teamNotes: z.string().optional(),
  kickoffDate: z.string().min(1, "Choose a kickoff date"),
});

export type FormPreviewValues = z.infer<typeof formPreviewSchema>;
