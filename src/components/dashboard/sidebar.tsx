"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LayoutDashboard,
  CalendarCheck,
  UserCircle,
  Wrench,
  LogOut,
  Briefcase,
  Clock,
  Users,
  FolderKanban,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types";

const NAV_BY_ROLE: Record<
  UserRole,
  { href: string; label: string; icon: typeof LayoutDashboard }[]
> = {
  CUSTOMER: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/customer/bookings",
      label: "My bookings",
      icon: CalendarCheck,
    },
    { href: "/dashboard/customer/profile", label: "Profile", icon: UserCircle },
  ],
  TECHNICIAN: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/technician/profile",
      label: "My profile",
      icon: UserCircle,
    },
    {
      href: "/dashboard/technician/services",
      label: "My services",
      icon: Briefcase,
    },
    {
      href: "/dashboard/technician/availability",
      label: "Availability",
      icon: Clock,
    },
    {
      href: "/dashboard/technician/bookings",
      label: "Bookings",
      icon: CalendarCheck,
    },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    {
      href: "/dashboard/admin/categories",
      label: "Categories",
      icon: FolderKanban,
    },
    {
      href: "/dashboard/admin/bookings",
      label: "All bookings",
      icon: ListChecks,
    },
  ],
};

export function DashboardSidebar({
  role,
  name,
}: {
  role?: UserRole;
  name?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  const links = role ? NAV_BY_ROLE[role] : [];

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // clear local state regardless of server response
    }
    clear();
    queryClient.clear();
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
      <Link
        href="/"
        data-cursor-hover
        className="mb-8 flex items-center gap-2.5 px-2"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wrench className="h-4 w-4" strokeWidth={2.25} />
        </span>
        <span className="font-heading text-base font-extrabold tracking-tight text-foreground">
          FixIt<span className="text-primary">Now</span>
        </span>
      </Link>

      {name && (
        <div className="mb-4 rounded-xl bg-muted/50 px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>
          <p className="text-xs capitalize text-muted-foreground">
            {role?.toLowerCase()}
          </p>
        </div>
      )}

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              data-cursor-hover
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        data-cursor-hover
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </aside>
  );
}
