import {
  createCitation,
  generateCitationsForDocument,
  generateCitationsForContext,
} from "../models/citation";

export { createCitation, generateCitationsForDocument, generateCitationsForContext };

export function formatCitationForDisplay(citation) {
  return {
    documentName: citation.documentName,
    pageNumber: citation.page,
    sectionTitle: citation.section ?? "General",
    confidence: citation.confidence,
  };
}

export function formatCitationsForDisplay(citations) {
  return citations.map(formatCitationForDisplay);
}

export function mergeCitations(citationSets) {
  const seen = new Set();
  const merged = [];
  for (const set of citationSets) {
    for (const cite of set) {
      const key = `${cite.documentId}:${cite.page}:${cite.section}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(cite);
      }
    }
  }
  return merged;
}

export function sortCitationsByConfidence(citations) {
  return [...citations].sort((a, b) => b.confidence - a.confidence);
}

export function filterCitationsByDocument(citations, documentId) {
  return citations.filter((c) => c.documentId === documentId);
}
