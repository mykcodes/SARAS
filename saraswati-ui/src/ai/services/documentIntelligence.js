import { delay } from "../state/requestState";
import { DOCUMENTS } from "../../lib/data";

export async function extractText(documentId, subjectId) {
  await delay(200);
  const doc = findDoc(documentId, subjectId);
  if (!doc) return { documentId, status: "not-found", text: null };

  return {
    documentId,
    status: "mock",
    text: `[Mock extracted text for "${doc.title}" — ${doc.pages} pages of content would appear here in production.]`,
    pageCount: doc.pages,
    extractedAt: new Date().toISOString(),
  };
}

export async function extractTables(documentId, subjectId) {
  await delay(200);
  const doc = findDoc(documentId, subjectId);
  if (!doc) return { documentId, tables: [], status: "not-found" };

  return {
    documentId,
    status: "mock",
    tables: [
      {
        id: `table-${documentId}-1`,
        page: Math.ceil(doc.pages * 0.3),
        headers: ["Column A", "Column B", "Column C"],
        rows: [
          ["Value 1", "Value 2", "Value 3"],
          ["Value 4", "Value 5", "Value 6"],
        ],
      },
    ],
    extractedAt: new Date().toISOString(),
  };
}

export async function extractFormulas(documentId, subjectId) {
  await delay(200);
  const doc = findDoc(documentId, subjectId);
  if (!doc) return { documentId, formulas: [], status: "not-found" };

  return {
    documentId,
    status: "mock",
    formulas: [
      { id: `formula-${documentId}-1`, expression: "y = mx + b", label: "Linear Equation", page: 5 },
      { id: `formula-${documentId}-2`, expression: "E = mc²", label: "Energy-Mass Equivalence", page: 12 },
    ],
    extractedAt: new Date().toISOString(),
  };
}

export async function extractImages(documentId, subjectId) {
  await delay(200);
  const doc = findDoc(documentId, subjectId);
  if (!doc) return { documentId, images: [], status: "not-found" };

  return {
    documentId,
    status: "mock",
    images: [
      { id: `img-${documentId}-1`, page: 2, caption: "Figure 1: Overview Diagram", ocrText: null },
    ],
    extractedAt: new Date().toISOString(),
  };
}

export async function detectHeadings(documentId, subjectId) {
  await delay(200);
  const doc = findDoc(documentId, subjectId);
  if (!doc) return { documentId, headings: [], status: "not-found" };

  return {
    documentId,
    status: "mock",
    headings: [
      { level: 1, text: "Introduction", page: 1 },
      { level: 2, text: "Core Concepts", page: 3 },
      { level: 2, text: "Methodology", page: 8 },
      { level: 1, text: "Conclusion", page: doc.pages },
    ],
    extractedAt: new Date().toISOString(),
  };
}

export async function extractKeywords(documentId, subjectId) {
  await delay(200);
  const doc = findDoc(documentId, subjectId);
  if (!doc) return { documentId, keywords: [], status: "not-found" };

  return {
    documentId,
    status: "mock",
    keywords: doc.tags.map((tag, i) => ({
      term: tag,
      frequency: Math.floor(10 + Math.random() * 20),
      relevance: parseFloat((0.7 + Math.random() * 0.3).toFixed(2)),
      rank: i + 1,
    })),
    extractedAt: new Date().toISOString(),
  };
}

export async function generateDocumentSummary(documentId, subjectId) {
  await delay(500);
  const doc = findDoc(documentId, subjectId);
  if (!doc) return { documentId, summary: null, status: "not-found" };

  return {
    documentId,
    status: "mock",
    summary: `This document "${doc.title}" covers ${doc.tags.join(", ")} across ${doc.pages} pages. Key concepts include foundational theory, practical applications, and worked examples.`,
    generatedAt: new Date().toISOString(),
  };
}

export async function detectTopics(documentId, subjectId) {
  await delay(300);
  const doc = findDoc(documentId, subjectId);
  if (!doc) return { documentId, topics: [], status: "not-found" };

  return {
    documentId,
    status: "mock",
    topics: doc.tags.map((tag) => ({
      name: tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      confidence: parseFloat((0.6 + Math.random() * 0.35).toFixed(2)),
      pages: [Math.floor(Math.random() * doc.pages) + 1],
    })),
    extractedAt: new Date().toISOString(),
  };
}

function findDoc(documentId, subjectId) {
  if (subjectId) {
    const docs = DOCUMENTS[subjectId] ?? [];
    return docs.find((d) => d.id === documentId) ?? null;
  }
  for (const docs of Object.values(DOCUMENTS)) {
    const found = docs.find((d) => d.id === documentId);
    if (found) return found;
  }
  return null;
}
