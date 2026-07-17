import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, BadgeCheck, Briefcase } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import type { TechnicianProfile, Review } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://fixit-server.vercel.app";

async function getTechnician(id: string): Promise<TechnicianProfile | null> {
  const res = await fetch(`${API_BASE_URL}/api/technicians/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load technician");
  const json = await res.json();
  return json.data as TechnicianProfile;
}

async function getReviews(technicianId: string): Promise<(Review & { customer?: { name: string } })[]> {
  const res = await fetch(`${API_BASE_URL}/api/reviews?technicianId=${technicianId}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export default async function TechnicianDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const technician = await getTechnician(id);

  if (!technician) notFound();

  const reviews = await getReviews(id);
  const initials =
    technician.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? "?";
  const availableSlots = (technician.availability ?? []).filter((a) => a.status === "AVAILABLE");

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32 lg:px-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-(image:--gradient-brand) text-xl font-bold text-white">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {technician.user?.name}
              </h1>
              {technician.isVerified && (
                <BadgeCheck className="h-5 w-5 fill-primary text-primary-foreground" />
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {technician.location}
              </span>
              {technician.yearsExperience != null && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {technician.yearsExperience} yrs experience
                </span>
              )}
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                {technician.averageRating.toFixed(1)}
                <span className="font-normal text-muted-foreground">
                  ({technician.totalReviews} reviews)
                </span>
              </span>
            </div>
          </div>
        </div>

        {technician.bio && (
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-foreground">{technician.bio}</p>
        )}

        <div className="mt-12">
          <h2 className="font-heading text-xl font-bold text-foreground">Services offered</h2>
          {technician.services && technician.services.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {technician.services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  data-cursor-hover
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-brand"
                >
                  <p className="font-heading text-sm font-bold text-foreground">{service.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {service.description}
                  </p>
                  <p className="mt-2 font-heading text-sm font-bold text-primary">
                    ৳{parseFloat(service.price).toFixed(0)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No services listed yet.</p>
          )}
        </div>

        <div className="mt-12">
          <h2 className="font-heading text-xl font-bold text-foreground">Availability</h2>
          {availableSlots.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {availableSlots.slice(0, 8).map((slot) => (
                <span
                  key={slot.id}
                  className="rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground"
                >
                  {new Date(slot.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} ·{" "}
                  {slot.startTime}–{slot.endTime}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No open slots right now.</p>
          )}
        </div>

        <div className="mt-12">
          <h2 className="font-heading text-xl font-bold text-foreground">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {review.customer?.name ?? "Verified customer"}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < review.rating
                              ? "h-3.5 w-3.5 fill-secondary text-secondary"
                              : "h-3.5 w-3.5 fill-muted text-muted"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No reviews yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}