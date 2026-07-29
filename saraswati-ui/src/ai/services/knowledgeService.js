import { buildKnowledgeGraph, getEntityById } from "../models/knowledge";
import { DOCUMENTS } from "../../lib/data";

export function getTopicsForSubject(subjectId) {
  const graph = buildKnowledgeGraph();
  return Object.values(graph.topics).filter((t) => t.subjectId === subjectId);
}

export function getTopicsForDocument(documentId, subjectId) {
  const docs = DOCUMENTS[subjectId] ?? [];
  const doc = docs.find((d) => d.id === documentId);
  if (!doc) return [];

  const graph = buildKnowledgeGraph();
  return Object.values(graph.topics).filter((t) =>
    t.documentIds.includes(documentId)
  );
}

export function getDefinitionsForDocument(documentId, subjectId) {
  const docs = DOCUMENTS[subjectId] ?? [];
  const doc = docs.find((d) => d.id === documentId);
  if (!doc) return [];

  const tagDefinitions = {
    normalization: { term: "Normalization", definition: "The process of organizing data to reduce redundancy and improve data integrity." },
    "er-diagrams": { term: "ER Diagram", definition: "A visual representation of entities and their relationships in a database." },
    sql: { term: "SQL", definition: "Structured Query Language used to manage and manipulate relational databases." },
    practice: { term: "Practice Problems", definition: "Exercises designed to reinforce understanding of core concepts." },
    transactions: { term: "Transaction", definition: "A sequence of operations performed as a single logical unit of work." },
    acid: { term: "ACID Properties", definition: "Atomicity, Consistency, Isolation, Durability — guarantees for database transactions." },
    osi: { term: "OSI Model", definition: "A conceptual framework with seven layers that standardizes network communication." },
    layers: { term: "Network Layers", definition: "Hierarchical divisions that separate network functionality into manageable components." },
    topology: { term: "Network Topology", definition: "The arrangement of nodes and connections in a computer network." },
    regression: { term: "Linear Regression", definition: "A supervised learning algorithm that models the relationship between variables." },
    supervised: { term: "Supervised Learning", definition: "Machine learning trained on labeled data to predict outcomes." },
    clustering: { term: "Clustering", definition: "Unsupervised grouping of data points based on similarity." },
    unsupervised: { term: "Unsupervised Learning", definition: "Machine learning that finds patterns in unlabeled data." },
    "neural-networks": { term: "Neural Network", definition: "A computing system inspired by biological neural networks." },
    "deep-learning": { term: "Deep Learning", definition: "A subset of ML using multi-layer neural networks for representation learning." },
    scheduling: { term: "Process Scheduling", definition: "The method by which processes are assigned to CPU for execution." },
    processes: { term: "Process", definition: "A program in execution with its own memory space and resources." },
    memory: { term: "Memory Management", definition: "OS functions that handle allocation and deallocation of memory." },
    paging: { term: "Paging", definition: "A memory management scheme that eliminates the need for contiguous allocation." },
    revision: { term: "Revision", definition: "Systematic review of previously studied material for reinforcement." },
    consolidated: { term: "Consolidated Notes", definition: "Combined study material drawn from multiple sources." },
  };

  return doc.tags
    .filter((tag) => tagDefinitions[tag])
    .map((tag) => ({
      entityType: "definition",
      id: `def-${documentId}-${tag}`,
      documentId,
      ...tagDefinitions[tag],
      page: Math.floor(Math.random() * (doc.pages ?? 10)) + 1,
    }));
}

export function getRelatedConcepts(topicId) {
  const graph = buildKnowledgeGraph();
  const topic = graph.topics[topicId];
  if (!topic) return [];

  return topic.relatedTopics
    .map((id) => graph.topics[id])
    .filter(Boolean);
}

export function getDocumentEntities(subjectId) {
  const graph = buildKnowledgeGraph();
  return Object.values(graph.documents).filter((d) => d.subjectId === subjectId);
}

export function getSubjectEntities() {
  const graph = buildKnowledgeGraph();
  return Object.values(graph.subjects);
}

export function getRelationships(entityId) {
  const graph = buildKnowledgeGraph();
  return graph.relationships.filter(
    (r) => r.sourceId === entityId || r.targetId === entityId
  );
}

export function resolveEntity(entityId) {
  return getEntityById(entityId);
}
