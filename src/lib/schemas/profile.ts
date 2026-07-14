import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
