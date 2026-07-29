import { storageManager } from "./storageManager";

export function logActivity(action, target, metadata = {}) {
  const activities = storageManager.getItem("activities", []);
  
  const entry = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    action,
    target,
    targetType: metadata.targetType || "document",
    subjectId: metadata.subjectId || null,
    documentId: metadata.documentId || null,
    noteId: metadata.noteId || null,
    timestamp: new Date().toISOString(),
  };
  
  activities.unshift(entry);
  storageManager.setItem("activities", activities);
  
  return { ...entry };
}

export function getRecentActivities(limit = 20) {
  const activities = storageManager.getItem("activities", []);
  return activities.slice(0, limit);
}

export function getActivitiesByType(actionType, limit = 20) {
  const activities = storageManager.getItem("activities", []);
  return activities
    .filter((a) => a.action === actionType)
    .slice(0, limit);
}

export function getActivitiesBySubject(subjectId, limit = 10) {
  const activities = storageManager.getItem("activities", []);
  return activities
    .filter((a) => a.subjectId === subjectId)
    .slice(0, limit);
}

export function getAllActivities() {
  return storageManager.getItem("activities", []);
}

