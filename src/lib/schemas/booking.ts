import { z } from "zod";

export const bookingDetailsSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  note: z.string().max(300, "Note is too long").optional(),
});
export type BookingDetailsFormValues = z.infer<typeof bookingDetailsSchema>;

export const bookingSchema = bookingDetailsSchema.extend({
  availabilityId: z.number({ error: "Please select a time slot" }),
});
export type BookingFormValues = z.infer<typeof bookingSchema>;