"use client";

import Link from "next/link";
import { CalendarCheck, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { BookingStatusBadge } from "@/components/ui/status-badge";
import { useAuthStore } from "@/store/auth-store";
import { useBookings } from "@/hooks/use-bookings";

export default function CustomerOverviewPage() {
  const { data: bookings, isLoading } = useBookings("ALL");
  const user = useAuthStore((s) => s.user);

  const active =
    bookings?.filter((b) =>
      ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(b.status),
    ).length ?? 0;
  const completed =
    bookings?.filter((b) => b.status === "COMPLETED").length ?? 0;
  const recent = bookings?.slice(0, 5) ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here's what's happening with your bookings.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <CalendarCheck className="h-5 w-5 text-primary" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {active}
          </p>
          <p className="text-xs text-muted-foreground">Active bookings</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {completed}
          </p>
          <p className="text-xs text-muted-foreground">Completed jobs</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <Clock className="h-5 w-5 text-secondary" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {bookings?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Total bookings</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-heading text-sm font-bold text-foreground">
            Recent bookings
          </p>
          <Link
            href="/dashboard/customer/bookings"
            data-cursor-hover
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && recent.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No bookings yet — go browse some services!
          </p>
        )}
        <div className="space-y-3">
          {recent.map((b) => (
            <Link
              key={b.id}
              href={`/dashboard/customer/bookings/${b.id}`}
              data-cursor-hover
              className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {b.service?.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {b.technician?.user?.name}
                </p>
              </div>
              <BookingStatusBadge status={b.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
