"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Booking } from "@/types";

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => api.get<Booking>(`/api/bookings/${id}`),
    retry: false,
  });
}