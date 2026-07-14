export function ServiceCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-border bg-card p-5">
      <div className="h-4 w-20 rounded-full bg-muted" />
      <div className="mt-3 h-5 w-3/4 rounded bg-muted" />
      <div className="mt-3 h-3 w-full rounded bg-muted" />
      <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
      <div className="mt-6 h-3 w-full rounded bg-muted" />
    </div>
  );
}
