export function AppDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back link skeleton */}
      <div className="h-4 w-32 rounded-lg skeleton-shimmer" />
      {/* Hero section skeleton */}
      <div className="flex gap-6 rounded-2xl border border-border bg-card p-6">
        <div className="h-20 w-20 shrink-0 rounded-2xl skeleton-shimmer" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-64 rounded-xl skeleton-shimmer" />
          <div className="h-4 w-40 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-28 rounded-lg skeleton-shimmer" />
          <div className="mt-5 flex gap-2">
            <div className="h-9 w-28 rounded-xl skeleton-shimmer" />
            <div className="h-9 w-28 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </div>
      {/* Description skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <div className="h-4 w-24 rounded-lg skeleton-shimmer" />
        <div className="h-3 w-full rounded-lg skeleton-shimmer" />
        <div className="h-3 w-4/5 rounded-lg skeleton-shimmer" />
        <div className="h-3 w-3/5 rounded-lg skeleton-shimmer" />
      </div>
      {/* Tags skeleton */}
      <div className="flex gap-2">
        <div className="h-7 w-16 rounded-full skeleton-shimmer" />
        <div className="h-7 w-20 rounded-full skeleton-shimmer" />
        <div className="h-7 w-14 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}
