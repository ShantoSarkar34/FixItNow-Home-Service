"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Service } from "@/types";

export function useTechnicianServices() {
  return useQuery({
    queryKey: ["technician-services"],
    queryFn: () => api.get<Service[]>("/api/technician/services"),
  });
}
