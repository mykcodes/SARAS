import { storageManager } from "./storageManager";
import { logActivity } from "./activityService";
import { moveToTrash } from "./trashService";

export function getSubjects() {
  return storageManager.getItem("subjects", []);
}

export function getSubjectById(id) {
  const subjects = getSubjects();
  return subjects.find((s) => s.id === id) || null;
}

export function createSubject(data) {
  const subjects = getSubjects();
  
  if (subjects.some((s) => s.title.toLowerCase() === data.title.toLowerCase())) {
    throw new Error(`A subject named "${data.title}" already exists.`);
  }

  const newSubject = {
    id: `subj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: data.title,
    description: data.description || "",
    color: data.color || "#D9A441",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fileCount: 0,
    storageUsed: 0,
    tags: [],
    aiMeta: { status: "pending", lastIndexed: null },
    favorite: false,
  };

  subjects.unshift(newSubject);
  storageManager.setItem("subjects", subjects);

  // Initialize insights for the new subject
  const insights = storageManager.getItem("workspace_insights", {});
  insights[newSubject.id] = {
    studyProgress: 0,
    topicsCovered: [],
    lastStudySession: null,
    examReadiness: 0,
    recentActivity: [],
    aiIndexStatus: { indexed: 0, total: 0, lastRun: null },
    recommendedNext: "Start by adding documents to this subject.",
    recentUploads: [],
  };
  storageManager.setItem("workspace_insights", insights);

  logActivity("created", newSubject.title, { targetType: "subject", subjectId: newSubject.id });
  
  return newSubject;
}

export function updateSubject(id, updates) {
  const subjects = getSubjects();
  const index = subjects.findIndex((s) => s.id === id);
  
  if (index === -1) return null;

  if (updates.title && updates.title !== subjects[index].title) {
    if (subjects.some((s) => s.id !== id && s.title.toLowerCase() === updates.title.toLowerCase())) {
      throw new Error(`A subject named "${updates.title}" already exists.`);
    }
  }

  const updatedSubject = {
    ...subjects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  subjects[index] = updatedSubject;
  storageManager.setItem("subjects", subjects);
  return updatedSubject;
}

export function deleteSubject(id) {
  const subjects = getSubjects();
  const subject = subjects.find((s) => s.id === id);
  if (!subject) return false;

  // Move to trash
  moveToTrash({ ...subject, targetType: "subject" });

  const newSubjects = subjects.filter((s) => s.id !== id);
  storageManager.setItem("subjects", newSubjects);

  logActivity("deleted", subject.title, { targetType: "subject", subjectId: id });
  return true;
}

export function favoriteSubject(id) {
  const subject = getSubjectById(id);
  if (subject) {
    updateSubject(id, { favorite: !subject.favorite });
    if (!subject.favorite) {
      logActivity("favorited", subject.title, { targetType: "subject", subjectId: id });
    }
    return !subject.favorite;
  }
  return false;
}
