"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Loader2, FolderKanban } from "lucide-react";
import { useAdminCategories } from "@/hooks/use-admin-categories";
import { Button } from "@/components/ui/button";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/schemas/category";
import { api, ApiError } from "@/lib/api";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  const createCategory = useMutation({
    mutationFn: (values: CategoryFormValues) =>
      api.post("/api/admin/categories", values),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      reset();
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't create category",
      ),
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Categories
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the service categories available on FixItNow.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-card">
          {isLoading && (
            <p className="p-5 text-sm text-muted-foreground">
              Loading categories…
            </p>
          )}
          {!isLoading && categories?.length === 0 && (
            <p className="p-5 text-sm text-muted-foreground">
              No categories yet.
            </p>
          )}
          <div className="divide-y divide-border">
            {categories?.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {c.name}
                  </p>
                  {c.description && (
                    <p className="text-xs text-muted-foreground">
                      {c.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit((v) => createCategory.mutate(v))}
          className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5"
        >
          <p className="font-heading text-sm font-bold text-foreground">
            Add category
          </p>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              Name
            </label>
            <input
              {...register("name")}
              placeholder="Gardening"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              Description (optional)
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={createCategory.isPending}
          >
            {createCategory.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add category
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
