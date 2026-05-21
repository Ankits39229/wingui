export function AppCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-4">
      <div className="mb-3 h-12 w-12 rounded-xl bg-muted" />
      <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
      <div className="mb-4 h-3 w-1/2 rounded bg-muted" />
      <div className="h-8 w-full rounded-lg bg-muted" />
    </div>
  );
}

export function AppGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <AppCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 animate-pulse space-y-2">
      <div className="h-8 w-48 rounded-lg bg-muted" />
      <div className="h-4 w-72 rounded bg-muted" />
    </div>
  );
}
