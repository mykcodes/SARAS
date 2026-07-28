import { memo } from "react";
import { Pin, Pencil, Trash2, Star } from "lucide-react";
import NoteEditor from "./NoteEditor";
import { formatRelativeTime } from "../../lib/formatters";

const NoteCard = memo(function NoteCard({ note, isEditing, onEdit, onSave, onCancelEdit, onDelete, onPin, onFavorite }) {
  if (isEditing) {
    return (
      <NoteEditor
        initialContent={note.content}
        onSave={onSave}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <div className="group rounded-lg border border-border-subtle bg-surface p-3 transition-colors hover:border-border-default">
      <p className="text-[12px] leading-relaxed text-ink-soft">{note.content}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-ink-faint">
          {formatRelativeTime(note.updatedAt)}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {onFavorite && (
            <button
              type="button"
              onClick={onFavorite}
              className={`rounded p-1 transition-colors ${
                note.favorite ? "text-gold opacity-100" : "text-ink-faint hover:text-gold"
              }`}
              aria-label={note.favorite ? "Unfavorite" : "Favorite"}
            >
              <Star size={11} fill={note.favorite ? "currentColor" : "none"} />
            </button>
          )}
          <button
            type="button"
            onClick={onPin}
            className={`rounded p-1 transition-colors ${
              note.pinned ? "text-gold" : "text-ink-faint hover:text-gold"
            }`}
            aria-label={note.pinned ? "Unpin" : "Pin"}
          >
            <Pin size={11} className={note.pinned ? "rotate-45" : ""} />
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded p-1 text-ink-faint transition-colors hover:text-ink"
            aria-label="Edit note"
          >
            <Pencil size={11} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded p-1 text-ink-faint transition-colors hover:text-red-400"
            aria-label="Delete note"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default NoteCard;
