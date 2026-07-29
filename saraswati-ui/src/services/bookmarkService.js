import { storageManager } from "./storageManager";
import { logActivity } from "./activityService";

export function getAllBookmarks() {
  return storageManager.getItem("bookmarks", []);
}

export function getBookmarksByType(type) {
  const bookmarks = getAllBookmarks();
  return bookmarks.filter((b) => b.type === type);
}

export function addBookmark(item) {
  const bookmarks = getAllBookmarks();
  const bookmark = {
    id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    ...item,
  };
  bookmarks.unshift(bookmark);
  storageManager.setItem("bookmarks", bookmarks);

  logActivity("bookmarked", item.title || "Item", { 
    targetType: item.type, 
    subjectId: item.subjectId, 
    documentId: item.documentId 
  });

  return { ...bookmark };
}

export function removeBookmark(id) {
  const bookmarks = getAllBookmarks();
  const idx = bookmarks.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookmarks.splice(idx, 1);
    storageManager.setItem("bookmarks", bookmarks);
  }
}

export function isBookmarked(id) {
  const bookmarks = getAllBookmarks();
  return bookmarks.some((b) => b.id === id);
}

export function toggleBookmark(item) {
  const bookmarks = getAllBookmarks();
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
  const bookmarks = getAllBookmarks();
  return bookmarks.filter((b) => {
    if (itemType === "document") return b.documentId === itemId;
    if (itemType === "subject") return b.subjectId === itemId && b.type === "subject";
    if (itemType === "note") return b.noteId === itemId;
    return false;
  });
}

export function searchBookmarks(query) {
  const q = query.toLowerCase();
  const bookmarks = getAllBookmarks();
  return bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(q))
  );
}
