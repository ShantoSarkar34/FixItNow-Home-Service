import { z } from "zod";

export const accountProfileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  photo: z.string().optional().or(z.literal("")),
});
export type AccountProfileFormValues = z.infer<typeof accountProfileSchema>;