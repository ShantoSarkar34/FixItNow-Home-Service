"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ServiceForm } from "@/components/technicians/service-form";
import { api } from "@/lib/api";
import type { Service } from "@/types";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => api.get<Service>(`/api/services/${id}`),
  });

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  if (!service) return <p className="text-sm text-muted-foreground">Service not found.</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Edit service</h1>
      <p className="mt-1 text-sm text-muted-foreground">Update details for &quot;{service.title}&quot;.</p>
      <div className="mt-6">
        <ServiceForm service={service} />
      </div>
    </div>
  );
}