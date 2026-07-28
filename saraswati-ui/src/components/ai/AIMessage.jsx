import CitationCard from "./CitationCard";
import { formatRelativeTime } from "../../lib/formatters";

/**
 * Renders a single message in the AI conversation.
 * User messages are right-aligned with surface styling.
 * AI messages are left-aligned with citation cards when available.
 */
function AIMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`ai-message-enter flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[90%] gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
            isUser
              ? "border-border-default bg-surface-hover text-ink-soft"
              : "border-gold/30 bg-gold/10 text-gold"
          }`}
        >
          {isUser ? "M" : "✦"}
        </span>

        {/* Content */}
        <div className="flex min-w-0 flex-col gap-2">
          {/* Sender label + time */}
          <div className={`flex items-center gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
            <span className="text-[11px] font-medium text-ink-soft">
              {isUser ? "You" : "SARASWATI"}
            </span>
            <span className="text-[10px] text-ink-faint">
              {formatRelativeTime(message.timestamp)}
            </span>
          </div>

          {/* Message bubble */}
          <div
            className={`rounded-xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
              isUser
                ? "bg-surface-hover text-ink"
                : "border border-border-subtle bg-surface text-ink-soft"
            }`}
          >
            {renderMarkdownLite(message.text)}
          </div>

          {/* Citations (AI only) */}
          {!isUser && message.citations && message.citations.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-ink-faint">
                Sources
              </span>
              {message.citations.map((cite, i) => (
                <CitationCard
                  key={i}
                  documentName={cite.documentName}
                  pageNumber={cite.pageNumber}
                  sectionTitle={cite.sectionTitle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Lightweight markdown-like renderer for AI responses.
 * Handles bold (**text**), bullet points, and numbered lists
 * without pulling in a full markdown library.
 */
function renderMarkdownLite(text) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let key = 0;

  for (const line of lines) {
    if (line.trim() === "") {
      elements.push(<br key={key++} />);
      continue;
    }

    // Process inline bold
    const processed = line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Process inline italic
      return part.split(/(\*[^*]+\*)/g).map((sub, j) => {
        if (sub.startsWith("*") && sub.endsWith("*")) {
          return <em key={`${i}-${j}`} className="italic text-ink-soft">{sub.slice(1, -1)}</em>;
        }
        return sub;
      });
    });

    elements.push(
      <span key={key++} className="block">
        {processed}
      </span>
    );
  }

  return <>{elements}</>;
}

export default AIMessage;
