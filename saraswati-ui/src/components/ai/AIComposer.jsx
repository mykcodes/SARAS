import { useState } from "react";
import { Send } from "lucide-react";
import { useAI } from "../../context/AIContext";

/**
 * Message composer with text input and send button.
 * Disabled while AI is thinking.
 */
function AIComposer() {
  const { sendUserMessage, isThinking } = useAI();
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;
    sendUserMessage(trimmed);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border-subtle px-3 py-3">
      <div className="glass-surface flex items-end gap-2 rounded-xl px-3 py-2">
        <textarea
          className="max-h-[80px] min-h-[36px] flex-1 resize-none bg-transparent text-[12.5px] leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none"
          placeholder={isThinking ? "Waiting for response…" : "Ask SARASWATI anything…"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isThinking}
          rows={1}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || isThinking}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all disabled:opacity-30"
          style={{
            background:
              text.trim() && !isThinking
                ? "linear-gradient(180deg, rgba(232,205,138,0.24), rgba(138,106,46,0.18))"
                : "transparent",
            border: text.trim() && !isThinking ? "1px solid rgba(232,205,138,0.4)" : "1px solid transparent",
          }}
          aria-label="Send message"
        >
          <Send size={14} className={text.trim() && !isThinking ? "text-gold" : "text-ink-faint"} />
        </button>
      </div>
    </div>
  );
}

export default AIComposer;
