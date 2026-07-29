const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (d) => new Date(Date.now() - d * DAY_MS).toISOString();
const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

const SEED_ACTIVITIES = [
  { id: "act-1", action: "opened", target: "ER Diagrams & Normalization", targetType: "document", subjectId: "dbms", documentId: "doc-dbms-1", timestamp: hoursAgo(1) },
  { id: "act-2", action: "favorited", target: "Linear Regression Deep Dive", targetType: "document", subjectId: "machine-learning", documentId: "doc-ml-1", timestamp: hoursAgo(3) },
  { id: "act-3", action: "uploaded", target: "Neural Networks Presentation", targetType: "document", subjectId: "machine-learning", documentId: "doc-ml-3", timestamp: hoursAgo(5) },
  { id: "act-4", action: "opened", target: "OSI Model Overview", targetType: "document", subjectId: "computer-networks", documentId: "doc-cn-1", timestamp: hoursAgo(8) },
  { id: "act-5", action: "created", target: "DBMS", targetType: "subject", subjectId: "dbms", timestamp: daysAgo(1) },
  { id: "act-6", action: "pinned_note", target: "1NF eliminates repeating groups", targetType: "note", subjectId: "dbms", documentId: "doc-dbms-1", noteId: "note-1", timestamp: daysAgo(1) },
  { id: "act-7", action: "opened", target: "Process Scheduling Algorithms", targetType: "document", subjectId: "operating-systems", documentId: "doc-os-1", timestamp: daysAgo(1) },
  { id: "act-8", action: "favorited", target: "Memory Management Cheat Sheet", targetType: "document", subjectId: "operating-systems", documentId: "doc-os-2", timestamp: daysAgo(2) },
  { id: "act-9", action: "uploaded", target: "SQL Practice Problems", targetType: "document", subjectId: "dbms", documentId: "doc-dbms-2", timestamp: daysAgo(3) },
  { id: "act-10", action: "opened", target: "K-Means Clustering Notes", targetType: "document", subjectId: "machine-learning", documentId: "doc-ml-2", timestamp: daysAgo(4) },
  { id: "act-11", action: "created", target: "Machine Learning", targetType: "subject", subjectId: "machine-learning", timestamp: daysAgo(5) },
  { id: "act-12", action: "opened", target: "Mid-Semester Consolidated Notes", targetType: "document", subjectId: "semester-notes", documentId: "doc-sn-1", timestamp: daysAgo(7) },
];

let activities = null;

function init() {
  if (!activities) {
    activities = SEED_ACTIVITIES.map((a) => ({ ...a }));
  }
}

export function logActivity(action, target, metadata = {}) {
  init();
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
  return { ...entry };
}

export function getRecentActivities(limit = 20) {
  init();
  return activities.slice(0, limit).map((a) => ({ ...a }));
}

export function getActivitiesByType(actionType, limit = 20) {
  init();
  return activities
    .filter((a) => a.action === actionType)
    .slice(0, limit)
    .map((a) => ({ ...a }));
}

export function getActivitiesBySubject(subjectId, limit = 10) {
  init();
  return activities
    .filter((a) => a.subjectId === subjectId)
    .slice(0, limit)
    .map((a) => ({ ...a }));
}

export function getAllActivities() {
  init();
  return activities.map((a) => ({ ...a }));
}
