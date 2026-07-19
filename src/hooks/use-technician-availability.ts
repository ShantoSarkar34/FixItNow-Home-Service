"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Availability } from "@/types";

export function useTechnicianAvailability() {
  return useQuery({
    queryKey: ["technician-availability"],
    queryFn: () => api.get<Availability[]>("/api/technician/availability"),
  });
}
