function StorageCard({ used, total, unit }) {
  const percent = Math.min(100, Math.round((used / total) * 100));

  return (
    <div className="px-1">
      <p className="mb-2 text-[11.5px] text-ink-soft">
        {used} {unit} of {total} {unit} used
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
        <div
          className="h-full rounded-full gold-gradient-bg"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default StorageCard;
