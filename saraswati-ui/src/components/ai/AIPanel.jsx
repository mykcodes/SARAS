import { useRef, useEffect, useState } from "react";
import { Sparkles, StickyNote, Bookmark, History, Plus, ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
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
function AIPanel({ document, subjectId, isAIFullscreen, setIsAIFullscreen }) {
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
  const [showDashboard, setShowDashboard] = useState(false);
  const prevMessagesLength = useRef(messages.length);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Auto-hide dashboard when new message arrives
    if (messages.length > prevMessagesLength.current) {
      setShowDashboard(false);
    }
    prevMessagesLength.current = messages.length;
  }, [messages, isThinking]);

  const tabs = [
    { id: "ai", label: "AI Assistant", icon: Sparkles },
    { id: "notes", label: "Notes", icon: StickyNote },
  ];

  const handleNewConversation = () => {
    setShowDashboard(false);
    newConversation();
  };

  const displayDashboard = (messages.length === 0 && !isThinking) || showDashboard;

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
            <div className="flex items-center gap-1">
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
                onClick={handleNewConversation}
                className="rounded-md p-1 text-ink-faint transition-colors hover:text-ink"
                aria-label="New conversation"
              >
                <Plus size={14} />
              </button>
              {messages.length > 0 && !showDashboard && (
                <button
                  type="button"
                  onClick={() => setShowDashboard(true)}
                  className="rounded-md p-1 text-ink-faint transition-colors hover:text-ink"
                  aria-label="Back to dashboard"
                >
                  <ArrowLeft size={14} />
                </button>
              )}
            </div>
            {setIsAIFullscreen && (
              <button
                type="button"
                onClick={() => setIsAIFullscreen(!isAIFullscreen)}
                className="rounded-md p-1 text-ink-faint transition-colors hover:text-ink"
                aria-label="Toggle Fullscreen AI"
              >
                {isAIFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            )}
          </div>

          {/* Conversation sidebar */}
          <ConversationSidebar />

          {/* Context selector */}
          <ContextSelector />

          {/* Messages area */}
          <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto">
            {displayDashboard ? (
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
