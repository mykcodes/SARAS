import { getChatHistory, deleteChat } from "../api/chatApi";

let _cachedConversations = [];
let _lastSubjectId = null;

export async function fetchConversations(subjectId) {
  if (!subjectId) return [];
  try {
    const chats = await getChatHistory(subjectId);
    _cachedConversations = chats.map((c) => ({
      id: c.id,
      subjectId: c.subject_id,
      title: c.title || "Untitled conversation",
      lastMessage: c.last_message || "",
      createdAt: c.created_at,
      pinned: false,
      subjectTitle: "",
    }));
    _lastSubjectId = subjectId;
    return _cachedConversations;
  } catch {
    return [];
  }
}

export function getConversations(subjectId) {
  if (subjectId && subjectId !== _lastSubjectId) {
    fetchConversations(subjectId);
  }
  if (!subjectId) return [..._cachedConversations];
  return _cachedConversations.filter((c) => c.subjectId === subjectId);
}

export function searchConversations(query) {
  const q = query.toLowerCase();
  return _cachedConversations.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
  );
}

export function pinConversation(id) {
  const conv = _cachedConversations.find((c) => c.id === id);
  if (conv) conv.pinned = true;
  return conv ?? null;
}

export function unpinConversation(id) {
  const conv = _cachedConversations.find((c) => c.id === id);
  if (conv) conv.pinned = false;
  return conv ?? null;
}

export function getConversationById(id) {
  return _cachedConversations.find((c) => c.id === id) ?? null;
}
