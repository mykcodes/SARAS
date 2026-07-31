import { Link } from "react-router-dom";
import { MoreHorizontal, Star } from "lucide-react";
import FolderIcon from "./FolderIcon";
import { formatFileCount, formatRelativeTime, formatFileSize } from "../../lib/formatters";

function FolderCard({ folder, onContextMenu }) {
  return (
    <Link
      to={`/subjects/${folder.id}`}
      className="gold-glow-hover flex h-full flex-col justify-between gap-4 rounded-xl border border-border-subtle bg-surface p-4"
    >
      <div className="flex items-start justify-between">
        <FolderIcon color={folder.color} />
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (onContextMenu) {
              const rect = event.currentTarget.getBoundingClientRect();
              onContextMenu(folder.id, rect.left, rect.bottom + 8);
            }
          }}
          className="rounded-md p-1 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
          aria-label="Folder options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-[14.5px] font-medium text-ink">{folder.title}</p>
          {folder.isFavorite && (
            <Star size={13} className="shrink-0 text-gold" fill="currentColor" />
          )}
        </div>
        <p className="mt-1 truncate text-[12.5px] text-ink-soft">
          {formatFileCount(folder.fileCount)}{" "}
          <span className="mx-1.5 text-ink-faint">•</span> {formatFileSize(folder.storageUsed)}{" "}
          <span className="mx-1.5 text-ink-faint">•</span> {formatRelativeTime(folder.updatedAt)}
        </p>
      </div>
    </Link>
  );
}

export default FolderCard;