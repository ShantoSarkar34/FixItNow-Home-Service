"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import type { Booking, BookingStatus } from "@/types";

export function TechnicianBookingActions({ booking }: { booking: Booking }) {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: (status: BookingStatus) =>
      api.patch(`/api/technician/bookings/${booking.id}`, { status }),
    onSuccess: () => {
      toast.success("Booking updated");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't update booking",
      ),
  });

  if (booking.status === "PENDING") {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => updateStatus.mutate("ACCEPTED")}
          disabled={updateStatus.isPending}
        >
          {updateStatus.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Accept"
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateStatus.mutate("DECLINED")}
          disabled={updateStatus.isPending}
        >
          Decline
        </Button>
      </div>
    );
  }

  if (booking.status === "ACCEPTED") {
    return (
      <Button
        size="sm"
        onClick={() => updateStatus.mutate("IN_PROGRESS")}
        disabled={updateStatus.isPending}
      >
        {updateStatus.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          "Start job"
        )}
      </Button>
    );
  }

  if (booking.status === "IN_PROGRESS") {
    return (
      <Button
        size="sm"
        onClick={() => updateStatus.mutate("COMPLETED")}
        disabled={updateStatus.isPending}
      >
        {updateStatus.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          "Mark complete"
        )}
      </Button>
    );
  }

  return null;
}
