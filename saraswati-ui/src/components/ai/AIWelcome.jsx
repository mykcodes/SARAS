import { Sparkles } from "lucide-react";
import QuickActions from "./QuickActions";
import { useAI } from "../../context/AIContext";
import { getSuggestedPrompts } from "../../services/aiService";

/**
 * Premium welcome state for the AI panel.
 * Shows branding, suggested prompts, and quick actions.
 */
function AIWelcome() {
  const { sendUserMessage, contextMode } = useAI();
  const prompts = getSuggestedPrompts(contextMode);

  return (
    <div className="flex flex-1 flex-col gap-5 px-3 py-4">
      {/* Branding */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/8">
          <Sparkles size={24} className="text-gold" />
        </span>
        <div className="text-center">
          <h3 className="text-[15px] font-semibold text-ink">SARASWATI AI</h3>
          <p className="mt-1 max-w-[200px] text-[11.5px] leading-relaxed text-ink-faint">
            Your intelligent study assistant. Ask questions, generate summaries, and explore concepts.
          </p>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-col gap-2">
        <span className="px-1 text-[10.5px] font-medium uppercase tracking-wider text-ink-faint">
          Suggested
        </span>
        <div className="flex flex-col gap-1">
          {prompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => sendUserMessage(prompt)}
              className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-left text-[11.5px] text-ink-soft transition-colors hover:border-border-default hover:bg-surface-hover hover:text-ink"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}

export default AIWelcome;
