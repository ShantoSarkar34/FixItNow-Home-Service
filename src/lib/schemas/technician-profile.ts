import { z } from "zod";

export const technicianProfileSchema = z.object({
  bio: z.string().max(500).optional().or(z.literal("")),
  experience: z.string().max(300).optional().or(z.literal("")),
  yearsExperience: z.number().min(0).max(60).optional(),
  location: z.string().min(2, "Location is required"),
});
export type TechnicianProfileFormValues = z.infer<typeof technicianProfileSchema>;