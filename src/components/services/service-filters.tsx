"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { useCategories } from "@/hook/categories";

export function ServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: categories } = useCategories();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") ?? "",
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (categoryId) params.set("categoryId", categoryId);
    router.push(`${pathname}?${params.toString()}`);
    setMobileOpen(false);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setCategoryId("");
    router.push(pathname);
    setMobileOpen(false);
  };

  const hasActiveFilters = !!(
    search ||
    location ||
    minPrice ||
    maxPrice ||
    categoryId
  );

  const Fields = (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          Search
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="e.g. ceiling fan install"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All categories</option>
          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          Location
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Bogra"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          Price range (৳)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          data-cursor-hover
          className="flex-1 rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Apply filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            data-cursor-hover
            className="rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <p className="font-heading text-sm font-bold text-foreground">
              Filters
            </p>
          </div>
          {Fields}
        </div>
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        data-cursor-hover
        className="mb-4 flex items-center gap-2 self-start rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
        )}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-90 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-xs overflow-y-auto bg-card p-5 shadow-brand">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-heading text-sm font-bold text-foreground">
                Filters
              </p>
              <button onClick={() => setMobileOpen(false)} data-cursor-hover>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            {Fields}
          </div>
        </div>
      )}
    </>
  );
}
