"use client";

import Link from "next/link";
import { Briefcase, Clock, Star, CheckCircle2, ArrowRight } from "lucide-react";
import { useTechnicianServices } from "@/hooks/use-technician-services";
import { useTechnicianProfile } from "@/hooks/use-technician-profile";
import { useBookings } from "@/hooks/use-bookings";
import { BookingStatusBadge } from "@/components/ui/status-badge";
import { useAuthStore } from "@/store/auth-store";

export default function TechnicianOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: services } = useTechnicianServices();
  const { data: profile } = useTechnicianProfile();
  const { data: pendingBookings, isLoading } = useBookings("PENDING");
  const { data: allBookings } = useBookings("ALL");

  const completedThisMonth =
    allBookings?.filter((b) => {
      if (b.status !== "COMPLETED") return false;
      const d = new Date(b.bookingDate);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length ?? 0;

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here's your business at a glance.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <Briefcase className="h-5 w-5 text-primary" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {services?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Active services</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <Clock className="h-5 w-5 text-warning" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {pendingBookings?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Pending requests</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <Star className="h-5 w-5 text-secondary" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {profile?.averageRating?.toFixed(1) ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">Average rating</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {completedThisMonth}
          </p>
          <p className="text-xs text-muted-foreground">Completed this month</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-heading text-sm font-bold text-foreground">
            Incoming requests
          </p>
          <Link
            href="/dashboard/technician/bookings"
            data-cursor-hover
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && pendingBookings?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No pending requests right now.
          </p>
        )}
        <div className="space-y-3">
          {pendingBookings?.slice(0, 5).map((b) => (
            <Link
              key={b.id}
              href={`/dashboard/technician/bookings/${b.id}`}
              data-cursor-hover
              className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {b.service?.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {b.customer?.name}
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
