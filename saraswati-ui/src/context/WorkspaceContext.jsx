import { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import { getDocumentsBySubjectId } from "../lib/data";
import { getPreference, setPreference } from "../services/preferencesService";

const initialState = {
  subjectId: null,
  documents: [],
  searchQuery: "",
  activeFilter: "all",
  sortMode: getPreference("sortMode") || "newest",
  viewMode: getPreference("viewMode") || "grid",
  uploadModalOpen: false,
  insightsPanelOpen: false,
  selectedDocIds: [],
  contextMenu: null,
};

function workspaceReducer(state, action) {
  switch (action.type) {
    case "INIT":
      return {
        ...initialState,
        subjectId: action.subjectId,
        documents: getDocumentsBySubjectId(action.subjectId),
        viewMode: getPreference("viewMode") || "grid",
        sortMode: getPreference("sortMode") || "newest",
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

    case "BULK_FAVORITE": {
      const ids = new Set(action.docIds);
      const docs = state.documents.map((doc) =>
        ids.has(doc.id) ? { ...doc, favorite: true } : doc
      );
      return { ...state, documents: docs, selectedDocIds: [] };
    }

    case "ADD_DOCUMENT":
      return { ...state, documents: [action.document, ...state.documents] };

    case "REMOVE_DOCUMENT":
      return {
        ...state,
        documents: state.documents.filter((d) => d.id !== action.docId),
        selectedDocIds: state.selectedDocIds.filter((id) => id !== action.docId),
      };

    case "REMOVE_DOCUMENTS": {
      const ids = new Set(action.docIds);
      return {
        ...state,
        documents: state.documents.filter((d) => !ids.has(d.id)),
        selectedDocIds: [],
      };
    }

    case "OPEN_UPLOAD_MODAL":
      return { ...state, uploadModalOpen: true };

    case "CLOSE_UPLOAD_MODAL":
      return { ...state, uploadModalOpen: false };

    case "TOGGLE_INSIGHTS":
      return { ...state, insightsPanelOpen: !state.insightsPanelOpen };

    case "SELECT_DOCUMENT": {
      if (state.selectedDocIds.includes(action.docId)) return state;
      return { ...state, selectedDocIds: [...state.selectedDocIds, action.docId] };
    }

    case "DESELECT_DOCUMENT":
      return {
        ...state,
        selectedDocIds: state.selectedDocIds.filter((id) => id !== action.docId),
      };

    case "TOGGLE_SELECTION": {
      const exists = state.selectedDocIds.includes(action.docId);
      return {
        ...state,
        selectedDocIds: exists
          ? state.selectedDocIds.filter((id) => id !== action.docId)
          : [...state.selectedDocIds, action.docId],
      };
    }

    case "SELECT_ALL":
      return {
        ...state,
        selectedDocIds: state.documents.map((d) => d.id),
      };

    case "CLEAR_SELECTION":
      return { ...state, selectedDocIds: [] };

    case "OPEN_CONTEXT_MENU":
      return {
        ...state,
        contextMenu: { docId: action.docId, x: action.x, y: action.y },
      };

    case "CLOSE_CONTEXT_MENU":
      return { ...state, contextMenu: null };

    default:
      return state;
  }
}

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ subjectId, children }) {
  const [state, dispatch] = useReducer(workspaceReducer, {
    ...initialState,
    subjectId,
    documents: getDocumentsBySubjectId(subjectId),
    viewMode: getPreference("viewMode") || "grid",
    sortMode: getPreference("sortMode") || "newest",
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
    (sort) => {
      setPreference("sortMode", sort);
      dispatch({ type: "SET_SORT", sort });
    },
    []
  );
  const setViewMode = useCallback(
    (mode) => {
      setPreference("viewMode", mode);
      dispatch({ type: "SET_VIEW_MODE", mode });
    },
    []
  );
  const toggleFavorite = useCallback(
    (docId) => dispatch({ type: "TOGGLE_FAVORITE", docId }),
    []
  );
  const bulkFavorite = useCallback(
    (docIds) => dispatch({ type: "BULK_FAVORITE", docIds }),
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
  const removeDocuments = useCallback(
    (docIds) => dispatch({ type: "REMOVE_DOCUMENTS", docIds }),
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
  const selectDocument = useCallback(
    (docId) => dispatch({ type: "SELECT_DOCUMENT", docId }),
    []
  );
  const deselectDocument = useCallback(
    (docId) => dispatch({ type: "DESELECT_DOCUMENT", docId }),
    []
  );
  const toggleSelection = useCallback(
    (docId) => dispatch({ type: "TOGGLE_SELECTION", docId }),
    []
  );
  const selectAll = useCallback(
    () => dispatch({ type: "SELECT_ALL" }),
    []
  );
  const clearSelection = useCallback(
    () => dispatch({ type: "CLEAR_SELECTION" }),
    []
  );
  const openContextMenu = useCallback(
    (docId, x, y) => dispatch({ type: "OPEN_CONTEXT_MENU", docId, x, y }),
    []
  );
  const closeContextMenu = useCallback(
    () => dispatch({ type: "CLOSE_CONTEXT_MENU" }),
    []
  );

  const hasSelection = state.selectedDocIds.length > 0;
  const selectionCount = state.selectedDocIds.length;

  const value = useMemo(
    () => ({
      ...state,
      hasSelection,
      selectionCount,
      setSearchQuery,
      setFilter,
      setSort,
      setViewMode,
      toggleFavorite,
      bulkFavorite,
      addDocument,
      removeDocument,
      removeDocuments,
      openUploadModal,
      closeUploadModal,
      toggleInsights,
      selectDocument,
      deselectDocument,
      toggleSelection,
      selectAll,
      clearSelection,
      openContextMenu,
      closeContextMenu,
    }),
    [
      state,
      hasSelection,
      selectionCount,
      setSearchQuery,
      setFilter,
      setSort,
      setViewMode,
      toggleFavorite,
      bulkFavorite,
      addDocument,
      removeDocument,
      removeDocuments,
      openUploadModal,
      closeUploadModal,
      toggleInsights,
      selectDocument,
      deselectDocument,
      toggleSelection,
      selectAll,
      clearSelection,
      openContextMenu,
      closeContextMenu,
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
