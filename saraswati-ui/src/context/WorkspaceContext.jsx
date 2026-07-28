import { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import { getDocumentsBySubjectId } from "../lib/data";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

const initialState = {
  subjectId: null,
  documents: [],
  searchQuery: "",
  activeFilter: "all",       // "all" | "pdf" | "pptx" | "docx" | "image"
  sortMode: "newest",        // "newest" | "oldest" | "alpha" | "recent"
  viewMode: "grid",          // "grid" | "list"
  uploadModalOpen: false,
  insightsPanelOpen: false,
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function workspaceReducer(state, action) {
  switch (action.type) {
    case "INIT":
      return {
        ...initialState,
        subjectId: action.subjectId,
        documents: getDocumentsBySubjectId(action.subjectId),
      };

    case "SET_SEARCH":
      return { ...state, searchQuery: action.query };

    case "SET_FILTER":
      return { ...state, activeFilter: action.filter };

    case "SET_SORT":
      return { ...state, sortMode: action.sort };

    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.mode };

    case "TOGGLE_FAVORITE": {
      const docs = state.documents.map((doc) =>
        doc.id === action.docId ? { ...doc, favorite: !doc.favorite } : doc
      );
      return { ...state, documents: docs };
    }

    case "ADD_DOCUMENT":
      return { ...state, documents: [action.document, ...state.documents] };

    case "REMOVE_DOCUMENT":
      return {
        ...state,
        documents: state.documents.filter((d) => d.id !== action.docId),
      };

    case "OPEN_UPLOAD_MODAL":
      return { ...state, uploadModalOpen: true };

    case "CLOSE_UPLOAD_MODAL":
      return { ...state, uploadModalOpen: false };

    case "TOGGLE_INSIGHTS":
      return { ...state, insightsPanelOpen: !state.insightsPanelOpen };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ subjectId, children }) {
  const [state, dispatch] = useReducer(workspaceReducer, {
    ...initialState,
    subjectId,
    documents: getDocumentsBySubjectId(subjectId),
  });

  const setSearchQuery = useCallback(
    (query) => dispatch({ type: "SET_SEARCH", query }),
    []
  );
  const setFilter = useCallback(
    (filter) => dispatch({ type: "SET_FILTER", filter }),
    []
  );
  const setSort = useCallback(
    (sort) => dispatch({ type: "SET_SORT", sort }),
    []
  );
  const setViewMode = useCallback(
    (mode) => dispatch({ type: "SET_VIEW_MODE", mode }),
    []
  );
  const toggleFavorite = useCallback(
    (docId) => dispatch({ type: "TOGGLE_FAVORITE", docId }),
    []
  );
  const addDocument = useCallback(
    (document) => dispatch({ type: "ADD_DOCUMENT", document }),
    []
  );
  const removeDocument = useCallback(
    (docId) => dispatch({ type: "REMOVE_DOCUMENT", docId }),
    []
  );
  const openUploadModal = useCallback(
    () => dispatch({ type: "OPEN_UPLOAD_MODAL" }),
    []
  );
  const closeUploadModal = useCallback(
    () => dispatch({ type: "CLOSE_UPLOAD_MODAL" }),
    []
  );
  const toggleInsights = useCallback(
    () => dispatch({ type: "TOGGLE_INSIGHTS" }),
    []
  );

  const value = useMemo(
    () => ({
      ...state,
      setSearchQuery,
      setFilter,
      setSort,
      setViewMode,
      toggleFavorite,
      addDocument,
      removeDocument,
      openUploadModal,
      closeUploadModal,
      toggleInsights,
    }),
    [
      state,
      setSearchQuery,
      setFilter,
      setSort,
      setViewMode,
      toggleFavorite,
      addDocument,
      removeDocument,
      openUploadModal,
      closeUploadModal,
      toggleInsights,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return ctx;
}

export default WorkspaceContext;
