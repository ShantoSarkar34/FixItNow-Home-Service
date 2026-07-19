"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Wrench, CalendarCheck, DollarSign } from "lucide-react";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { useAdminBookings } from "@/hooks/use-admin-bookings";
import { api } from "@/lib/api";
import type { Payment } from "@/types";

export default function AdminOverviewPage() {
  const { data: users } = useAdminUsers({});
  const { data: bookings } = useAdminBookings("ALL");
  const { data: payments } = useQuery({
    queryKey: ["admin-payments-completed"],
    queryFn: () => api.get<Payment[]>("/api/payments?status=COMPLETED"),
  });

  const technicians =
    users?.filter((u) => u.role === "TECHNICIAN" && u.status === "ACTIVE")
      .length ?? 0;
  const thisMonthBookings =
    bookings?.filter((b) => {
      const d = new Date(b.bookingDate);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length ?? 0;
  const revenue =
    payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) ?? 0;

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Platform overview
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A snapshot of everything happening on FixItNow.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <Users className="h-5 w-5 text-primary" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {users?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Total users</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <Wrench className="h-5 w-5 text-secondary" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {technicians}
          </p>
          <p className="text-xs text-muted-foreground">Active technicians</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <CalendarCheck className="h-5 w-5 text-success" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            {thisMonthBookings}
          </p>
          <p className="text-xs text-muted-foreground">Bookings this month</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <DollarSign className="h-5 w-5 text-warning" />
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">
            ৳{revenue.toFixed(0)}
          </p>
          <p className="text-xs text-muted-foreground">Revenue collected</p>
        </div>
      </div>
    </div>
  );
}
