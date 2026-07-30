import { createContext, useContext, useReducer, useCallback, useMemo } from "react";

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
  isPanelOpen: false,        // global slide-over panel visibility
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

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AIContext = createContext(null);

export function AIProvider({ document, subjectId, children }) {
  const [state, dispatch] = useReducer(aiReducer, initialState);

  // updated to take an optional requestedMarks parameter
  const sendUserMessage = useCallback(
    async (text, requestedMarks = null) => {
      dispatch({ type: "SEND_MESSAGE", text });

      try {
        const pdfResponse = await fetch('/thermo.pdf');
        if (!pdfResponse.ok) {
          throw new Error("Could not find thermo.pdf in the public folder.");
        }
        const pdfBlob = await pdfResponse.blob();
        const pdfFile = new File([pdfBlob], "thermo.pdf", { type: "application/pdf" });

        const formData = new FormData();
        formData.append("file", pdfFile);
        formData.append("question", text);
        
        // Only append marks if they are explicitly passed in
        if (requestedMarks) {
          formData.append("marks", requestedMarks.toString());
        }

        const response = await fetch("http://127.0.0.1:8000/ask-pdf", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Backend returned status ${response.status}`);
        }

        const data = await response.json();

        dispatch({ 
          type: "RECEIVE_RESPONSE", 
          message: {
            id: `msg-ai-${Date.now()}`,
            role: "ai",
            text: data.answer,
            timestamp: new Date().toISOString(),
          } 
        });

      } catch (error) {
        console.error("SARASWATI Backend Error:", error);
        dispatch({ 
          type: "RECEIVE_RESPONSE", 
          message: {
            id: `msg-error-${Date.now()}`,
            role: "ai",
            text: "Error: Could not connect to the backend. Make sure your FastAPI server is running!",
            timestamp: new Date().toISOString(),
          } 
        });
      }
    },
    [] 
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