"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Booking, BookingStatus } from "@/types";

export function useBookings(status?: BookingStatus | "ALL") {
  const query = status && status !== "ALL" ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["bookings", status ?? "ALL"],
    queryFn: () => api.get<Booking[]>(`/api/bookings${query}`),
  });
}
