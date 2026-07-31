import { askQuestion, getChatHistory, getChatMessages } from "../api/chatApi";

let _activeChatId = null;

export async function sendMessage(message, context) {
  const subjectId = context?.subjectId;
  if (!subjectId) {
    return {
      id: `msg-ai-${Date.now()}`,
      role: "assistant",
      text: "Please select a subject before asking questions.",
      citations: [],
      timestamp: new Date().toISOString(),
    };
  }

  const documentId = context?.mode === "document" ? context?.documentId : null;
  const data = await askQuestion(subjectId, message, _activeChatId, documentId);

  _activeChatId = data.chat_id;

  const aiMsg = data.ai_message;
  return {
    id: `msg-ai-${aiMsg.id}`,
    role: "assistant",
    text: aiMsg.content,
    citations: aiMsg.citations || [],
    timestamp: aiMsg.timestamp || aiMsg.created_at,
    _chatId: data.chat_id,
  };
}

export function getSuggestedPrompts(_context) {
  return [
    "Summarize the key concepts",
    "Explain the difficult parts",
    "Generate flashcards",
    "Create a practice quiz",
    "Find important topics",
    "Extract definitions",
  ];
}

export async function executeQuickAction(actionId, context) {
  const promptMap = {
    summarize: "Summarize the key concepts from the uploaded documents",
    flashcards: "Generate flashcards from the uploaded documents",
    quiz: "Create a practice quiz based on the uploaded documents",
    explain: "Explain the most difficult concepts from the uploaded documents",
    topics: "List the most important topics covered in the uploaded documents",
    compare: "Compare and contrast the main ideas in the uploaded documents",
    mindmap: "Create a text-based mind map of the key topics from the uploaded documents",
    formulae: "Extract all formulas and equations from the uploaded documents",
    definitions: "Extract all key definitions from the uploaded documents",
  };

  const prompt = promptMap[actionId] || "Summarize the uploaded documents";
  return sendMessage(prompt, context);
}

export function setActiveChatId(chatId) {
  _activeChatId = chatId;
}

export function getActiveChatId() {
  return _activeChatId;
}

export function resetConversation() {
  _activeChatId = null;
}
