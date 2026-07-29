import { getSubjects } from "./subjectService";
import { getDocuments } from "./documentService";
import { getConversations } from "./conversationService";
import { getAllBookmarks } from "./bookmarkService";
import { getAllNotes } from "./notesService";

export function globalSearch(query) {
  if (!query || !query.trim()) {
    return { subjects: [], documents: [], notes: [], conversations: [], bookmarks: [] };
  }

  const q = query.toLowerCase().trim();

  const subjects = getSubjects().filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
  ).map((s) => ({ ...s, resultType: "subject" }));

  const documents = getDocuments().filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.tags.some((t) => t.toLowerCase().includes(q))
  ).map((doc) => ({ ...doc, resultType: "document" }));

  const allNotes = getAllNotes();
  const notes = allNotes.filter((n) =>
    n.content.toLowerCase().includes(q)
  ).map((n) => ({ ...n, resultType: "note" }));

  const conversations = getConversations().filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
  ).map((c) => ({ ...c, resultType: "conversation" }));

  const bookmarks = getAllBookmarks().filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(q))
  ).map((b) => ({ ...b, resultType: "bookmark" }));

  return { subjects, documents, notes, conversations, bookmarks };
}

export function getSearchResultCount(results) {
  return (
    results.subjects.length +
    results.documents.length +
    results.notes.length +
    results.conversations.length +
    results.bookmarks.length
  );
}
