"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SlotPicker } from "@/components/booking/slot-picker";
import { bookingSchema, type BookingFormValues } from "@/lib/schemas/booking";
import { api, ApiError } from "@/lib/api";
import type { Booking, Service, TechnicianProfile } from "@/types";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  service: Service;
}

type Step = "slot" | "details" | "success";

export function BookingModal({ open, onClose, service }: BookingModalProps) {
  const [step, setStep] = useState<Step>("slot");
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const queryClient = useQueryClient();

  // Assumes GET /api/technicians/:id returns an `availability` array.
  const { data: technician, isLoading } = useQuery({
    queryKey: ["technician", service.technicianId],
    queryFn: () =>
      api.get<TechnicianProfile>(`/api/technicians/${service.technicianId}`),
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({ resolver: zodResolver(bookingSchema) });

  const createBooking = useMutation({
    mutationFn: (values: BookingFormValues) =>
      api.post<Booking>("/api/bookings", { serviceId: service.id, ...values }),
    onSuccess: (booking) => {
      setCreatedBooking(booking);
      setStep("success");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Couldn't create booking. Try again.",
      );
    },
  });

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("slot");
      setSelectedSlotId(null);
      setCreatedBooking(null);
      reset();
    }, 200);
  };

  const onSubmit = (values: BookingFormValues) => {
    if (!selectedSlotId) return;
    createBooking.mutate({ ...values, availabilityId: selectedSlotId });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={step !== "success" ? "Book this service" : undefined}
    >
      <AnimatePresence mode="wait">
        {step === "slot" && (
          <motion.div
            key="slot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="mb-1 text-sm font-medium text-foreground">
              {service.title}
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              ৳{parseFloat(service.price).toFixed(0)} · {service.duration} min
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <SlotPicker
                slots={technician?.availability ?? []}
                selectedId={selectedSlotId}
                onSelect={setSelectedSlotId}
              />
            )}

            <Button
              className="mt-6 w-full"
              disabled={!selectedSlotId}
              onClick={() => setStep("details")}
            >
              Continue
            </Button>
          </motion.div>
        )}

        {step === "details" && (
          <motion.form
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Service address
              </label>
              <input
                {...register("address")}
                placeholder="House 12, Road 4, Bogra"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Note for technician (optional)
              </label>
              <textarea
                {...register("note")}
                rows={3}
                placeholder="Anything they should know beforehand?"
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.note && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.note.message}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep("slot")}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createBooking.isPending}
              >
                {createBooking.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirm booking"
                )}
              </Button>
            </div>
          </motion.form>
        )}

        {step === "success" && createdBooking && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-4 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
              Booking requested
            </h3>
            <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
              {technician?.user?.name ?? "The technician"} has been notified.
              You'll be able to pay once they accept — check your bookings for
              updates.
            </p>
            <Button className="mt-6 w-full" onClick={handleClose}>
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
