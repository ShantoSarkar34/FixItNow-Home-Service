"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { useTechnicianProfile } from "@/hooks/use-technician-profile";
import { ProfileHeader } from "@/components/profile/profile-header";
import { AccountProfileForm } from "@/components/profile/account-profile-form";
import { Button } from "@/components/ui/button";
import {
  technicianProfileSchema,
  type TechnicianProfileFormValues,
} from "@/lib/schemas/technician-profile";
import { api, ApiError } from "@/lib/api";
import type { TechnicianProfile } from "@/types";

export default function TechnicianProfilePage() {
  const { data: user, isLoading: sessionLoading } = useSession();
  const {
    data: profile,
    isLoading: profileLoading,
    isError,
  } = useTechnicianProfile();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TechnicianProfileFormValues>({
    resolver: zodResolver(technicianProfileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.bio ?? "",
        experience: profile.experience ?? "",
        yearsExperience: profile.yearsExperience ?? undefined,
        location: profile.location ?? "",
      });
    }
  }, [profile, reset]);

  const saveProfile = useMutation({
    mutationFn: (values: TechnicianProfileFormValues) =>
      api.put<TechnicianProfile>("/api/technician/profile", values),
    onSuccess: () => {
      toast.success("Business profile saved");
      queryClient.invalidateQueries({ queryKey: ["technician-profile"] });
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't save profile",
      ),
  });

  const completeness = profile
    ? [
        profile.bio,
        profile.experience,
        profile.yearsExperience,
        profile.location,
      ].filter(Boolean).length
    : 0;

  if (sessionLoading || !user || profileLoading) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  }

  return (
    <div className="max-w-full space-y-6">
      <ProfileHeader name={user.name} role={user.role} photo={user.photo} />

      <AccountProfileForm user={user} />

      <div>
        <p className="mb-1 font-heading text-lg font-extrabold text-foreground">
          Business profile
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          {isError
            ? "Set up your technician profile so customers can find and book you."
            : "Shown on your public technician page — keep it up to date to attract more bookings."}
        </p>

        {!isError && completeness < 4 && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-xs text-secondary-foreground">
            <Sparkles className="h-4 w-4 shrink-0 text-secondary" />
            Complete every field to appear higher in customer search.
          </div>
        )}

        <form
          onSubmit={handleSubmit((v) => saveProfile.mutate(v))}
          className="space-y-4 rounded-2xl border border-border bg-card p-5"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              Bio
            </label>
            <textarea
              {...register("bio")}
              rows={4}
              placeholder="Tell customers about your experience and specialties…"
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.bio && (
              <p className="mt-1 text-xs text-destructive">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              Experience
            </label>
            <input
              {...register("experience")}
              placeholder="e.g. Certified electrician, ex-Grameen Electric"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Years of experience
              </label>
              <input
                type="number"
                {...register("yearsExperience", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
                placeholder="5"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Location
              </label>
              <input
                {...register("location")}
                placeholder="Bogra"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.location && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save business profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
