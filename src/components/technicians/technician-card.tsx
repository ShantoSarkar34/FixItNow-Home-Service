import Link from "next/link";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import type { TechnicianProfile } from "@/types";

export function TechnicianCard({ technician }: { technician: TechnicianProfile }) {
  const initials =
    technician.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? "?";

  return (
    <Link
      href={`/technicians/${technician.id}`}
      data-cursor-hover
      data-cursor-text="View"
      className="group flex flex-col rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-brand"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(image:--gradient-brand) text-sm font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="truncate font-heading text-sm font-bold text-foreground">
              {technician.user?.name}
            </p>
            {technician.isVerified && (
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 fill-primary text-primary-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {technician.yearsExperience
              ? `${technician.yearsExperience} yrs experience`
              : "New on FixItNow"}
          </p>
        </div>
      </div>

      {technician.bio && (
        <p className="mt-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{technician.bio}</p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {technician.location}
        </div>
        <div className="flex items-center gap-1 font-semibold text-foreground">
          <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
          {technician.averageRating.toFixed(1)}
          <span className="font-normal text-muted-foreground">({technician.totalReviews})</span>
        </div>
      </div>
    </Link>
  );
}