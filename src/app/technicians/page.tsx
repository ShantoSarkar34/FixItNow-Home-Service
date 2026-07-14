"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { UserX } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TechnicianFilters } from "@/components/technicians/technician-filters";
import { TechnicianCard } from "@/components/technicians/technician-card";
import { TechnicianCardSkeleton } from "@/components/technicians/technician-card-skeleton";
import { api } from "@/lib/api";
import type { TechnicianProfile } from "@/types";

function TechniciansContent() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const { data: technicians, isLoading, isError } = useQuery({
    queryKey: ["technicians", queryString],
    queryFn: () =>
      api.get<TechnicianProfile[]>(`/api/technicians${queryString ? `?${queryString}` : ""}`),
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Browse</span>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Find a trusted technician
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLoading ? "Loading technicians…" : `${technicians?.length ?? 0} technicians available`}
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <TechnicianFilters />

          <div className="flex-1">
            {isError && (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Couldn't load technicians right now. Please try again shortly.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TechnicianCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isLoading && !isError && technicians?.length === 0 && (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-border p-16 text-center">
                <UserX className="h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  No technicians match your filters
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try adjusting your search or clearing filters.
                </p>
              </div>
            )}

            {!isLoading && !isError && technicians && technicians.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {technicians.map((tech) => (
                  <TechnicianCard key={tech.id} technician={tech} />
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

export default function TechniciansPage() {
  return (
    <Suspense fallback={null}>
      <TechniciansContent />
    </Suspense>
  );
}