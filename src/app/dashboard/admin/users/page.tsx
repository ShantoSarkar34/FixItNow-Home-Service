"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, ShieldBan, ShieldCheck } from "lucide-react";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import type { User, UserRole, UserStatus } from "@/types";

const ROLE_TABS: { value: UserRole | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "CUSTOMER", label: "Customers" },
  { value: "TECHNICIAN", label: "Technicians" },
  { value: "ADMIN", label: "Admins" },
];

export default function AdminUsersPage() {
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useAdminUsers({
    role: role === "ALL" ? undefined : role,
    search: search || undefined,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: UserStatus }) =>
      api.patch(`/api/admin/users/${id}`, { status }),
    onSuccess: () => {
      toast.success("User updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmUser(null);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Couldn't update user"),
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage customers, technicians, and admins.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {ROLE_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setRole(t.value)}
              data-cursor-hover
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors",
                role === t.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 sm:w-64">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  Loading users…
                </td>
              </tr>
            )}
            {!isLoading && users?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  No users match your filters.
                </td>
              </tr>
            )}
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{u.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      u.status === "ACTIVE" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {u.role !== "ADMIN" && (
                    <button
                      onClick={() => setConfirmUser(u)}
                      data-cursor-hover
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                        u.status === "ACTIVE"
                          ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                          : "border-success/30 text-success hover:bg-success/10"
                      )}
                    >
                      {u.status === "ACTIVE" ? (
                        <>
                          <ShieldBan className="h-3.5 w-3.5" /> Ban
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" /> Unban
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!confirmUser} onClose={() => setConfirmUser(null)} title="Confirm action">
        {confirmUser && (
          <div>
            <p className="text-sm text-foreground">
              {confirmUser.status === "ACTIVE" ? "Ban" : "Unban"}{" "}
              <span className="font-semibold">{confirmUser.name}</span>?
              {confirmUser.status === "ACTIVE" && " They will lose access to their account immediately."}
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmUser(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() =>
                  updateStatus.mutate({
                    id: confirmUser.id,
                    status: confirmUser.status === "ACTIVE" ? "BANNED" : "ACTIVE",
                  })
                }
                disabled={updateStatus.isPending}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}