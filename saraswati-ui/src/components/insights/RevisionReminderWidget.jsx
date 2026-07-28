import { Bell } from "lucide-react";
import InsightCard from "./InsightCard";

/**
 * Shows upcoming revision reminders and overdue topics.
 */
function RevisionReminderWidget({ reminder }) {
  if (!reminder) return null;

  return (
    <InsightCard title="Revision Reminder" icon={Bell}>
      <div className="flex flex-col gap-2">
        <p className="text-[12px] text-ink-soft">{reminder.nextReview}</p>
        {reminder.overdueCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            <span className="text-[11px] text-red-400">
              {reminder.overdueCount} overdue — {reminder.overdueTopic}
            </span>
          </div>
        )}
        {reminder.overdueCount === 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-emerald-400">All up to date</span>
          </div>
        )}
      </div>
    </InsightCard>
  );
}

export default RevisionReminderWidget;
