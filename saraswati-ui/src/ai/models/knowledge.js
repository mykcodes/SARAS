import { SUBJECTS, DOCUMENTS } from "../../lib/data";

function createId(...segments) {
  return segments.filter(Boolean).join("::");
}

export function createSubjectEntity(subject) {
  return {
    entityType: "subject",
    id: createId("subject", subject.id),
    sourceId: subject.id,
    title: subject.title,
    description: subject.description,
    metadata: {
      color: subject.color,
      fileCount: subject.fileCount,
      storageUsed: subject.storageUsed,
      aiMeta: subject.aiMeta,
    },
    children: [],
    relationships: [],
    createdAt: subject.createdAt,
    updatedAt: subject.updatedAt,
  };
}

export function createDocumentEntity(doc, subjectId) {
  return {
    entityType: "document",
    id: createId("doc", subjectId, doc.id),
    sourceId: doc.id,
    subjectId,
    title: doc.title,
    type: doc.type,
    metadata: {
      size: doc.size,
      pages: doc.pages,
      embeddingStatus: doc.embeddingStatus,
      indexed: doc.indexed,
      tags: doc.tags,
    },
    children: [],
    relationships: [],
    createdAt: doc.uploadedAt,
    updatedAt: doc.updatedAt,
  };
}

export function createPageEntity(documentId, pageNumber, totalPages) {
  return {
    entityType: "page",
    id: createId("page", documentId, String(pageNumber)),
    documentId,
    pageNumber,
    totalPages,
    paragraphs: [],
    sections: [],
    images: [],
    tables: [],
  };
}

export function createParagraphEntity(pageId, index, text) {
  return {
    entityType: "paragraph",
    id: createId("para", pageId, String(index)),
    pageId,
    index,
    text,
  };
}

export function createSectionEntity(documentId, title, startPage, endPage) {
  return {
    entityType: "section",
    id: createId("section", documentId, title.toLowerCase().replace(/\s+/g, "-")),
    documentId,
    title,
    startPage,
    endPage,
  };
}

export function createImageEntity(pageId, index, caption) {
  return {
    entityType: "image",
    id: createId("img", pageId, String(index)),
    pageId,
    index,
    caption,
    ocrText: null,
    boundingBox: null,
  };
}

export function createTableEntity(pageId, index, headers) {
  return {
    entityType: "table",
    id: createId("table", pageId, String(index)),
    pageId,
    index,
    headers,
    rows: [],
    extractedAt: null,
  };
}

export function createDefinitionEntity(documentId, term, definition, page) {
  return {
    entityType: "definition",
    id: createId("def", documentId, term.toLowerCase().replace(/\s+/g, "-")),
    documentId,
    term,
    definition,
    page,
  };
}

export function createFormulaEntity(documentId, expression, label, page) {
  return {
    entityType: "formula",
    id: createId("formula", documentId, label.toLowerCase().replace(/\s+/g, "-")),
    documentId,
    expression,
    label,
    page,
  };
}

export function createTopicEntity(id, name, subjectId, documentIds, confidence) {
  return {
    entityType: "topic",
    id: createId("topic", subjectId, id),
    name,
    subjectId,
    documentIds,
    confidence,
    relatedTopics: [],
  };
}

export function createRelationship(sourceId, targetId, type, weight) {
  return {
    id: createId("rel", sourceId, targetId),
    sourceId,
    targetId,
    type,
    weight: weight ?? 1.0,
  };
}

let cachedGraph = null;

export function buildKnowledgeGraph() {
  if (cachedGraph) return cachedGraph;

  const subjects = {};
  const documents = {};
  const topics = {};
  const relationships = [];

  for (const subject of SUBJECTS) {
    const subjectEntity = createSubjectEntity(subject);
    subjects[subjectEntity.id] = subjectEntity;

    const docs = DOCUMENTS[subject.id] ?? [];
    for (const doc of docs) {
      const docEntity = createDocumentEntity(doc, subject.id);
      documents[docEntity.id] = docEntity;
      subjectEntity.children.push(docEntity.id);

      for (const tag of doc.tags) {
        const topicId = createId("topic", subject.id, tag);
        if (!topics[topicId]) {
          topics[topicId] = createTopicEntity(tag, tag, subject.id, [doc.id], 0.75);
        } else {
          topics[topicId].documentIds.push(doc.id);
        }

        relationships.push(
          createRelationship(docEntity.id, topicId, "covers", 0.8)
        );
      }

      relationships.push(
        createRelationship(subjectEntity.id, docEntity.id, "contains", 1.0)
      );
    }
  }

  const topicList = Object.values(topics);
  for (let i = 0; i < topicList.length; i++) {
    for (let j = i + 1; j < topicList.length; j++) {
      if (topicList[i].subjectId === topicList[j].subjectId) {
        const shared = topicList[i].documentIds.filter((d) =>
          topicList[j].documentIds.includes(d)
        );
        if (shared.length > 0) {
          topicList[i].relatedTopics.push(topicList[j].id);
          topicList[j].relatedTopics.push(topicList[i].id);
          relationships.push(
            createRelationship(topicList[i].id, topicList[j].id, "related", 0.5)
          );
        }
      }
    }
  }

  cachedGraph = { subjects, documents, topics, relationships };
  return cachedGraph;
}

export function getEntityById(entityId) {
  const graph = buildKnowledgeGraph();
  return (
    graph.subjects[entityId] ??
    graph.documents[entityId] ??
    graph.topics[entityId] ??
    null
  );
}
