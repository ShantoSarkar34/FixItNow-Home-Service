"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MapPin, Clock } from "lucide-react";
import { useTechnicianServices } from "@/hooks/use-technician-services";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";

export default function TechnicianServicesPage() {
  const { data: services, isLoading } = useTechnicianServices();
  const queryClient = useQueryClient();

  const deleteService = useMutation({
    mutationFn: (id: number) => api.delete(`/api/technician/services/${id}`),
    onSuccess: () => {
      toast.success("Service deleted");
      queryClient.invalidateQueries({ queryKey: ["technician-services"] });
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 409) {
        toast.error(
          "Can't delete — this service has existing bookings. Deactivate it instead.",
        );
      } else {
        toast.error(
          err instanceof ApiError ? err.message : "Couldn't delete service",
        );
      }
    },
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      api.put(`/api/technician/services/${id}`, { isActive }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["technician-services"] }),
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't update service",
      ),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            My services
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage what you offer to customers.
          </p>
        </div>
        <Link href="/dashboard/technician/services/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add service
          </Button>
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading services…</p>
        )}

        {!isLoading && services?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">
              You haven't added any services yet.
            </p>
            <Link
              href="/dashboard/technician/services/new"
              className="mt-4 inline-block"
            >
              <Button size="sm">Add your first service</Button>
            </Link>
          </div>
        )}

        {services?.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-heading text-sm font-bold text-foreground">
                    {service.title}
                  </p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      service.isActive
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {service.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {service.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {service.duration} min
                  </span>
                  <span className="font-semibold text-foreground">
                    ৳{parseFloat(service.price).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
              <button
                onClick={() =>
                  toggleActive.mutate({
                    id: service.id,
                    isActive: !service.isActive,
                  })
                }
                data-cursor-hover
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                {service.isActive ? "Deactivate" : "Activate"}
              </button>
              <Link
                href={`/dashboard/technician/services/${service.id}/edit`}
                data-cursor-hover
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
              <button
                onClick={() => deleteService.mutate(service.id)}
                data-cursor-hover
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
