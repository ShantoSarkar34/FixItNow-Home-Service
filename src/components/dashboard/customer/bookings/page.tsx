"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Calendar } from "lucide-react";
import { BookingStatusBadge } from "@/components/ui/status-badge";
import { PayNowButton } from "@/components/booking/pay-now-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import type { BookingStatus } from "@/types";
import { useBookings } from "@/hooks/use-bookings";

const TABS: { value: BookingStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DECLINED", label: "Declined" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function CustomerBookingsPage() {
  const [tab, setTab] = useState<BookingStatus | "ALL">("ALL");
  const { data: bookings, isLoading } = useBookings(tab);
  const queryClient = useQueryClient();

  const cancelBooking = useMutation({
    mutationFn: (id: number) => api.patch(`/api/bookings/${id}/cancel`),
    onSuccess: () => {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't cancel booking"),
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">My bookings</h1>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            data-cursor-hover
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors",
              tab === t.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/50"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading bookings…</p>}

        {!isLoading && bookings?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">No bookings in this category.</p>
          </div>
        )}

        {bookings?.map((b) => (
          <div key={b.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/dashboard/customer/bookings/${b.id}`} data-cursor-hover className="flex-1">
                <p className="font-heading text-sm font-bold text-foreground hover:text-primary">
                  {b.service?.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{b.technician?.user?.name}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(b.bookingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  {b.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {b.address}
                    </span>
                  )}
                </div>
              </Link>
              <BookingStatusBadge status={b.status} />
            </div>

            {(b.status === "PENDING" || (b.status === "ACCEPTED" && !b.payment)) && (
              <div className="mt-4 flex gap-2 border-t border-border pt-4">
                {b.status === "PENDING" && (
                  <Button variant="outline" size="sm" onClick={() => cancelBooking.mutate(b.id)} disabled={cancelBooking.isPending}>
                    Cancel booking
                  </Button>
                )}
                {b.status === "ACCEPTED" && !b.payment && <PayNowButton bookingId={b.id} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}