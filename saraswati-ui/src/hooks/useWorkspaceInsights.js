import { getInsightsBySubjectId } from "../lib/data";

/**
 * Returns mock insight data for a given subject.
 *
 * When real analytics are available, swap the internals for a data fetch.
 * The return shape stays the same so consuming widgets don't change.
 */
function useWorkspaceInsights(subjectId) {
  const insights = getInsightsBySubjectId(subjectId);

  return {
    insights,
    isLoading: false,
  };
}

export default useWorkspaceInsights;
