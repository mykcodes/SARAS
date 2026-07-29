import { generateCitationsForContext, formatCitationsForDisplay } from "./citationService";
import { buildFlashcardPrompt } from "../prompts/promptBuilder";
import { delay } from "../state/requestState";

const MOCK_FLASHCARDS = "I've generated **8 flashcards** from this document:\n\n**Card 1** — *Definition*\nQ: What is the primary purpose of the technique described in Section 2?\nA: To decompose complex structures into simpler, well-defined components.\n\n**Card 2** — *Concept*\nQ: What are the three main criteria for evaluation?\nA: Correctness, efficiency, and maintainability.\n\n**Card 3** — *Application*\nQ: When should you apply the advanced variant?\nA: When the basic approach leads to redundancy or anomalies.\n\n*…and 5 more cards ready for review.*";

export async function generateFlashcards(context, options) {
  await delay(1300 + Math.random() * 700);

  const prompt = buildFlashcardPrompt(context);
  const citations = generateCitationsForContext(context, 2);
  const cardCount = options?.cardCount ?? 8;

  return {
    id: `flashcards-${Date.now()}`,
    text: MOCK_FLASHCARDS,
    citations: formatCitationsForDisplay(citations),
    prompt,
    generatedAt: new Date().toISOString(),
    cardCount,
  };
}
