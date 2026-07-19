"use client";

import { useState } from "react";
import { useAdminBookings } from "@/hooks/use-admin-bookings";
import { BookingStatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

const TABS: { value: BookingStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DECLINED", label: "Declined" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminBookingsPage() {
  const [tab, setTab] = useState<BookingStatus | "ALL">("ALL");
  const { data: bookings, isLoading } = useAdminBookings(tab);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">All bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Platform-wide view, read-only.</p>

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

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Technician</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  Loading bookings…
                </td>
              </tr>
            )}
            {!isLoading && bookings?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  No bookings in this category.
                </td>
              </tr>
            )}
            {bookings?.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{b.service?.title}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.customer?.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.technician?.user?.name}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(b.bookingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
                <td className="px-5 py-3">
                  <BookingStatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}