import { generateCitationsForContext, formatCitationsForDisplay } from "./citationService";
import { buildSummaryPrompt } from "../prompts/promptBuilder";
import { delay } from "../state/requestState";

const MOCK_SUMMARIES = {
  default: "Here's a concise summary of the key concepts in this document:\n\n**Main Topics:**\n1. The document covers foundational concepts with detailed examples and diagrams.\n2. Key terminology is introduced progressively, building on previous sections.\n3. Practical applications are demonstrated through worked examples.\n\n**Key Takeaways:**\n• The core principle relies on systematic decomposition of complex structures.\n• There are well-defined rules that govern each transformation step.\n• Edge cases are highlighted with specific attention to common misconceptions.",
  short: "This document covers foundational concepts with progressive terminology introduction and practical worked examples. Key focus areas include systematic decomposition, well-defined transformation rules, and common misconceptions.",
  detailed: "Here is an in-depth analysis of the document content:\n\n**Section 1: Foundations**\nThe document opens with a comprehensive overview establishing core terminology and foundational principles. Each concept is introduced with formal definitions followed by intuitive explanations.\n\n**Section 2: Core Methodology**\nThe central methodology is presented through a series of progressive steps. Each step builds on the previous, creating a logical chain from basic principles to advanced applications.\n\n**Section 3: Practical Applications**\nMultiple worked examples demonstrate real-world application of the concepts. Common pitfalls are addressed with specific strategies for avoidance.\n\n**Section 4: Advanced Topics**\nThe document concludes with extensions and edge cases that require deeper understanding of the foundational material.",
};

export async function generateSummary(context, options) {
  await delay(1200 + Math.random() * 800);

  const prompt = buildSummaryPrompt(context);
  const citations = generateCitationsForContext(context, 3);
  const variant = options?.variant ?? "default";

  return {
    id: `summary-${Date.now()}`,
    text: MOCK_SUMMARIES[variant] ?? MOCK_SUMMARIES.default,
    citations: formatCitationsForDisplay(citations),
    prompt,
    generatedAt: new Date().toISOString(),
    variant,
  };
}
