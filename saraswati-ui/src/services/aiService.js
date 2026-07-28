/**
 * AI Service — mock implementation.
 *
 * Simulates AI responses with realistic delays. Each function returns a
 * Promise so the call-site is already async-ready for a real API swap.
 */
import { AI_RESPONSE_TEMPLATES } from "../lib/data";

const MOCK_DELAY_MS = 1500;

/**
 * Sends a user message and returns a mock AI response.
 * Matches message keywords to template categories; defaults to "general".
 */
export async function sendMessage(message, _context) {
  await delay(MOCK_DELAY_MS + Math.random() * 1000);

  const lower = message.toLowerCase();
  let templateKey = "general";

  if (lower.includes("summar")) templateKey = "summarize";
  else if (lower.includes("flashcard")) templateKey = "flashcards";
  else if (lower.includes("quiz")) templateKey = "quiz";
  else if (lower.includes("explain") || lower.includes("difficult") || lower.includes("concept"))
    templateKey = "explain";

  const template = AI_RESPONSE_TEMPLATES[templateKey];

  return {
    id: `msg-ai-${Date.now()}`,
    role: "assistant",
    text: template.text,
    citations: template.citations,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Returns context-aware prompt suggestions.
 */
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

/**
 * Returns a mock AI response for a quick action.
 */
export async function executeQuickAction(actionId) {
  await delay(MOCK_DELAY_MS + Math.random() * 800);

  const templateMap = {
    summarize: "summarize",
    flashcards: "flashcards",
    quiz: "quiz",
    explain: "explain",
    topics: "general",
    compare: "general",
    mindmap: "general",
    formulae: "general",
    definitions: "general",
  };

  const templateKey = templateMap[actionId] ?? "general";
  const template = AI_RESPONSE_TEMPLATES[templateKey];

  return {
    id: `msg-ai-${Date.now()}`,
    role: "assistant",
    text: template.text,
    citations: template.citations,
    timestamp: new Date().toISOString(),
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
