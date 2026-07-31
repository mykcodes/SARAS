import api from './client';

/**
 * POST /api/subjects/:subjectId/chat/ask
 * @param {number} subjectId
 * @param {string} question
 * @param {number|null} chatId
 * @returns {{ chat_id, user_message, ai_message }}
 */
export function askQuestion(subjectId, question, chatId = null) {
  return api.post(`/api/subjects/${subjectId}/chat/ask`, { question, chat_id: chatId });
}

/**
 * GET /api/subjects/:subjectId/chat/history
 * @returns {Array<{ id, subject_id, title, created_at, last_message }>}
 */
export function getChatHistory(subjectId) {
  return api.get(`/api/subjects/${subjectId}/chat/history`);
}

/**
 * GET /api/chat/:chatId/messages
 * @returns {Array<{ id, chat_id, sender, content, citations, timestamp }>}
 */
export function getChatMessages(chatId) {
  return api.get(`/api/chat/${chatId}/messages`);
}

/**
 * DELETE /api/chat/:chatId
 */
export function deleteChat(chatId) {
  return api.delete(`/api/chat/${chatId}`);
}
