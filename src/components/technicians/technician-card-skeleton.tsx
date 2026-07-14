export function TechnicianCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-2xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 h-3 w-full rounded bg-muted" />
      <div className="mt-2 h-3 w-3/4 rounded bg-muted" />
    </div>
  );
}