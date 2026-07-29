import { X, Sparkles } from "lucide-react";
import StudyProgressWidget from "./StudyProgressWidget";
import TopicsCoveredWidget from "./TopicsCoveredWidget";
import ExamReadinessWidget from "./ExamReadinessWidget";
import RecentActivityWidget from "./RecentActivityWidget";
import RecommendedNextWidget from "./RecommendedNextWidget";
import WeakTopicsWidget from "./WeakTopicsWidget";
import StudyStreakWidget from "./StudyStreakWidget";
import AIUsageWidget from "./AIUsageWidget";
import RevisionReminderWidget from "./RevisionReminderWidget";
import ReadingTimeWidget from "./ReadingTimeWidget";
import FrequentConceptsWidget from "./FrequentConceptsWidget";
import InsightCard from "./InsightCard";
import KnowledgeGraphPlaceholder from "../knowledge-graph/KnowledgeGraphPlaceholder";
import { useWorkspace } from "../../context/WorkspaceContext";
import { getFullInsights } from "../../services/insightsService";
import { formatRelativeTime } from "../../lib/formatters";

function InsightsPanel({ subjectId }) {
  const { insightsPanelOpen, toggleInsights } = useWorkspace();
  const insights = getFullInsights(subjectId);

  if (!insightsPanelOpen || !insights) return null;

  return (
    <aside className="slide-in-right flex w-[300px] shrink-0 flex-col gap-3 overflow-y-auto rounded-xl border border-border-subtle bg-bg-elevated p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[14px] font-semibold text-ink">
          <Sparkles size={15} className="text-gold" />
          Insights
        </h3>
        <button
          type="button"
          onClick={toggleInsights}
          className="rounded-md p-1 text-ink-faint transition-colors hover:text-ink"
          aria-label="Close insights"
        >
          <X size={16} />
        </button>
      </div>

      {/* Existing Widgets */}
      <StudyProgressWidget progress={insights.studyProgress} />
      <ExamReadinessWidget readiness={insights.examReadiness} />
      <TopicsCoveredWidget topics={insights.topicsCovered} />
      <RecommendedNextWidget recommendation={insights.recommendedNext} />
      <RecentActivityWidget activities={insights.recentActivity} subjectId={subjectId} />

      {/* New Widgets (Feature 6) */}
      <StudyStreakWidget streak={insights.studyStreak} />
      <WeakTopicsWidget topics={insights.weakTopics} />
      <RevisionReminderWidget reminder={insights.revisionReminder} />
      <ReadingTimeWidget readingTime={insights.readingTime} />
      <AIUsageWidget usage={insights.aiUsage} />
      <FrequentConceptsWidget concepts={insights.frequentConcepts} />

      {/* AI Index Status */}
      <InsightCard title="AI Index Status" icon={Sparkles}>
        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] text-ink-soft">
            {insights.aiIndexStatus.indexed} of {insights.aiIndexStatus.total} documents indexed
          </p>
          {insights.aiIndexStatus.lastRun && (
            <p className="text-[10.5px] text-ink-faint">
              Last run {formatRelativeTime(insights.aiIndexStatus.lastRun)}
            </p>
          )}
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{
                width: `${
                  insights.aiIndexStatus.total > 0
                    ? (insights.aiIndexStatus.indexed / insights.aiIndexStatus.total) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </InsightCard>

      {/* Last study session */}
      <InsightCard title="Last Study Session" icon={null}>
        <p className="text-[12.5px] text-ink-soft">
          {formatRelativeTime(insights.lastStudySession)}
        </p>
      </InsightCard>

      {/* Knowledge Graph Placeholder (Feature 7) */}
      <KnowledgeGraphPlaceholder />
    </aside>
  );
}

export default InsightsPanel;
