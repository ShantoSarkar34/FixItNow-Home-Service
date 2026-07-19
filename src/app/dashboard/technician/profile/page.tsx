"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useTechnicianProfile } from "@/hooks/use-technician-profile";
import { Button } from "@/components/ui/button";
import {
  technicianProfileSchema,
  type TechnicianProfileFormValues,
} from "@/lib/schemas/technician-profile";
import { api, ApiError } from "@/lib/api";
import type { TechnicianProfile } from "@/types";

export default function TechnicianProfilePage() {
  const { data: profile, isLoading, isError } = useTechnicianProfile();
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
      toast.success("Profile saved");
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

  if (isLoading)
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        My profile
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {isError
          ? "Set up your technician profile so customers can find and book you."
          : "Keep your profile up to date to attract more bookings."}
      </p>

      {!isError && completeness < 4 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-xs text-secondary-foreground">
          <Sparkles className="h-4 w-4 shrink-0 text-secondary" />
          Complete every field to appear higher in customer search.
        </div>
      )}

      <form
        onSubmit={handleSubmit((v) => saveProfile.mutate(v))}
        className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5"
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
            "Save profile"
          )}
        </Button>
      </form>
    </div>
  );
}
