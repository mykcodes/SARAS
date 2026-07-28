import { useState, useMemo } from "react";
import { X, Search, Plus } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { useAI } from "../../context/AIContext";
import { getConversations, pinConversation, unpinConversation } from "../../services/conversationService";

/**
 * Collapsible conversation history sidebar within the AI panel.
 * Shows past conversations with search and pin capabilities.
 */
function ConversationSidebar() {
  const {
    conversationSidebarOpen,
    toggleConversationSidebar,
    activeConversationId,
    loadConversation,
    newConversation,
    subjectId,
  } = useAI();

  const [search, setSearch] = useState("");
  const [, forceUpdate] = useState(0);

  const conversations = useMemo(() => {
    const all = getConversations(subjectId);
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(
      (c) => c.title.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
    );
  }, [subjectId, search]);

  const pinned = conversations.filter((c) => c.pinned);
  const unpinned = conversations.filter((c) => !c.pinned);

  const handleTogglePin = (id) => {
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;
    if (conv.pinned) unpinConversation(id);
    else pinConversation(id);
    forceUpdate((n) => n + 1);
  };

  if (!conversationSidebarOpen) return null;

  return (
    <div className="slide-in-left flex w-full flex-col border-b border-border-subtle bg-bg-elevated">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
        <span className="text-[12px] font-semibold text-ink">Conversations</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => { newConversation(); toggleConversationSidebar(); }}
            className="rounded-md p-1 text-ink-faint transition-colors hover:text-gold"
            aria-label="New conversation"
          >
            <Plus size={14} />
          </button>
          <button
            type="button"
            onClick={toggleConversationSidebar}
            className="rounded-md p-1 text-ink-faint transition-colors hover:text-ink"
            aria-label="Close conversations"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-2 py-1.5">
          <Search size={12} className="shrink-0 text-ink-faint" />
          <input
            type="text"
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[11px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex max-h-[240px] flex-col gap-0.5 overflow-y-auto px-2 pb-2">
        {pinned.length > 0 && (
          <>
            <span className="px-1 py-1 text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">
              Pinned
            </span>
            {pinned.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                isActive={c.id === activeConversationId}
                onSelect={loadConversation}
                onTogglePin={handleTogglePin}
              />
            ))}
          </>
        )}
        {unpinned.length > 0 && (
          <>
            {pinned.length > 0 && (
              <span className="px-1 py-1 text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">
                Recent
              </span>
            )}
            {unpinned.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                isActive={c.id === activeConversationId}
                onSelect={loadConversation}
                onTogglePin={handleTogglePin}
              />
            ))}
          </>
        )}
        {conversations.length === 0 && (
          <p className="py-4 text-center text-[11px] text-ink-faint">
            {search ? "No conversations match your search." : "No conversations yet."}
          </p>
        )}
      </div>
    </div>
  );
}

export default ConversationSidebar;
