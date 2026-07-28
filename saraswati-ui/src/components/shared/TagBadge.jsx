function TagBadge({ tag, onRemove, size = "sm" }) {
  const sizeClasses = size === "sm"
    ? "px-1.5 py-0.5 text-[10px] gap-1"
    : "px-2 py-1 text-[11px] gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ${sizeClasses}`}
      style={{
        backgroundColor: `${tag.color}18`,
        color: tag.color,
        border: `1px solid ${tag.color}40`,
      }}
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(tag.id);
          }}
          className="ml-0.5 opacity-60 transition-opacity hover:opacity-100"
        >
          ✕
        </button>
      )}
    </span>
  );
}

export default TagBadge;
