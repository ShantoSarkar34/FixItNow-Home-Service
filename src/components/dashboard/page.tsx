"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/use-session";

export default function DashboardIndex() {
  const router = useRouter();
  const { data: user, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === "CUSTOMER") router.replace("/dashboard/customer");
    else if (user.role === "TECHNICIAN")
      router.replace("/dashboard/technician");
    else if (user.role === "ADMIN") router.replace("/dashboard/admin");
  }, [user, isLoading, router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
