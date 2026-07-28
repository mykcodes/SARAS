import { useState } from "react";
import { Check, X } from "lucide-react";

/**
 * Inline editor for creating or editing a note.
 * Shows a textarea with save/cancel actions.
 */
function NoteEditor({ initialContent = "", onSave, onCancel }) {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    if (content.trim()) onSave(content.trim());
  };

  return (
    <div className="ai-message-enter rounded-lg border border-gold/25 bg-surface p-2.5">
      <textarea
        className="w-full resize-none rounded-md bg-surface-soft px-2.5 py-2 text-[12px] leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-gold/30"
        placeholder="Write your note…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        autoFocus
      />
      <div className="mt-2 flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-2 py-1 text-[11px] text-ink-faint transition-colors hover:text-ink"
        >
          <X size={13} />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!content.trim()}
          className="flex items-center gap-1 rounded-md bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold transition-colors hover:bg-gold/20 disabled:opacity-40"
        >
          <Check size={12} />
          Save
        </button>
      </div>
    </div>
  );
}

export default NoteEditor;
