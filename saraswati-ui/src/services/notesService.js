import { storageManager } from "./storageManager";
import { logActivity } from "./activityService";

export function getAllNotes() {
  return storageManager.getItem("notes", []);
}

export function getNotes(documentId) {
  const allNotes = getAllNotes();
  return allNotes.filter((n) => n.documentId === documentId);
}

export function createNote(documentId, content) {
  const notes = getAllNotes();
  const note = {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    documentId,
    content,
    pinned: false,
    favorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.unshift(note);
  storageManager.setItem("notes", notes);
  
  // Try to find the document title for logging
  const docs = storageManager.getItem("documents", []);
  const doc = docs.find(d => d.id === documentId);
  if (doc) {
    logActivity("created_note", doc.title, { targetType: "note", subjectId: doc.subjectId, documentId, noteId: note.id });
  }

  return { ...note };
}

export function updateNote(documentId, noteId, content) {
  const notes = getAllNotes();
  const index = notes.findIndex((n) => n.id === noteId && n.documentId === documentId);
  if (index !== -1) {
    notes[index].content = content;
    notes[index].updatedAt = new Date().toISOString();
    storageManager.setItem("notes", notes);
    return { ...notes[index] };
  }
  return null;
}

export function deleteNote(documentId, noteId) {
  const notes = getAllNotes();
  const newNotes = notes.filter((n) => !(n.id === noteId && n.documentId === documentId));
  storageManager.setItem("notes", newNotes);
}

export function pinNote(documentId, noteId) {
  const notes = getAllNotes();
  const index = notes.findIndex((n) => n.id === noteId && n.documentId === documentId);
  if (index !== -1) {
    notes[index].pinned = !notes[index].pinned;
    notes[index].updatedAt = new Date().toISOString();
    storageManager.setItem("notes", notes);
    
    if (notes[index].pinned) {
      const docs = storageManager.getItem("documents", []);
      const doc = docs.find(d => d.id === documentId);
      if (doc) {
        logActivity("pinned_note", doc.title, { targetType: "note", subjectId: doc.subjectId, documentId, noteId });
      }
    }
    return { ...notes[index] };
  }
  return null;
}

export function renameNote(documentId, noteId, newContent) {
  return updateNote(documentId, noteId, newContent);
}

export function favoriteNote(documentId, noteId) {
  const notes = getAllNotes();
  const index = notes.findIndex((n) => n.id === noteId && n.documentId === documentId);
  if (index !== -1) {
    notes[index].favorite = !notes[index].favorite;
    notes[index].updatedAt = new Date().toISOString();
    storageManager.setItem("notes", notes);
    return { ...notes[index] };
  }
  return null;
}

export function searchNotes(query) {
  const q = query.toLowerCase();
  const allNotes = getAllNotes();
  return allNotes.filter((n) => n.content.toLowerCase().includes(q));
}

