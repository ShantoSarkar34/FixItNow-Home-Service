import { z } from "zod";

export const bookingSchema = z.object({
  availabilityId: z.number({ error: "Please select a time slot" }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  note: z.string().max(300, "Note is too long").optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
