import { TechnicianCardSkeleton } from "@/components/technicians/technician-card-skeleton";

export default function TechniciansLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8">
      <div className="mb-10 h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TechnicianCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}