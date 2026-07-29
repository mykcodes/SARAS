import { useState, useCallback, useEffect } from "react";
import { Plus, StickyNote } from "lucide-react";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import { getNotes, createNote, updateNote, deleteNote, pinNote, favoriteNote } from "../../services/notesService";
import { storageManager } from "../../services/storageManager";

function NotesPanel({ documentId }) {
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!documentId) return;
    
    // Initial load
    setNotes(getNotes(documentId));

    // Subscribe to changes
    const unsubscribe = storageManager.subscribe("notes", () => {
      setNotes(getNotes(documentId));
    });

    return () => unsubscribe();
  }, [documentId]);

  const pinned = notes.filter((n) => n.pinned);
  const unpinned = notes.filter((n) => !n.pinned);

  const handleCreate = (content) => {
    if (!documentId || !content.trim()) return;
    createNote(documentId, content.trim());
    setIsCreating(false);
  };

  const handleUpdate = (noteId, content) => {
    if (!documentId) return;
    updateNote(documentId, noteId, content);
    setEditingId(null);
  };

  const handleDelete = (noteId) => {
    if (!documentId) return;
    deleteNote(documentId, noteId);
  };

  const handlePin = (noteId) => {
    if (!documentId) return;
    pinNote(documentId, noteId);
  };

  const handleFavorite = (noteId) => {
    if (!documentId) return;
    favoriteNote(documentId, noteId);
  };

  if (!documentId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
        <StickyNote size={24} className="text-ink-faint" />
        <p className="text-center text-[11.5px] text-ink-faint">
          Open a document to start taking notes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
        <span className="text-[12px] font-semibold text-ink">
          Notes ({notes.length})
        </span>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-ink-faint transition-colors hover:text-gold"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {isCreating && (
          <NoteEditor
            onSave={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        )}

        {pinned.length > 0 && (
          <>
            <span className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">
              Pinned
            </span>
            {pinned.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isEditing={editingId === note.id}
                onEdit={() => setEditingId(note.id)}
                onSave={(content) => handleUpdate(note.id, content)}
                onCancelEdit={() => setEditingId(null)}
                onDelete={() => handleDelete(note.id)}
                onPin={() => handlePin(note.id)}
                onFavorite={() => handleFavorite(note.id)}
              />
            ))}
          </>
        )}

        {unpinned.length > 0 && (
          <>
            {pinned.length > 0 && (
              <span className="mt-1 text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">
                All Notes
              </span>
            )}
            {unpinned.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isEditing={editingId === note.id}
                onEdit={() => setEditingId(note.id)}
                onSave={(content) => handleUpdate(note.id, content)}
                onCancelEdit={() => setEditingId(null)}
                onDelete={() => handleDelete(note.id)}
                onPin={() => handlePin(note.id)}
                onFavorite={() => handleFavorite(note.id)}
              />
            ))}
          </>
        )}

        {notes.length === 0 && !isCreating && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8">
            <StickyNote size={20} className="text-ink-faint" />
            <p className="text-center text-[11px] text-ink-faint">
              No notes yet. Click "Add" to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesPanel;
