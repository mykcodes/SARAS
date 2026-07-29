import { getConversationsBySubjectId as getFromData } from "../../lib/data";

export function createConversation({ subjectId, subjectTitle, title }) {
  return {
    id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: title ?? "New Conversation",
    subjectId: subjectId ?? null,
    subjectTitle: subjectTitle ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessage: "",
    pinned: false,
    messageCount: 0,
    messages: [],
    context: null,
    tokenUsage: { prompt: 0, completion: 0, total: 0 },
    modelId: null,
    streamingEnabled: false,
  };
}

export function createMessage({ role, text, citations, context }) {
  return {
    id: `msg-${role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    role,
    text,
    citations: citations ?? [],
    context: context ?? null,
    timestamp: new Date().toISOString(),
    pinned: false,
    tokenUsage: null,
    modelId: null,
  };
}

export function createConversationContext({ type, subjectId, documentIds, metadata }) {
  return {
    type: type ?? "document",
    subjectId: subjectId ?? null,
    documentIds: documentIds ?? [],
    metadata: metadata ?? {},
    resolvedAt: new Date().toISOString(),
  };
}

export function createPinnedResponse({ messageId, conversationId, reason }) {
  return {
    id: `pin-${Date.now()}`,
    messageId,
    conversationId,
    reason: reason ?? null,
    pinnedAt: new Date().toISOString(),
  };
}

let store = null;

function initStore() {
  if (store) return;
  const seed = getFromData().map((c) => ({
    ...c,
    updatedAt: c.createdAt,
    messages: [],
    context: null,
    tokenUsage: { prompt: 0, completion: 0, total: 0 },
    modelId: null,
    streamingEnabled: false,
  }));
  store = { conversations: seed, pinnedResponses: [] };
}

export function getConversationStore() {
  initStore();
  return store;
}

export function addConversationToStore(conversation) {
  initStore();
  store.conversations.unshift(conversation);
  return conversation;
}

export function updateConversationInStore(id, updates) {
  initStore();
  const conv = store.conversations.find((c) => c.id === id);
  if (!conv) return null;
  Object.assign(conv, updates, { updatedAt: new Date().toISOString() });
  return conv;
}

export function addPinnedResponseToStore(pinned) {
  initStore();
  store.pinnedResponses.push(pinned);
  return pinned;
}

export function removePinnedResponseFromStore(pinnedId) {
  initStore();
  store.pinnedResponses = store.pinnedResponses.filter((p) => p.id !== pinnedId);
}

export function getPinnedResponsesForConversation(conversationId) {
  initStore();
  return store.pinnedResponses.filter((p) => p.conversationId === conversationId);
}
