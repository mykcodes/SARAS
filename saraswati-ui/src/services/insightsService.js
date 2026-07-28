/**
 * Insights Service — mock implementation.
 *
 * Merges existing workspace insights with extended insight data.
 * When real analytics are available, swap the internals.
 */
import { getInsightsBySubjectId, getExtendedInsightsBySubjectId } from "../lib/data";

export function getFullInsights(subjectId) {
  const base = getInsightsBySubjectId(subjectId);
  const extended = getExtendedInsightsBySubjectId(subjectId);

  if (!base) return null;

  return {
    ...base,
    ...(extended ?? {}),
  };
}
