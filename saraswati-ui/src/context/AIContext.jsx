import { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import { sendMessage as aiSendMessage, resetConversation, setActiveChatId } from "../services/aiService";
import { getChatMessages } from "../api/chatApi";

const initialState = {
  messages: [],
  contextMode: "document",
  isThinking: false,
  conversationSidebarOpen: false,
  activeConversationId: null,
  activeTab: "ai",
  isPanelOpen: false,
};

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
        activeConversationId: action.chatId ?? state.activeConversationId,
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
        messages: action.messages || [],
        isThinking: false,
      };

    case "TOGGLE_CONV_SIDEBAR":
      return { ...state, conversationSidebarOpen: !state.conversationSidebarOpen };

    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.tab };

    case "OPEN_PANEL":
      return { ...state, isPanelOpen: true };

    case "CLOSE_PANEL":
      return { ...state, isPanelOpen: false };

    case "TOGGLE_PANEL":
      return { ...state, isPanelOpen: !state.isPanelOpen };

    default:
      return state;
  }
}

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
        dispatch({ type: "RECEIVE_RESPONSE", message: response, chatId: response._chatId });
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

  const newConversation = useCallback(() => {
    resetConversation();
    dispatch({ type: "NEW_CONVERSATION" });
  }, []);

  const loadConversation = useCallback(
    async (id) => {
      setActiveChatId(id);
      try {
        const msgs = await getChatMessages(id);
        const mapped = msgs.map((m) => ({
          id: `msg-${m.sender}-${m.id}`,
          role: m.sender === "user" ? "user" : "assistant",
          text: m.content,
          citations: m.citations || [],
          timestamp: m.timestamp || m.created_at,
        }));
        dispatch({ type: "LOAD_CONVERSATION", id, messages: mapped });
      } catch {
        dispatch({ type: "LOAD_CONVERSATION", id, messages: [] });
      }
    },
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

  const openPanel = useCallback(() => dispatch({ type: "OPEN_PANEL" }), []);
  const closePanel = useCallback(() => dispatch({ type: "CLOSE_PANEL" }), []);
  const togglePanel = useCallback(() => dispatch({ type: "TOGGLE_PANEL" }), []);

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
      openPanel,
      closePanel,
      togglePanel,
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
      openPanel,
      closePanel,
      togglePanel,
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

