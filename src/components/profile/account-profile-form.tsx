"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  accountProfileSchema,
  type AccountProfileFormValues,
} from "@/lib/schemas/account-profile";
import { api, ApiError } from "@/lib/api";
import type { User } from "@/types";

export function AccountProfileForm({ user }: { user: User }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountProfileFormValues>({
    resolver: zodResolver(accountProfileSchema),
  });

  useEffect(() => {
    reset({
      name: user.name,
      phone: user.phone ?? "",
      address: user.address ?? "",
      photo: user.photo ?? "",
    });
  }, [user, reset]);

  const updateProfile = useMutation({
    mutationFn: (values: AccountProfileFormValues) =>
      api.patch<User>("/api/auth/me", values),
    onSuccess: (updatedUser) => {
      toast.success("Profile updated");
      queryClient.setQueryData(["session"], updatedUser);
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't update profile",
      ),
  });

  return (
    <form
      onSubmit={handleSubmit((v) => updateProfile.mutate(v))}
      className="space-y-4 rounded-2xl border border-border bg-card p-6 mt-2"
    >
      <p className="font-heading text-sm font-bold text-foreground">
        Account details
      </p>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          Full name
        </label>
        <input
          {...register("name")}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          Email
        </label>
        <input
          value={user.email}
          disabled
          className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground"
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          Email can&apos;t be changed.
        </p>
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

      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          Profile photo URL
        </label>
        <input
          {...register("photo")}
          placeholder="https://…"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <Button type="submit" disabled={updateProfile.isPending} className="mt-4">
        {updateProfile.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin " />
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
}
