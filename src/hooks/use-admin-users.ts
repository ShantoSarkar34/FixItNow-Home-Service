"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/types";

interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}

export function useAdminUsers(filters: UserFilters) {
  const params = new URLSearchParams();
  if (filters.role) params.set("role", filters.role);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();

  return useQuery({
    queryKey: ["admin-users", qs],
    queryFn: () => api.get<User[]>(`/api/admin/users${qs ? `?${qs}` : ""}`),
  });
}
