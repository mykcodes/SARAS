import { Pin } from "lucide-react";
import { formatRelativeTime } from "../../lib/formatters";

/**
 * Single conversation entry in the conversation sidebar.
 */
function ConversationItem({ conversation, isActive, onSelect, onTogglePin }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={`group flex w-full flex-col gap-1 rounded-lg px-2.5 py-2 text-left transition-colors ${
        isActive
          ? "border border-gold/20 bg-gold/6"
          : "border border-transparent hover:bg-surface-hover"
      }`}
    >
      <div className="flex items-center gap-1.5">
        {conversation.pinned && <Pin size={10} className="shrink-0 rotate-45 text-gold" />}
        <span className={`flex-1 truncate text-[11.5px] font-medium ${isActive ? "text-gold" : "text-ink"}`}>
          {conversation.title}
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(conversation.id);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.stopPropagation(); onTogglePin(conversation.id); }
          }}
          className={`rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 ${
            conversation.pinned ? "text-gold opacity-100" : "text-ink-faint hover:text-ink"
          }`}
          aria-label={conversation.pinned ? "Unpin" : "Pin"}
        >
          <Pin size={10} className={conversation.pinned ? "rotate-45" : ""} />
        </span>
      </div>
      <p className="truncate text-[10.5px] text-ink-faint">{conversation.lastMessage}</p>
      <div className="flex items-center gap-2 text-[9.5px] text-ink-faint">
        <span>{conversation.subjectTitle}</span>
        <span className="h-0.5 w-0.5 rounded-full bg-ink-faint" />
        <span>{formatRelativeTime(conversation.createdAt)}</span>
      </div>
    </button>
  );
}

export default ConversationItem;
