import { DOCUMENTS } from "../../lib/data";

export function createCitation({
  documentId,
  documentName,
  page,
  section,
  confidence,
  snippet,
  ocrRegion,
}) {
  return {
    id: `cite-${documentId}-p${page}-${Date.now()}`,
    documentId: documentId ?? null,
    documentName: documentName ?? "Unknown Document",
    page: page ?? 1,
    section: section ?? null,
    confidence: confidence ?? 0.85,
    snippet: snippet ?? null,
    ocrRegion: ocrRegion ?? null,
  };
}

const MOCK_SECTIONS = [
  "Introduction & Overview",
  "Core Concepts",
  "Key Definitions",
  "Detailed Analysis",
  "Practical Applications",
  "Evaluation Criteria",
  "Properties",
  "Approach Comparison",
  "Decomposition Theory",
  "Dependency Analysis",
  "Summary & Review",
  "Worked Examples",
  "Advanced Topics",
  "Foundational Principles",
];

function pickSections(count) {
  const shuffled = [...MOCK_SECTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateCitationsForDocument(documentId, subjectId, count) {
  const docs = DOCUMENTS[subjectId] ?? [];
  const doc = docs.find((d) => d.id === documentId);
  if (!doc) return [];

  const sections = pickSections(count ?? 3);
  const totalPages = doc.pages ?? 30;

  return sections.map((section, i) => {
    const page = Math.min(Math.floor((totalPages / (count ?? 3)) * (i + 0.5)) + 1, totalPages);
    return createCitation({
      documentId: doc.id,
      documentName: doc.title,
      page,
      section,
      confidence: parseFloat((0.7 + Math.random() * 0.25).toFixed(2)),
      snippet: null,
      ocrRegion: null,
    });
  });
}

export function generateCitationsForContext(context, count) {
  const citations = [];
  const targetCount = count ?? 3;
  const docIds = context.documentIds ?? [];
  const subjectId = context.subjectId;

  if (docIds.length === 0 && subjectId) {
    const docs = DOCUMENTS[subjectId] ?? [];
    const selected = docs.slice(0, 2);
    for (const doc of selected) {
      citations.push(
        ...generateCitationsForDocument(doc.id, subjectId, Math.ceil(targetCount / selected.length))
      );
    }
    return citations.slice(0, targetCount);
  }

  for (const docId of docIds) {
    const perDoc = Math.ceil(targetCount / docIds.length);
    citations.push(...generateCitationsForDocument(docId, subjectId, perDoc));
  }

  return citations.slice(0, targetCount);
}
