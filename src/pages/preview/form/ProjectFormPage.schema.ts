import { z } from "zod";

export const projectFormSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  clientId: z.string().min(1, "Select a client for this project"),
  description: z
    .string()
    .max(280, "Keep the description under 280 characters")
    .optional(),
  startDate: z.string().min(1, "Choose a start date"),
  priority: z.enum(["low", "medium", "high"]),
  projectLead: z.string().min(1, "Select a project lead"),
  teamMembers: z.array(z.string()).min(1, "Add at least one team member"),
  emailUpdates: z.boolean(),
  makePrivate: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
