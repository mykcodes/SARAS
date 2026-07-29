function Skeleton({ className = "", style = {} }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface p-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-5 w-5 rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" style={{ borderRadius: 4 }} />
        <Skeleton className="h-3 w-1/2" style={{ borderRadius: 4 }} />
      </div>
      <Skeleton className="mt-1 h-3 w-full" style={{ borderRadius: 4 }} />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border-subtle bg-surface px-4 py-3">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-4 flex-1" style={{ borderRadius: 4 }} />
      <Skeleton className="h-3 w-16" style={{ borderRadius: 4 }} />
      <Skeleton className="h-3 w-12" style={{ borderRadius: 4 }} />
      <Skeleton className="h-3 w-20" style={{ borderRadius: 4 }} />
    </div>
  );
}

function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: i === lines - 1 ? "60%" : "100%", borderRadius: 4 }}
        />
      ))}
    </div>
  );
}

function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

Skeleton.Card = SkeletonCard;
Skeleton.Row = SkeletonRow;
Skeleton.Text = SkeletonText;
Skeleton.Grid = SkeletonGrid;

export default Skeleton;
