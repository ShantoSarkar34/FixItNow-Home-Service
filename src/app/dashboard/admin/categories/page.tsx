"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Loader2, FolderKanban, Pencil, Trash2, X } from "lucide-react";
import { useAdminCategories } from "@/hooks/use-admin-categories";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/schemas/category";
import { api, ApiError } from "@/lib/api";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        description: editingCategory.description ?? "",
      });
    } else {
      reset({ name: "", description: "" });
    }
  }, [editingCategory, reset]);

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] }); // public filter dropdowns
  };

  const createCategory = useMutation({
    mutationFn: (values: CategoryFormValues) =>
      api.post("/api/admin/categories", values),
    onSuccess: () => {
      toast.success("Category created");
      invalidateCategories();
      reset({ name: "", description: "" });
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't create category",
      ),
  });

  const updateCategory = useMutation({
    mutationFn: (values: CategoryFormValues) =>
      api.put(`/api/admin/categories/${editingCategory!.id}`, values),
    onSuccess: () => {
      toast.success("Category updated");
      invalidateCategories();
      setEditingCategory(null);
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't update category",
      ),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/categories/${id}`),
    onSuccess: () => {
      toast.success("Category deleted");
      invalidateCategories();
      setDeletingCategory(null);
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't delete category",
      );
      setDeletingCategory(null);
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory.mutate(values);
    } else {
      createCategory.mutate(values);
    }
  };

  const isSaving = createCategory.isPending || updateCategory.isPending;

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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {c.name}
                  </p>
                  {c.description && (
                    <p className="truncate text-xs text-muted-foreground">
                      {c.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => setEditingCategory(c)}
                    data-cursor-hover
                    aria-label="Edit category"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingCategory(c)}
                    data-cursor-hover
                    aria-label="Delete category"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <p className="font-heading text-sm font-bold text-foreground">
              {editingCategory ? "Edit category" : "Add category"}
            </p>
            {editingCategory && (
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                data-cursor-hover
                aria-label="Cancel edit"
                className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
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
          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editingCategory ? (
              "Save changes"
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add category
              </>
            )}
          </Button>
        </form>
      </div>

      <Dialog
        open={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Delete category"
      >
        {deletingCategory && (
          <div>
            <p className="text-sm text-foreground">
              Delete{" "}
              <span className="font-semibold">{deletingCategory.name}</span>?
              This can't be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeletingCategory(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => deleteCategory.mutate(deletingCategory.id)}
                disabled={deleteCategory.isPending}
              >
                {deleteCategory.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
