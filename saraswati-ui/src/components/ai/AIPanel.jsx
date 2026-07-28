import { useRef, useEffect } from "react";
import { Sparkles, StickyNote, Bookmark, History, Plus } from "lucide-react";
import { useAI } from "../../context/AIContext";
import ContextSelector from "./ContextSelector";
import ConversationSidebar from "./ConversationSidebar";
import AIWelcome from "./AIWelcome";
import AIMessage from "./AIMessage";
import AIComposer from "./AIComposer";
import AIThinkingIndicator from "./AIThinkingIndicator";
import NotesPanel from "../notes/NotesPanel";
import BookmarksPanel from "../bookmarks/BookmarksPanel";

/**
 * Main AI panel container with tabbed interface.
 * Tabs: AI Assistant | Notes | Bookmarks
 * Contains the full AI conversation flow with context selector.
 */
function AIPanel({ document, subjectId }) {
  const {
    messages,
    isThinking,
    activeTab,
    setActiveTab,
    toggleConversationSidebar,
    conversationSidebarOpen,
    newConversation,
  } = useAI();

  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const tabs = [
    { id: "ai", label: "AI Assistant", icon: Sparkles },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border-subtle">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 text-[11px] transition-colors ${
                activeTab === tab.id
                  ? "tab-active font-medium text-gold"
                  : "text-ink-faint hover:text-ink-soft"
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "ai" && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* AI toolbar */}
          <div className="flex items-center justify-between border-b border-border-subtle px-3 py-1.5">
            <button
              type="button"
              onClick={toggleConversationSidebar}
              className={`rounded-md p-1 transition-colors ${
                conversationSidebarOpen ? "text-gold" : "text-ink-faint hover:text-ink"
              }`}
              aria-label="Toggle conversation history"
            >
              <History size={14} />
            </button>
            <button
              type="button"
              onClick={newConversation}
              className="rounded-md p-1 text-ink-faint transition-colors hover:text-ink"
              aria-label="New conversation"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Conversation sidebar */}
          <ConversationSidebar />

          {/* Context selector */}
          <ContextSelector />

          {/* Messages area */}
          <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto">
            {messages.length === 0 && !isThinking ? (
              <AIWelcome />
            ) : (
              <div className="flex flex-col gap-3 px-3 py-3">
                {messages.map((msg) => (
                  <AIMessage key={msg.id} message={msg} />
                ))}
                {isThinking && <AIThinkingIndicator />}
              </div>
            )}
          </div>

          {/* Composer */}
          <AIComposer />
        </div>
      )}

      {activeTab === "notes" && (
        <NotesPanel documentId={document?.id} />
      )}

      {activeTab === "bookmarks" && (
        <BookmarksPanel />
      )}
    </div>
  );
}

export default AIPanel;
