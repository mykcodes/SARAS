import { ChevronDown, FileText, BookOpen, Type, Layers, Lock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAI } from "../../context/AIContext";

const CONTEXT_OPTIONS = [
  { id: "subject", label: "Entire Subject", icon: BookOpen, disabled: false },
  { id: "document", label: "Current Document", icon: FileText, disabled: false },
  { id: "pages", label: "Selected Pages", icon: Layers, disabled: false, placeholder: true },
  { id: "highlighted", label: "Highlighted Text", icon: Type, disabled: false, placeholder: true },
  { id: "multi", label: "Multi-document", icon: Lock, disabled: true },
];

/**
 * Context selector dropdown above the AI conversation.
 * Lets users choose what scope the AI should reference.
 */
function ContextSelector() {
  const { contextMode, setContextMode } = useAI();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const active = CONTEXT_OPTIONS.find((o) => o.id === contextMode) ?? CONTEXT_OPTIONS[1];
  const ActiveIcon = active.icon;

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative px-3 pt-2.5 pb-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-lg border border-border-subtle bg-surface px-2.5 py-1.5 text-left transition-colors hover:border-border-default"
      >
        <ActiveIcon size={13} className="shrink-0 text-gold" />
        <span className="flex-1 truncate text-[11px] text-ink-soft">{active.label}</span>
        {active.placeholder && (
          <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[9px] font-medium text-gold">
            PLACEHOLDER
          </span>
        )}
        <ChevronDown size={12} className={`text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="modal-content absolute left-3 right-3 top-full z-20 mt-1 flex flex-col rounded-xl border border-border-default bg-surface p-1 shadow-xl">
          {CONTEXT_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  setContextMode(option.id);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11.5px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  contextMode === option.id
                    ? "bg-gold/8 text-gold"
                    : "text-ink-soft hover:bg-surface-hover hover:text-ink"
                }`}
              >
                <Icon size={13} className={contextMode === option.id ? "text-gold" : "text-ink-faint"} />
                <span className="flex-1">{option.label}</span>
                {option.placeholder && (
                  <span className="rounded bg-surface-hover px-1.5 py-0.5 text-[9px] text-ink-faint">
                    Placeholder
                  </span>
                )}
                {option.disabled && (
                  <span className="rounded bg-surface-hover px-1.5 py-0.5 text-[9px] text-ink-faint">
                    Coming Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ContextSelector;
