import CitationCard from "./CitationCard";
import { formatRelativeTime } from "../../lib/formatters";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
            className={`rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
              isUser
                ? "bg-surface-hover text-ink"
                : "border border-border-subtle bg-surface text-ink-soft prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 prose-a:text-gold"
            }`}
          >
            {isUser ? (
              message.text
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            )}
          </div>

          {/* Citations (AI only) */}
          {!isUser && message.citations && message.citations.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-2">
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

export default AIMessage;
