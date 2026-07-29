import { storageManager } from "./storageManager";

export function moveToTrash(item) {
  const trashItems = storageManager.getItem("trash", []);
  const trashEntry = {
    ...item,
    trashId: `trash-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    deletedAt: new Date().toISOString(),
    originalLocation: {
      subjectId: item.subjectId || null,
      documentId: item.documentId || item.id || null,
    },
  };
  trashItems.unshift(trashEntry);
  storageManager.setItem("trash", trashItems);
  return { ...trashEntry };
}

export function getTrashItems() {
  return storageManager.getItem("trash", []);
}

export function restoreItem(trashId) {
  const trashItems = storageManager.getItem("trash", []);
  const idx = trashItems.findIndex((t) => t.trashId === trashId);
  if (idx === -1) return null;
  
  const [restored] = trashItems.splice(idx, 1);
  storageManager.setItem("trash", trashItems);

  // Put back in its collection
  if (restored.targetType === "subject") {
    const subjects = storageManager.getItem("subjects", []);
    // Remove trash specific keys
    const { trashId, deletedAt, originalLocation, ...subject } = restored;
    subjects.unshift(subject);
    storageManager.setItem("subjects", subjects);
  } else if (restored.targetType === "document") {
    const documents = storageManager.getItem("documents", []);
    const { trashId, deletedAt, originalLocation, ...doc } = restored;
    documents.unshift(doc);
    storageManager.setItem("documents", documents);
    
    // Update subject counts
    const subjects = storageManager.getItem("subjects", []);
    const subjIndex = subjects.findIndex(s => s.id === doc.subjectId);
    if (subjIndex !== -1) {
      subjects[subjIndex].fileCount += 1;
      subjects[subjIndex].storageUsed += doc.size || 0;
      storageManager.setItem("subjects", subjects);
    }
  }

  return restored;
}

export function permanentDelete(trashId) {
  const trashItems = storageManager.getItem("trash", []);
  const idx = trashItems.findIndex((t) => t.trashId === trashId);
  if (idx !== -1) {
    trashItems.splice(idx, 1);
    storageManager.setItem("trash", trashItems);
  }
}

export function emptyTrash() {
  const trashItems = storageManager.getItem("trash", []);
  const count = trashItems.length;
  storageManager.setItem("trash", []);
  return count;
}

export function getTrashCount() {
  return storageManager.getItem("trash", []).length;
}
