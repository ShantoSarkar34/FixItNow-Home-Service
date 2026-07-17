"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { profileSchema, type ProfileFormValues } from "@/lib/schemas/profile";
import { api, ApiError } from "@/lib/api";
import type { User } from "@/types";

export default function CustomerProfilePage() {
  const { data: user, isLoading } = useSession();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (user)
      reset({
        name: user.name,
        phone: user.phone ?? "",
        address: user.address ?? "",
      });
  }, [user, reset]);

  // Assumes PATCH /api/auth/me — no profile-update endpoint is documented
  // in the current API spec. Confirm/add this route on the backend.
  const updateProfile = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      api.patch<User>("/api/auth/me", values),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't update profile",
      ),
  });

  if (isLoading)
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Profile
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your personal details.
      </p>

      <form
        onSubmit={handleSubmit((v) => updateProfile.mutate(v))}
        className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5"
      >
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">
            Full name
          </label>
          <input
            {...register("name")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">
            Email
          </label>
          <input
            value={user?.email ?? ""}
            disabled
            className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">
            Phone
          </label>
          <input
            {...register("phone")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">
            Address
          </label>
          <input
            {...register("address")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </div>
  );
}
