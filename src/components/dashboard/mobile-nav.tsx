"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Menu, X, Wrench, LogOut, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { NAV_BY_ROLE } from "@/components/dashboard/nav-config";
import type { UserRole } from "@/types";

export function DashboardMobileNav({ role, name }: { role?: UserRole; name?: string }) {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Link href="/" data-cursor-hover className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="font-heading text-sm font-extrabold tracking-tight text-foreground">
            FixIt<span className="text-primary">Now</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            data-cursor-hover
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {mounted && resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            aria-label="Open menu"
            data-cursor-hover
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-border bg-card px-4 py-6"
            >
              <div className="mb-6 flex items-center justify-between px-2">
                <Link href="/" data-cursor-hover className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Wrench className="h-4 w-4" strokeWidth={2.25} />
                  </span>
                  <span className="font-heading text-base font-extrabold tracking-tight text-foreground">
                    FixIt<span className="text-primary">Now</span>
                  </span>
                </Link>
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Toggle theme"
                    data-cursor-hover
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                  >
                    {mounted && resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                  <button
                    aria-label="Close menu"
                    data-cursor-hover
                    onClick={() => setOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {name && (
                <div className="mb-4 rounded-xl bg-muted/50 px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs capitalize text-muted-foreground">{role?.toLowerCase()}</p>
                </div>
              )}

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {links.map((link : any) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
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
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}