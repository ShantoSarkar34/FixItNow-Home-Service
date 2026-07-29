"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Payment, PaymentStatus } from "@/types";

export function usePayments(status?: PaymentStatus | "ALL") {
  const qs = status && status !== "ALL" ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["payments", status ?? "ALL"],
    queryFn: () => api.get<Payment[]>(`/api/payments${qs}`),
  });
}