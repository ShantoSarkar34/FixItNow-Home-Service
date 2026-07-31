"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";

export function CancelBookingButton({ bookingId }: { bookingId: number }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleCancel = async () => {
    setLoading(true);
    try {
      await api.patch(`/api/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({
        queryKey: ["booking", String(bookingId)],
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't cancel booking",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleCancel} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        "Cancel booking"
      )}
    </Button>
  );
}
