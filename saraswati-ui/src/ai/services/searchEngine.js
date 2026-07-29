import { SUBJECTS, DOCUMENTS } from "../../lib/data";
import { buildKnowledgeGraph } from "../models/knowledge";
import { delay } from "../state/requestState";

export async function keywordSearch(query, options) {
  await delay(300 + Math.random() * 200);

  const q = query.toLowerCase().trim();
  if (!q) return { results: [], totalCount: 0, query };

  const results = [];
  const subjectId = options?.subjectId;

  const subjects = subjectId
    ? SUBJECTS.filter((s) => s.id === subjectId)
    : SUBJECTS;

  for (const subject of subjects) {
    const docs = DOCUMENTS[subject.id] ?? [];
    for (const doc of docs) {
      const titleMatch = doc.title.toLowerCase().includes(q);
      const tagMatch = doc.tags.some((t) => t.toLowerCase().includes(q));

      if (titleMatch || tagMatch) {
        results.push({
          type: "document",
          entityId: doc.id,
          subjectId: subject.id,
          title: doc.title,
          snippet: `Found in ${titleMatch ? "title" : "tags"}: ${doc.title}`,
          score: titleMatch ? 0.95 : 0.75,
          page: null,
          section: null,
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  const limit = options?.limit ?? 20;

  return {
    results: results.slice(0, limit),
    totalCount: results.length,
    query,
  };
}

export async function topicSearch(query, options) {
  await delay(400 + Math.random() * 300);

  const q = query.toLowerCase().trim();
  const graph = buildKnowledgeGraph();
  const results = [];

  for (const topic of Object.values(graph.topics)) {
    if (options?.subjectId && topic.subjectId !== options.subjectId) continue;

    if (topic.name.toLowerCase().includes(q)) {
      results.push({
        type: "topic",
        entityId: topic.id,
        subjectId: topic.subjectId,
        title: topic.name,
        snippet: `Topic covered in ${topic.documentIds.length} document(s)`,
        score: 0.9,
        relatedTopics: topic.relatedTopics,
        documentIds: topic.documentIds,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return {
    results: results.slice(0, options?.limit ?? 20),
    totalCount: results.length,
    query,
  };
}

export async function crossDocumentSearch(query, options) {
  await delay(500 + Math.random() * 400);

  const q = query.toLowerCase().trim();
  const results = [];
  const subjectId = options?.subjectId;

  const subjectsToSearch = subjectId
    ? SUBJECTS.filter((s) => s.id === subjectId)
    : SUBJECTS;

  for (const subject of subjectsToSearch) {
    const docs = DOCUMENTS[subject.id] ?? [];
    const matchingDocs = docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );

    if (matchingDocs.length > 1) {
      results.push({
        type: "cross-document",
        subjectId: subject.id,
        subjectTitle: subject.title,
        query: q,
        matchingDocuments: matchingDocs.map((d) => ({
          id: d.id,
          title: d.title,
          relevance: 0.7 + Math.random() * 0.25,
        })),
        totalMatches: matchingDocs.length,
      });
    }
  }

  return {
    results,
    totalCount: results.length,
    query,
  };
}

export async function relatedConcepts(conceptName, subjectId) {
  await delay(300 + Math.random() * 200);

  const graph = buildKnowledgeGraph();
  const q = conceptName.toLowerCase();
  const related = [];

  for (const topic of Object.values(graph.topics)) {
    if (subjectId && topic.subjectId !== subjectId) continue;
    if (topic.name.toLowerCase() === q) {
      for (const relId of topic.relatedTopics) {
        const relTopic = graph.topics[relId];
        if (relTopic) {
          related.push({
            id: relTopic.id,
            name: relTopic.name,
            subjectId: relTopic.subjectId,
            strength: 0.5 + Math.random() * 0.4,
          });
        }
      }
    }
  }

  return { concept: conceptName, related };
}

export async function vectorSearch(_query, _options) {
  return {
    results: [],
    totalCount: 0,
    query: _query,
    status: "not-implemented",
    message: "Vector search requires a vector database backend.",
  };
}

export async function hybridSearch(_query, _options) {
  return {
    results: [],
    totalCount: 0,
    query: _query,
    status: "not-implemented",
    message: "Hybrid search requires both keyword and vector backends.",
  };
}
