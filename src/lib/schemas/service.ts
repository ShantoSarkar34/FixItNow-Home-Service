import { z } from "zod";

export const serviceSchema = z.object({
  categoryId: z.number({ error: "Select a category" }),
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  price: z.number({ error: "Price is required" }).min(1, "Price must be greater than 0"),
  duration: z
    .number({ error: "Duration is required" })
    .min(5, "Duration must be at least 5 minutes"),
  location: z.string().min(2, "Location is required"),
  isActive: z.boolean(),
});
export type ServiceFormValues = z.infer<typeof serviceSchema>;