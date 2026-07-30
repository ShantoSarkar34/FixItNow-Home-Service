import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, Star, BadgeCheck, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookServiceButton } from "@/components/booking/book-service-button";
import type { Service } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://fixitnow-server.onrender.com";

async function getService(id: string): Promise<Service | null> {
  const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load service");
  const json = await res.json();
  return json.data as Service;
}

async function getRelatedServices(
  categoryId: number,
  excludeId: number,
): Promise<Service[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/services?categoryId=${categoryId}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data as Service[]).filter((s) => s.id !== excludeId).slice(0, 3);
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) notFound();

  const related = await getRelatedServices(service.categoryId, service.id);
  const price = parseFloat(service.price);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-32 lg:px-8">
        {service.category && (
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            {service.category.name}
          </span>
        )}

        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {service.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {service.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {service.duration} min
              </span>
            </div>
          </div>
          <p className="font-heading text-3xl font-extrabold text-primary">
            ৳{price.toFixed(0)}
          </p>
        </div>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-foreground">
          {service.description}
        </p>

        <div className="mt-8">
          <BookServiceButton service={service} />
        </div>

        {service.technician && (
          <Link
            href={`/technicians/${service.technician.id}`}
            data-cursor-hover
            className="mt-10 flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-brand"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(image:--gradient-brand) text-sm font-bold text-white">
              {service.technician.user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") ?? "?"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="font-heading text-sm font-bold text-foreground">
                  {service.technician.user?.name}
                </p>
                {service.technician.isVerified && (
                  <BadgeCheck className="h-4 w-4 fill-primary text-primary-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {service.technician.location}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              {service.technician.averageRating.toFixed(1)}
              <span className="font-normal text-muted-foreground">
                ({service.technician.totalReviews})
              </span>
            </div>
          </Link>
        )}

        {related.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Related services
              </h2>
              <Link
                href={`/services?categoryId=${service.categoryId}`}
                data-cursor-hover
                className="group flex items-center gap-1 text-sm font-semibold text-primary"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((s) => (
                <Link
                  key={s.id}
                  href={`/services/${s.id}`}
                  data-cursor-hover
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-brand"
                >
                  <p className="line-clamp-1 font-heading text-sm font-bold text-foreground">
                    {s.title}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {s.location}
                  </p>
                  <p className="mt-2 font-heading text-sm font-bold text-primary">
                    ৳{parseFloat(s.price).toFixed(0)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
