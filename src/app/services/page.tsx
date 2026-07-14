"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ServiceFilters } from "@/components/services/service-filters";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceCardSkeleton } from "@/components/services/service-card-skeleton";
import { api } from "@/lib/api";
import type { Service } from "@/types";

function ServicesContent() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services", queryString],
    queryFn: () =>
      api.get<Service[]>(
        `/api/services${queryString ? `?${queryString}` : ""}`,
      ),
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Browse
          </span>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Find the right service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLoading
              ? "Loading services…"
              : `${services?.length ?? 0} services available`}
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <ServiceFilters />

          <div className="flex-1">
            {isError && (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Couldn't load services right now. Please try again shortly.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ServiceCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isLoading && !isError && services?.length === 0 && (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-border p-16 text-center">
                <SearchX className="h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  No services match your filters
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try adjusting your search or clearing filters.
                </p>
              </div>
            )}

            {!isLoading && !isError && services && services.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={null}>
      <ServicesContent />
    </Suspense>
  );
}
