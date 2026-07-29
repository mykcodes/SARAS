import {
  createConversation,
  createMessage,
  createConversationContext,
  createPinnedResponse,
  getConversationStore,
  addConversationToStore,
  updateConversationInStore,
  addPinnedResponseToStore,
  removePinnedResponseFromStore,
  getPinnedResponsesForConversation,
} from "../models/conversation";

export function getAllConversations() {
  return [...getConversationStore().conversations];
}

export function getConversationsBySubject(subjectId) {
  if (!subjectId) return getAllConversations();
  return getConversationStore().conversations.filter((c) => c.subjectId === subjectId);
}

export function getConversationById(id) {
  return getConversationStore().conversations.find((c) => c.id === id) ?? null;
}

export function searchConversations(query) {
  const q = query.toLowerCase();
  return getConversationStore().conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
  );
}

export function startConversation({ subjectId, subjectTitle, title }) {
  const conversation = createConversation({ subjectId, subjectTitle, title });
  return addConversationToStore(conversation);
}

export function addMessage(conversationId, { role, text, citations, context }) {
  const conv = getConversationById(conversationId);
  if (!conv) return null;

  const message = createMessage({ role, text, citations, context });

  if (!conv.messages) conv.messages = [];
  conv.messages.push(message);

  updateConversationInStore(conversationId, {
    lastMessage: text.slice(0, 120),
    messageCount: conv.messages.length,
    messages: conv.messages,
  });

  return message;
}

export function getMessages(conversationId) {
  const conv = getConversationById(conversationId);
  return conv?.messages ?? [];
}

export function pinConversation(id) {
  return updateConversationInStore(id, { pinned: true });
}

export function unpinConversation(id) {
  return updateConversationInStore(id, { pinned: false });
}

export function setConversationContext(conversationId, contextParams) {
  const ctx = createConversationContext(contextParams);
  return updateConversationInStore(conversationId, { context: ctx });
}

export function pinResponse(conversationId, messageId, reason) {
  const pinned = createPinnedResponse({ messageId, conversationId, reason });
  addPinnedResponseToStore(pinned);

  const conv = getConversationById(conversationId);
  if (conv?.messages) {
    const msg = conv.messages.find((m) => m.id === messageId);
    if (msg) msg.pinned = true;
  }

  return pinned;
}

export function unpinResponse(pinnedId) {
  removePinnedResponseFromStore(pinnedId);
}

export function getPinnedResponses(conversationId) {
  return getPinnedResponsesForConversation(conversationId);
}

export function deleteConversation(id) {
  const store = getConversationStore();
  store.conversations = store.conversations.filter((c) => c.id !== id);
}

export function renameConversation(id, title) {
  return updateConversationInStore(id, { title });
}
