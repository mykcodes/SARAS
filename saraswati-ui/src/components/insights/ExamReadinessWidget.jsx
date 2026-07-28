import { Target } from "lucide-react";
import InsightCard from "./InsightCard";

function ExamReadinessWidget({ readiness }) {
  const getColor = () => {
    if (readiness >= 75) return "bg-emerald-400";
    if (readiness >= 50) return "bg-gold";
    return "bg-red-400";
  };

  const getMessage = () => {
    if (readiness >= 75) return "You're well prepared.";
    if (readiness >= 50) return "Getting there — keep studying.";
    if (readiness >= 25) return "Needs more revision.";
    return "Just getting started.";
  };

  return (
    <InsightCard title="Exam Readiness" icon={Target}>
      <div className="flex items-center gap-3">
        <span className="text-[20px] font-bold text-ink">{readiness}%</span>
        <span className="text-[11.5px] text-ink-soft">{getMessage()}</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-hover">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${readiness}%` }}
        />
      </div>
    </InsightCard>
  );
}

export default ExamReadinessWidget;
