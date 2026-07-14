import Link from "next/link";
import { MapPin, Star, Clock } from "lucide-react";
import type { Service } from "@/types";

export function ServiceCard({ service }: { service: Service }) {
  const price = parseFloat(service.price);

  return (
    <Link
      href={`/services/${service.id}`}
      data-cursor-hover
      className="group flex flex-col rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {service.category && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground">
              {service.category.name}
            </span>
          )}
          <h3 className="mt-2.5 line-clamp-1 font-heading text-base font-bold text-foreground">
            {service.title}
          </h3>
        </div>
        <p className="shrink-0 font-heading text-lg font-bold text-primary">
          ৳{price.toFixed(0)}
        </p>
      </div>

      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {service.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {service.location}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {service.duration} min
        </div>
        {service.technician && (
          <div className="ml-auto flex items-center gap-1 font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
            {service.technician.averageRating.toFixed(1)}
          </div>
        )}
      </div>
    </Link>
  );
}
