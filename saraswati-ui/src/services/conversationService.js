/**
 * Conversation Service — mock implementation.
 *
 * Manages conversation history with in-memory state.
 * When a real backend is available, replace internals with API calls.
 */
import { getConversationsBySubjectId as getFromData } from "../lib/data";

let conversations = null;

function init() {
  if (!conversations) {
    conversations = getFromData().map((c) => ({ ...c }));
  }
}

export function getConversations(subjectId) {
  init();
  if (!subjectId) return [...conversations];
  return conversations.filter((c) => c.subjectId === subjectId);
}

export function searchConversations(query) {
  init();
  const q = query.toLowerCase();
  return conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
  );
}

export function pinConversation(id) {
  init();
  const conv = conversations.find((c) => c.id === id);
  if (conv) conv.pinned = true;
  return conv ?? null;
}

export function unpinConversation(id) {
  init();
  const conv = conversations.find((c) => c.id === id);
  if (conv) conv.pinned = false;
  return conv ?? null;
}

export function getConversationById(id) {
  init();
  return conversations.find((c) => c.id === id) ?? null;
}
