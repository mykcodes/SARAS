import { FileText, Sparkles, StickyNote, X } from "lucide-react";
import { formatRelativeTime } from "../../lib/formatters";

const ICON_MAP = {
  document: FileText,
  "ai-response": Sparkles,
  note: StickyNote,
};

const ICON_COLOR = {
  document: "text-blue-400",
  "ai-response": "text-gold",
  note: "text-emerald-400",
};

/**
 * Individual bookmark entry with type icon and remove action.
 */
function BookmarkItem({ bookmark, onRemove }) {
  const Icon = ICON_MAP[bookmark.type] ?? FileText;
  const iconColor = ICON_COLOR[bookmark.type] ?? "text-ink-faint";

  return (
    <div className="group flex items-center gap-2.5 rounded-lg border border-border-subtle bg-surface px-3 py-2.5 transition-colors hover:border-border-default">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-surface-soft ${iconColor}`}>
        <Icon size={13} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11.5px] font-medium text-ink">{bookmark.title}</p>
        <p className="truncate text-[10px] text-ink-faint">{bookmark.subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="rounded p-1 text-ink-faint opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
        aria-label="Remove bookmark"
      >
        <X size={12} />
      </button>
    </div>
  );
}

export default BookmarkItem;
