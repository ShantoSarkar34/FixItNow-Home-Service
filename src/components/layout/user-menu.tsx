"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { User } from "@/types";
import { Avatar } from "../ui/avatar";

export function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const clear = useAuthStore((s) => s.clear);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const dashboardHref =
    user.role === "CUSTOMER"
      ? "/dashboard/customer"
      : user.role === "TECHNICIAN"
        ? "/dashboard/technician"
        : "/dashboard/admin";

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // clear client state regardless of server response
    }
    clear();
    queryClient.clear();
    toast.success("Logged out");
    setOpen(false);
    router.push("/login");
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        data-cursor-hover
        className="flex items-center gap-2 rounded-full border border-primary/30 bg-card py-1 pl-1 pr-2 transition-colors hover:bg-muted cursor-pointer"
      >
        <div>
          {user.photo ? (
            <Avatar src={user.photo} name="Avater" size={28} />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(image:--gradient-brand) text-[11px] font-bold text-white">
              {initials}
            </span>
          )}
        </div>

        <span className="max-w-25 truncate text-sm font-medium text-foreground">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-primary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-card shadow-brand"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs opacity-80 text-primary">
                {user.email}
              </p>
            </div>
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              data-cursor-hover
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              data-cursor-hover
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
