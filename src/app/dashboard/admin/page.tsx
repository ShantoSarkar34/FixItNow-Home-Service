"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Users, Wrench, CalendarCheck, DollarSign } from "lucide-react";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { useAdminBookings } from "@/hooks/use-admin-bookings";
import { api } from "@/lib/api";
import type { Payment, BookingStatus } from "@/types";

const COLORS = {
  primary: "#0F6E63",
  secondary: "#F2934C",
  success: "#16A34A",
  warning: "#F0A020",
  destructive: "#DC2626",
  muted: "#94A3B8",
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: COLORS.warning,
  ACCEPTED: COLORS.primary,
  IN_PROGRESS: COLORS.secondary,
  COMPLETED: COLORS.success,
  DECLINED: COLORS.destructive,
  CANCELLED: COLORS.muted,
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-4 font-heading text-sm font-bold text-foreground">{title}</p>
      {children}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium text-foreground">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted-foreground">
          {p.name}: <span className="font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data: users } = useAdminUsers({});
  const { data: bookings } = useAdminBookings("ALL");
  const { data: payments } = useQuery({
    queryKey: ["admin-payments-completed"],
    queryFn: () => api.get<Payment[]>("/api/payments?status=COMPLETED"),
  });

  const technicians = users?.filter((u) => u.role === "TECHNICIAN" && u.status === "ACTIVE").length ?? 0;
  const revenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) ?? 0;

  const thisMonthBookings = useMemo(() => {
    if (!bookings) return 0;
    const now = new Date();
    return bookings.filter((b) => {
      const d = new Date(b.bookingDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [bookings]);

  const statusData = useMemo(() => {
    if (!bookings) return [];
    const counts: Partial<Record<BookingStatus, number>> = {};
    bookings.forEach((b) => {
      counts[b.status] = (counts[b.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      name: status.replace("_", " "),
      value: count,
      status: status as BookingStatus,
    }));
  }, [bookings]);

  const roleData = useMemo(() => {
    if (!users) return [];
    const counts = { Customers: 0, Technicians: 0, Admins: 0 };
    users.forEach((u) => {
      if (u.role === "CUSTOMER") counts.Customers += 1;
      else if (u.role === "TECHNICIAN") counts.Technicians += 1;
      else counts.Admins += 1;
    });
    return [
      { name: "Customers", value: counts.Customers },
      { name: "Technicians", value: counts.Technicians },
      { name: "Admins", value: counts.Admins },
    ];
  }, [users]);

  const monthlyBookings = useMemo(() => {
    const months: { key: string; label: string; count: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString("en-US", { month: "short" }),
        count: 0,
      });
    }
    bookings?.forEach((b) => {
      const d = new Date(b.bookingDate);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const match = months.find((m) => m.key === key);
      if (match) match.count += 1;
    });
    return months;
  }, [bookings]);

  const topCategories = useMemo(() => {
    if (!bookings) return [];
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      const name = b.service?.category?.name ?? "Uncategorized";
      counts[name] = (counts[name] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [bookings]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Platform overview
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">A snapshot of everything happening on FixItNow.</p>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">{users?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground">Total users</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10">
            <Wrench className="h-4 w-4 text-secondary" />
          </div>
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">{technicians}</p>
          <p className="text-xs text-muted-foreground">Active technicians</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10">
            <CalendarCheck className="h-4 w-4 text-success" />
          </div>
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">{thisMonthBookings}</p>
          <p className="text-xs text-muted-foreground">Bookings this month</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10">
            <DollarSign className="h-4 w-4 text-warning" />
          </div>
          <p className="mt-3 font-heading text-2xl font-extrabold text-foreground">৳{revenue.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">Revenue collected</p>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ChartCard title="Bookings over the last 6 months">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyBookings}>
              <defs>
                <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "currentColor" }} className="text-muted-foreground" axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "currentColor" }} className="text-muted-foreground" axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                name="Bookings"
                stroke={COLORS.primary}
                strokeWidth={2}
                fill="url(#bookingsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Bookings by status">
          {statusData.length === 0 ? (
            <p className="flex h-65 items-center justify-center text-sm text-muted-foreground">
              No booking data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Users by role">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={roleData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Users" fill={COLORS.primary} radius={[0, 6, 6, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top categories by bookings">
          {topCategories.length === 0 ? (
            <p className="flex h-55 items-center justify-center text-sm text-muted-foreground">
              No booking data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topCategories}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} className="text-muted-foreground" axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Bookings" fill={COLORS.secondary} radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}