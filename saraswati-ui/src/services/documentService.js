import { storageManager } from "./storageManager";
import { logActivity } from "./activityService";
import { moveToTrash } from "./trashService";

export function getDocuments() {
  return storageManager.getItem("documents", []);
}

export function getDocumentsBySubjectId(subjectId) {
  const docs = getDocuments();
  return docs.filter((d) => d.subjectId === subjectId);
}

export function getDocumentById(subjectId, documentId) {
  const docs = getDocuments();
  return docs.find((d) => d.id === documentId && d.subjectId === subjectId) || null;
}

export function uploadDocument(subjectId, fileMetadata) {
  const docs = getDocuments();
  
  const newDoc = {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    subjectId,
    title: fileMetadata.title,
    type: fileMetadata.type,
    size: fileMetadata.size || 0,
    pages: fileMetadata.pages || 1,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastOpened: new Date().toISOString(),
    favorite: false,
    indexed: false,
    thumbnailPlaceholder: null,
    embeddingStatus: "pending",
    summary: null,
    tags: [],
  };

  docs.unshift(newDoc);
  storageManager.setItem("documents", docs);

  // Update subject file count
  const subjects = storageManager.getItem("subjects", []);
  const subjIndex = subjects.findIndex(s => s.id === subjectId);
  if (subjIndex !== -1) {
    subjects[subjIndex].fileCount += 1;
    subjects[subjIndex].storageUsed += newDoc.size;
    storageManager.setItem("subjects", subjects);
  }

  logActivity("uploaded", newDoc.title, { targetType: "document", subjectId, documentId: newDoc.id });

  return newDoc;
}

export function updateDocument(subjectId, documentId, updates) {
  const docs = getDocuments();
  const index = docs.findIndex((d) => d.id === documentId && d.subjectId === subjectId);
  
  if (index === -1) return null;

  const updatedDoc = {
    ...docs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  docs[index] = updatedDoc;
  storageManager.setItem("documents", docs);
  return updatedDoc;
}

export function deleteDocument(subjectId, documentId) {
  const docs = getDocuments();
  const docIndex = docs.findIndex((d) => d.id === documentId && d.subjectId === subjectId);
  if (docIndex === -1) return false;

  const doc = docs[docIndex];
  
  // Move to trash
  moveToTrash({ ...doc, targetType: "document" });

  const newDocs = docs.filter((d) => !(d.id === documentId && d.subjectId === subjectId));
  storageManager.setItem("documents", newDocs);

  // Update subject file count
  const subjects = storageManager.getItem("subjects", []);
  const subjIndex = subjects.findIndex(s => s.id === subjectId);
  if (subjIndex !== -1) {
    subjects[subjIndex].fileCount = Math.max(0, subjects[subjIndex].fileCount - 1);
    subjects[subjIndex].storageUsed = Math.max(0, subjects[subjIndex].storageUsed - doc.size);
    storageManager.setItem("subjects", subjects);
  }

  logActivity("deleted", doc.title, { targetType: "document", subjectId, documentId });
  return true;
}

export function favoriteDocument(subjectId, documentId) {
  const doc = getDocumentById(subjectId, documentId);
  if (doc) {
    updateDocument(subjectId, documentId, { favorite: !doc.favorite });
    if (!doc.favorite) {
      logActivity("favorited", doc.title, { targetType: "document", subjectId, documentId });
    }
    return !doc.favorite;
  }
  return false;
}
