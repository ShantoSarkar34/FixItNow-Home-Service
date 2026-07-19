"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TechnicianProfile } from "@/types";

export function useTechnicianProfile() {
  return useQuery({
    queryKey: ["technician-profile"],
    queryFn: () => api.get<TechnicianProfile>("/api/technician/profile"),
    retry: false,
  });
}
