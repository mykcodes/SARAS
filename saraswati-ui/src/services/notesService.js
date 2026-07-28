/**
 * Notes Service — mock implementation.
 *
 * Manages notes with in-memory state keyed by document ID.
 * Replace internals with API calls when backend persistence is available.
 */
import { getNotesByDocumentId as getFromData } from "../lib/data";

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

export function createNote(documentId, content) {
  const notes = ensureLoaded(documentId);
  const note = {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    documentId,
    content,
    pinned: false,
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
