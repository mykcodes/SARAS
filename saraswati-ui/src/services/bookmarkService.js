import { getBookmarks as getFromData } from "../lib/data";

let bookmarks = null;

function init() {
  if (!bookmarks) {
    bookmarks = getFromData().map((b) => ({ ...b }));
  }
}

export function getAllBookmarks() {
  init();
  return [...bookmarks];
}

export function getBookmarksByType(type) {
  init();
  return bookmarks.filter((b) => b.type === type);
}

export function addBookmark(item) {
  init();
  const bookmark = {
    id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    ...item,
  };
  bookmarks.unshift(bookmark);
  return { ...bookmark };
}

export function removeBookmark(id) {
  init();
  const idx = bookmarks.findIndex((b) => b.id === id);
  if (idx !== -1) bookmarks.splice(idx, 1);
}

export function isBookmarked(id) {
  init();
  return bookmarks.some((b) => b.id === id);
}

export function toggleBookmark(item) {
  init();
  const existing = bookmarks.find(
    (b) =>
      (b.documentId && b.documentId === item.documentId && b.type === item.type) ||
      (b.subjectId && b.subjectId === item.subjectId && b.type === "subject") ||
      (b.noteId && b.noteId === item.noteId && b.type === "note")
  );
  if (existing) {
    removeBookmark(existing.id);
    return null;
  }
  return addBookmark(item);
}

export function getBookmarksByItem(itemType, itemId) {
  init();
  return bookmarks.filter((b) => {
    if (itemType === "document") return b.documentId === itemId;
    if (itemType === "subject") return b.subjectId === itemId && b.type === "subject";
    if (itemType === "note") return b.noteId === itemId;
    return false;
  });
}

export function searchBookmarks(query) {
  init();
  const q = query.toLowerCase();
  return bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(q))
  );
}
