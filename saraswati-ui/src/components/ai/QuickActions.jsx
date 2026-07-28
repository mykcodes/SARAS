import {
  FileText,
  Layers,
  HelpCircle,
  Lightbulb,
  Target,
  GitCompare,
  Network,
  Sigma,
  BookOpen,
} from "lucide-react";
import { useAI } from "../../context/AIContext";
import { ACTIONS } from "../../services/commandRegistry";

const ICON_MAP = {
  FileText,
  Layers,
  HelpCircle,
  Lightbulb,
  Target,
  GitCompare,
  Network,
  Sigma,
  BookOpen,
};

/**
 * Grid of intelligent shortcut actions displayed in the welcome state.
 * Pulls from the central command registry so future command palette
 * and quick actions share the same definitions.
 */
function QuickActions() {
  const { sendUserMessage } = useAI();

  const aiActions = ACTIONS.filter((a) => a.category === "ai");

  const handleAction = (action) => {
    if (action.disabled) return;
    sendUserMessage(action.label);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="px-1 text-[10.5px] font-medium uppercase tracking-wider text-ink-faint">
        Quick Actions
      </span>
      <div className="grid grid-cols-2 gap-1.5">
        {aiActions.map((action) => {
          const Icon = ICON_MAP[action.icon];
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              className="group flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-2.5 py-2 text-left transition-colors hover:border-border-default hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {Icon && (
                <Icon
                  size={13}
                  className="shrink-0 text-ink-faint transition-colors group-hover:text-gold"
                />
              )}
              <span className="truncate text-[11px] text-ink-soft group-hover:text-ink">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
