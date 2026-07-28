/**
 * Bookmark Service — mock implementation.
 *
 * Manages bookmarks across documents, AI responses, and notes.
 * Replace internals with API calls when backend is available.
 */
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
