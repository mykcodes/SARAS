import { Lightbulb } from "lucide-react";
import InsightCard from "./InsightCard";

function RecommendedNextWidget({ recommendation }) {
  if (!recommendation) return null;

  return (
    <InsightCard title="Recommended Next" icon={Lightbulb}>
      <p className="text-[12.5px] leading-relaxed text-ink-soft">
        {recommendation}
      </p>
    </InsightCard>
  );
}

export default RecommendedNextWidget;
