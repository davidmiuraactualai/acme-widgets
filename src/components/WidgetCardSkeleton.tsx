export default function WidgetCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-ink/10 bg-paper overflow-hidden"
    >
      <div className="h-[180px] bg-ink/5 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-ink/5 animate-pulse rounded" />
        <div className="h-3 bg-ink/5 animate-pulse rounded w-5/6" />
        <div className="h-3 bg-ink/5 animate-pulse rounded w-3/4" />
      </div>
    </div>
  );
}
