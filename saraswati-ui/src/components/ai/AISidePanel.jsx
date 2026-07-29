import { Sparkles, X } from "lucide-react";
import { useAI } from "../../context/AIContext";
import AIPanel from "./AIPanel";

/**
 * Global slide-over drawer that hosts the AI assistant.
 * Opens from the right edge of the screen when triggered
 * (e.g. via the "Ask SARASWATI" floating action button).
 *
 * Rendered once at the AppLayout level so it's available on
 * every route (Home, Subjects, Subject workspace, etc).
 */
function AISidePanel() {
  const { isPanelOpen, closePanel } = useAI();

  if (!isPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-overlay fixed inset-0 z-40 bg-black/50"
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="ai-drawer fixed inset-y-0 right-0 z-50 flex w-[360px] max-w-[90vw] flex-col border-l border-border-subtle bg-bg-elevated shadow-2xl"
        role="dialog"
        aria-label="Ask SARASWATI"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full gold-gradient-bg">
              <Sparkles size={14} strokeWidth={2.2} className="text-bg" />
            </span>
            <span className="text-[14px] font-semibold text-ink">Ask SARASWATI</span>
          </div>
          <button
            type="button"
            onClick={closePanel}
            className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body reuses the existing tabbed AI panel (AI / Notes / Bookmarks) */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <AIPanel />
        </div>
      </aside>
    </>
  );
}

export default AISidePanel;