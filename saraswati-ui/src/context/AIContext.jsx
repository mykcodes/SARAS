import { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import { sendMessage as aiSendMessage } from "../services/aiService";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

const initialState = {
  messages: [],
  contextMode: "document",  // "subject" | "document" | "pages" | "highlighted" | "multi"
  isThinking: false,
  conversationSidebarOpen: false,
  activeConversationId: null,
  activeTab: "ai",           // "ai" | "notes" | "bookmarks"
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function aiReducer(state, action) {
  switch (action.type) {
    case "SEND_MESSAGE":
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: `msg-user-${Date.now()}`,
            role: "user",
            text: action.text,
            timestamp: new Date().toISOString(),
          },
        ],
        isThinking: true,
      };

    case "RECEIVE_RESPONSE":
      return {
        ...state,
        messages: [...state.messages, action.message],
        isThinking: false,
      };

    case "SET_THINKING":
      return { ...state, isThinking: action.value };

    case "SET_CONTEXT":
      return { ...state, contextMode: action.mode };

    case "NEW_CONVERSATION":
      return { ...state, messages: [], activeConversationId: null, isThinking: false };

    case "LOAD_CONVERSATION":
      return {
        ...state,
        activeConversationId: action.id,
        messages: [],
        isThinking: false,
      };

    case "TOGGLE_CONV_SIDEBAR":
      return { ...state, conversationSidebarOpen: !state.conversationSidebarOpen };

    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.tab };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AIContext = createContext(null);

export function AIProvider({ document, subjectId, children }) {
  const [state, dispatch] = useReducer(aiReducer, initialState);

  const sendUserMessage = useCallback(
    async (text) => {
      dispatch({ type: "SEND_MESSAGE", text });

      try {
        const response = await aiSendMessage(text, {
          mode: state.contextMode,
          documentId: document?.id,
          subjectId,
        });
        dispatch({ type: "RECEIVE_RESPONSE", message: response });
      } catch {
        dispatch({ type: "SET_THINKING", value: false });
      }
    },
    [state.contextMode, document?.id, subjectId]
  );

  const setContextMode = useCallback(
    (mode) => dispatch({ type: "SET_CONTEXT", mode }),
    []
  );

  const newConversation = useCallback(
    () => dispatch({ type: "NEW_CONVERSATION" }),
    []
  );

  const loadConversation = useCallback(
    (id) => dispatch({ type: "LOAD_CONVERSATION", id }),
    []
  );

  const toggleConversationSidebar = useCallback(
    () => dispatch({ type: "TOGGLE_CONV_SIDEBAR" }),
    []
  );

  const setActiveTab = useCallback(
    (tab) => dispatch({ type: "SET_ACTIVE_TAB", tab }),
    []
  );

  const value = useMemo(
    () => ({
      ...state,
      document,
      subjectId,
      sendUserMessage,
      setContextMode,
      newConversation,
      loadConversation,
      toggleConversationSidebar,
      setActiveTab,
    }),
    [
      state,
      document,
      subjectId,
      sendUserMessage,
      setContextMode,
      newConversation,
      loadConversation,
      toggleConversationSidebar,
      setActiveTab,
    ]
  );

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return ctx;
}

export default AIContext;
