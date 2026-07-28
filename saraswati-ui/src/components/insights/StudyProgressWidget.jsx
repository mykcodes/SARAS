import { TrendingUp } from "lucide-react";
import InsightCard from "./InsightCard";

function StudyProgressWidget({ progress }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <InsightCard title="Study Progress" icon={TrendingUp}>
      <div className="flex items-center gap-4">
        {/* Circular progress */}
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--color-surface-hover)"
            strokeWidth="5"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="progress-ring-circle"
          />
          <text
            x="40"
            y="40"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-ink text-[14px] font-semibold"
          >
            {progress}%
          </text>
        </svg>
        <div>
          <p className="text-[12px] text-ink-soft">
            {progress >= 75
              ? "Great progress! Keep going."
              : progress >= 50
              ? "You're halfway there."
              : "Just getting started."}
          </p>
        </div>
      </div>
    </InsightCard>
  );
}

export default StudyProgressWidget;
