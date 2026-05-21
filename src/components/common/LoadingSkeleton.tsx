export function AppCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4">
      <div className="mb-3 h-12 w-12 rounded-xl skeleton-shimmer" />
      <div className="mb-2 h-4 w-3/4 rounded-lg skeleton-shimmer" />
      <div className="mb-4 h-3 w-1/2 rounded-lg skeleton-shimmer" />
      <div className="h-8 w-full rounded-xl skeleton-shimmer" />
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
    <div className="mb-6 space-y-2">
      <div className="h-8 w-48 rounded-xl skeleton-shimmer" />
      <div className="h-4 w-72 max-w-full rounded-lg skeleton-shimmer" />
    </div>
  );
}
