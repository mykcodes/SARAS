import { Sparkles } from "lucide-react";
import InsightCard from "./InsightCard";

/**
 * Shows AI usage statistics: total questions, avg per session.
 */
function AIUsageWidget({ usage }) {
  if (!usage) return null;

  return (
    <InsightCard title="AI Usage" icon={Sparkles}>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center rounded-lg border border-border-subtle bg-surface-soft p-2.5">
          <span className="text-[16px] font-semibold text-gold">{usage.totalQuestions}</span>
          <span className="text-[10px] text-ink-faint">Questions</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border border-border-subtle bg-surface-soft p-2.5">
          <span className="text-[16px] font-semibold text-ink">{usage.avgPerSession}</span>
          <span className="text-[10px] text-ink-faint">Avg / Session</span>
        </div>
      </div>
    </InsightCard>
  );
}

export default AIUsageWidget;
