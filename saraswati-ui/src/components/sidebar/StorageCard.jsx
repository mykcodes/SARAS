function StorageCard({ used, total, unit, isCollapsed }) {
  const percent = Math.min(100, Math.round((used / total) * 100));

  return (
    <div className="px-1" title={isCollapsed ? `${used} ${unit} of ${total} ${unit} used` : undefined}>
      {!isCollapsed && (
        <p className="mb-2 text-[11.5px] text-ink-soft whitespace-nowrap">
          {used} {unit} of {total} {unit} used
        </p>
      )}
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
