"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Booking, BookingStatus } from "@/types";

export function useAdminBookings(status?: BookingStatus | "ALL") {
  const qs = status && status !== "ALL" ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["admin-bookings", status ?? "ALL"],
    queryFn: () => api.get<Booking[]>(`/api/admin/bookings${qs}`),
  });
}
