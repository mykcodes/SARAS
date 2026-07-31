function StorageCard({ used, usedUnit, total, totalUnit, isCollapsed }) {
  // Use a constant 5 GB for the calculation if total represents 5GB (5 * 1024 * 1024 bytes)
  // Since total is always passed as 5, we need to handle the percentage differently.
  // Wait, the storage API might send large byte numbers, so let's parse units.
  let usedBytes = used;
  if (usedUnit === "MB") usedBytes *= (1024 * 1024);
  else if (usedUnit === "GB") usedBytes *= (1024 * 1024 * 1024);
  
  let totalBytes = total;
  if (totalUnit === "GB") totalBytes *= (1024 * 1024 * 1024);

  const percent = totalBytes > 0 ? Math.min(100, Math.round((usedBytes / totalBytes) * 100)) : 0;

  return (
    <div className="px-1" title={isCollapsed ? `${used} ${usedUnit} of ${total} ${totalUnit} used` : undefined}>
      {!isCollapsed && (
        <p className="mb-2 text-[11.5px] text-ink-soft whitespace-nowrap">
          {used} {usedUnit} of {total} {totalUnit} used
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
