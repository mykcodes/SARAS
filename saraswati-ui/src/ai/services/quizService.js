import { generateCitationsForContext, formatCitationsForDisplay } from "./citationService";
import { buildQuizPrompt } from "../prompts/promptBuilder";
import { delay } from "../state/requestState";

const MOCK_QUIZ = "Here's a **5-question quiz** based on this document:\n\n**Q1.** Which of the following is NOT a valid property discussed in Chapter 3?\na) Atomicity  b) Consistency  c) Redundancy  d) Isolation\n\n**Q2.** True or False: The technique in Section 4 always produces an optimal result.\n\n**Q3.** Explain the difference between the two approaches described on pages 18-22.\n\n**Q4.** What is the worst-case complexity of the algorithm in Section 5?\n\n**Q5.** Give an example where the basic approach fails and the advanced variant is needed.";

export async function generateQuiz(context, options) {
  await delay(1400 + Math.random() * 600);

  const prompt = buildQuizPrompt(context);
  const citations = generateCitationsForContext(context, 2);
  const questionCount = options?.questionCount ?? 5;

  return {
    id: `quiz-${Date.now()}`,
    text: MOCK_QUIZ,
    citations: formatCitationsForDisplay(citations),
    prompt,
    generatedAt: new Date().toISOString(),
    questionCount,
  };
}
