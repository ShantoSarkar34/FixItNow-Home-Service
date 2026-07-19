"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { useBookings } from "@/hooks/use-bookings";
import { BookingStatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";
import { TechnicianBookingActions } from "../../../../components/technicians/booking-actions";

const TABS: { value: BookingStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DECLINED", label: "Declined" },
];

export default function TechnicianBookingsPage() {
  const [tab, setTab] = useState<BookingStatus | "ALL">("PENDING");
  const { data: bookings, isLoading } = useBookings(tab);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Incoming bookings
      </h1>

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
                : "border-border bg-card text-foreground hover:border-primary/50",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading bookings…</p>
        )}

        {!isLoading && bookings?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No bookings in this category.
            </p>
          </div>
        )}

        {bookings?.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/dashboard/technician/bookings/${b.id}`}
                data-cursor-hover
                className="flex-1"
              >
                <p className="font-heading text-sm font-bold text-foreground hover:text-primary">
                  {b.service?.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {b.customer?.name}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(b.bookingDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
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

            <div className="mt-4 border-t border-border pt-4">
              <TechnicianBookingActions booking={b} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
