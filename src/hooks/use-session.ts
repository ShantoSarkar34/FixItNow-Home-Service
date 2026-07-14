"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { User } from "@/types";

export function useSession() {
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  const query = useQuery({
    queryKey: ["session"],
    queryFn: () => api.get<User>("/api/auth/me"),
    retry: false,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
    else if (query.isError) clear();
  }, [query.data, query.isError, setUser, clear]);

  return query;
}
