/**
 * Animated thinking indicator shown while AI is generating a response.
 * Displays three pulsing gold dots with staggered animation delays.
 */
function AIThinkingIndicator() {
  return (
    <div className="ai-message-enter flex items-start gap-3 px-3 py-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
        <span className="text-[11px] text-gold">✦</span>
      </span>
      <div className="flex flex-col gap-1.5 pt-1">
        <span className="text-[11px] font-medium text-gold/70">SARASWATI is thinking…</span>
        <span className="typing-dots flex items-center gap-1.5">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  );
}

export default AIThinkingIndicator;
