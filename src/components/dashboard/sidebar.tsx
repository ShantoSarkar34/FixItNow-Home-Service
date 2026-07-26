"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Wrench, LogOut, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { NAV_BY_ROLE } from "@/components/dashboard/nav-config";
import type { UserRole } from "@/types";

export function DashboardSidebar({ role, name }: { role?: UserRole; name?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  const links = role ? NAV_BY_ROLE[role] : [];
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="mb-8 flex items-center justify-between px-4 py-6">
        <Link href="/" data-cursor-hover className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="font-heading text-base font-extrabold tracking-tight text-foreground">
            FixIt<span className="text-primary">Now</span>
          </span>
        </Link>
        <button
          aria-label="Toggle theme"
          data-cursor-hover
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {mounted && resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {name && (
        <div className="mx-4 mb-4 rounded-xl bg-muted/50 px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs capitalize text-muted-foreground">{role?.toLowerCase()}</p>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-4">
        {links.map((link : any) => {
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
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
        className="mx-4 mb-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </aside>
  );
}