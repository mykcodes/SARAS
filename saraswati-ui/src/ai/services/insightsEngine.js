import { getInsightsBySubjectId, getExtendedInsightsBySubjectId, SUBJECTS, DOCUMENTS } from "../../lib/data";

export function computeStudyProgress(subjectId) {
  const insights = getInsightsBySubjectId(subjectId);
  if (!insights) return 0;
  return insights.studyProgress;
}

export function detectWeakAreas(subjectId) {
  const extended = getExtendedInsightsBySubjectId(subjectId);
  if (!extended?.weakTopics) return [];
  return extended.weakTopics.map((t) => ({
    topic: t.name,
    confidence: t.confidence,
    severity: t.confidence < 25 ? "critical" : t.confidence < 40 ? "moderate" : "low",
    recommendation: `Focus on ${t.name} — your confidence is at ${t.confidence}%.`,
  }));
}

export function computeFrequentlyVisitedTopics(subjectId) {
  const extended = getExtendedInsightsBySubjectId(subjectId);
  return extended?.frequentConcepts ?? [];
}

export function computeExamReadiness(subjectId) {
  const insights = getInsightsBySubjectId(subjectId);
  if (!insights) return { score: 0, level: "not-started", recommendation: "" };

  const score = insights.examReadiness;
  let level = "not-started";
  let recommendation = "";

  if (score >= 80) {
    level = "ready";
    recommendation = "You're well-prepared. Focus on edge cases and quick revision.";
  } else if (score >= 60) {
    level = "moderate";
    recommendation = "Good progress. Strengthen weak areas before the exam.";
  } else if (score >= 30) {
    level = "needs-work";
    recommendation = "Significant gaps remain. Prioritize core concepts.";
  } else {
    level = "critical";
    recommendation = "Urgent attention needed. Start with foundational topics.";
  }

  return { score, level, recommendation };
}

export function getRecommendedRevision(subjectId) {
  const extended = getExtendedInsightsBySubjectId(subjectId);
  if (!extended?.revisionReminder) return null;

  const reminder = extended.revisionReminder;
  return {
    nextReview: reminder.nextReview,
    overdueCount: reminder.overdueCount,
    overdueTopic: reminder.overdueTopic,
    urgency: reminder.overdueCount > 2 ? "high" : reminder.overdueCount > 0 ? "medium" : "low",
  };
}

export function computeLearningStreak(subjectId) {
  const extended = getExtendedInsightsBySubjectId(subjectId);
  if (!extended?.studyStreak) return { currentDays: 0, longestDays: 0, active: false };

  return {
    ...extended.studyStreak,
    active: extended.studyStreak.currentDays > 0,
  };
}

export function computeStudyDistribution(subjectId) {
  const extended = getExtendedInsightsBySubjectId(subjectId);
  if (!extended?.readingTime) return { totalMinutes: 0, avgPerDoc: 0, lastSession: 0, distribution: [] };

  const docs = DOCUMENTS[subjectId] ?? [];
  const distribution = docs.map((doc) => ({
    documentId: doc.id,
    documentTitle: doc.title,
    estimatedMinutes: Math.floor(extended.readingTime.avgPerDoc * (0.5 + Math.random())),
  }));

  return {
    ...extended.readingTime,
    distribution,
  };
}

export function computeReadingTime(subjectId) {
  const extended = getExtendedInsightsBySubjectId(subjectId);
  return extended?.readingTime ?? { totalMinutes: 0, avgPerDoc: 0, lastSession: 0 };
}

export function computeKnowledgeCoverage(subjectId) {
  const insights = getInsightsBySubjectId(subjectId);
  if (!insights?.topicsCovered) return { covered: 0, total: 0, percentage: 0, topics: [] };

  const topics = insights.topicsCovered;
  const covered = topics.filter((t) => t.covered).length;

  return {
    covered,
    total: topics.length,
    percentage: topics.length > 0 ? Math.round((covered / topics.length) * 100) : 0,
    topics,
  };
}

export function computeAIUsage(subjectId) {
  const extended = getExtendedInsightsBySubjectId(subjectId);
  return extended?.aiUsage ?? { totalQuestions: 0, avgPerSession: 0, lastUsed: null };
}

export function getFullComputedInsights(subjectId) {
  const base = getInsightsBySubjectId(subjectId);
  const extended = getExtendedInsightsBySubjectId(subjectId);
  if (!base) return null;

  return {
    ...base,
    ...(extended ?? {}),
    computed: {
      weakAreas: detectWeakAreas(subjectId),
      examReadiness: computeExamReadiness(subjectId),
      revision: getRecommendedRevision(subjectId),
      streak: computeLearningStreak(subjectId),
      distribution: computeStudyDistribution(subjectId),
      coverage: computeKnowledgeCoverage(subjectId),
      aiUsage: computeAIUsage(subjectId),
    },
  };
}

export function getGlobalInsightsSummary() {
  return SUBJECTS.map((subject) => ({
    subjectId: subject.id,
    subjectTitle: subject.title,
    progress: computeStudyProgress(subject.id),
    examReadiness: computeExamReadiness(subject.id),
    weakAreaCount: detectWeakAreas(subject.id).length,
    streak: computeLearningStreak(subject.id),
  }));
}
