"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/categories";
import { serviceSchema, type ServiceFormValues } from "@/lib/schemas/service";
import { api, ApiError } from "@/lib/api";
import type { Service } from "@/types";

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          categoryId: service.categoryId,
          title: service.title,
          description: service.description,
          price: parseFloat(service.price),
          duration: service.duration,
          location: service.location,
          isActive: service.isActive,
        }
      : { isActive: true },
  });

  const mutation = useMutation({
    mutationFn: (values: ServiceFormValues) =>
      service
        ? api.put<Service>(`/api/technician/services/${service.id}`, values)
        : api.post<Service>("/api/technician/services", values),
    onSuccess: () => {
      toast.success(service ? "Service updated" : "Service created");
      queryClient.invalidateQueries({ queryKey: ["technician-services"] });
      router.push("/dashboard/technician/services");
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't save service",
      ),
  });

  return (
    <form
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
      className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-5"
    >
      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          Category
        </label>
        <select
          {...register("categoryId", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a category</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-xs text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          Title
        </label>
        <input
          {...register("title")}
          placeholder="Ceiling fan installation"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe what's included in this service…"
          className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">
            Price (৳)
          </label>
          <input
            type="number"
            {...register("price", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            placeholder="500"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-destructive">
              {errors.price.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">
            Duration (min)
          </label>
          <input
            type="number"
            {...register("duration", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            placeholder="60"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.duration && (
            <p className="mt-1 text-xs text-destructive">
              {errors.duration.message}
            </p>
          )}
        </div>
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

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 rounded border-border"
        />
        Active (visible to customers)
      </label>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : service ? (
          "Save changes"
        ) : (
          "Create service"
        )}
      </Button>
    </form>
  );
}
