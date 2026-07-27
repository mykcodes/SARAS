import { MoreHorizontal, Star } from "lucide-react";
import FolderIcon from "./FolderIcon";
import { useFavorites } from "../../lib/FavoritesContext";

function FolderCard({ folder }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(folder.id);

  return (
    <div className="gold-glow-hover flex h-full flex-col justify-between gap-4 rounded-xl border border-border-subtle bg-surface p-4">
      <div className="flex items-start justify-between">
        <FolderIcon color={folder.iconBg} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => toggleFavorite(folder.id)}
            className="rounded-md p-1 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Star size={17} className={favorited ? "fill-gold text-gold" : ""} />
          </button>
          <button
            type="button"
            className="rounded-md p-1 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
            aria-label="Folder options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <p className="truncate text-[14.5px] font-medium text-ink">{folder.name}</p>
        <p className="mt-1 truncate text-[12.5px] text-ink-soft">
          {folder.fileCount} <span className="mx-1.5 text-ink-faint">•</span> {folder.lastUpdated}
        </p>
      </div>
    </div>
  );
}

export default FolderCard;