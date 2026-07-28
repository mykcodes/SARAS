import { getNotesByDocumentId as getFromData } from "../lib/data";
import { DOCUMENTS } from "../lib/data";

const notesCache = {};

function ensureLoaded(documentId) {
  if (!notesCache[documentId]) {
    notesCache[documentId] = getFromData(documentId).map((n) => ({ ...n }));
  }
  return notesCache[documentId];
}

export function getNotes(documentId) {
  return [...ensureLoaded(documentId)];
}

export function getAllNotes() {
  const allDocIds = new Set();
  for (const docs of Object.values(DOCUMENTS)) {
    for (const doc of docs) {
      allDocIds.add(doc.id);
    }
  }
  const result = [];
  for (const docId of allDocIds) {
    const notes = ensureLoaded(docId);
    result.push(...notes.map((n) => ({ ...n })));
  }
  return result;
}

export function createNote(documentId, content) {
  const notes = ensureLoaded(documentId);
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
  return { ...note };
}

export function updateNote(documentId, noteId, content) {
  const notes = ensureLoaded(documentId);
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    note.content = content;
    note.updatedAt = new Date().toISOString();
  }
  return note ? { ...note } : null;
}

export function deleteNote(documentId, noteId) {
  const notes = ensureLoaded(documentId);
  const idx = notes.findIndex((n) => n.id === noteId);
  if (idx !== -1) notes.splice(idx, 1);
  notesCache[documentId] = notes;
}

export function pinNote(documentId, noteId) {
  const notes = ensureLoaded(documentId);
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    note.pinned = !note.pinned;
    note.updatedAt = new Date().toISOString();
  }
  return note ? { ...note } : null;
}

export function renameNote(documentId, noteId, newContent) {
  return updateNote(documentId, noteId, newContent);
}

export function favoriteNote(documentId, noteId) {
  const notes = ensureLoaded(documentId);
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    note.favorite = !note.favorite;
    note.updatedAt = new Date().toISOString();
  }
  return note ? { ...note } : null;
}

export function searchNotes(query) {
  const q = query.toLowerCase();
  const allNotes = getAllNotes();
  return allNotes.filter((n) => n.content.toLowerCase().includes(q));
}
