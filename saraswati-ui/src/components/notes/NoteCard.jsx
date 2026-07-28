import { Pin, Pencil, Trash2 } from "lucide-react";
import NoteEditor from "./NoteEditor";
import { formatRelativeTime } from "../../lib/formatters";

/**
 * Individual note card with edit/delete/pin actions.
 * When in editing mode, shows the NoteEditor inline.
 */
function NoteCard({ note, isEditing, onEdit, onSave, onCancelEdit, onDelete, onPin }) {
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
}

export default NoteCard;
