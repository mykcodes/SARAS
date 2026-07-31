import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from "react";
import { getPreference, setPreference } from "../services/preferencesService";
import { listDocuments, deleteDocument as apiDeleteDocument } from "../api/documentApi";

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
        documents: [],
        viewMode: getPreference("viewMode") || "grid",
        sortMode: getPreference("sortMode") || "newest",
      };

    case "INIT_DOCS":
      return { ...state, documents: action.documents };

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

    case "UPDATE_DOCUMENT_TITLE": {
      const docs = state.documents.map((doc) =>
        doc.id === action.docId ? { ...doc, title: action.title } : doc
      );
      return { ...state, documents: docs };
    }

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
    documents: [],
    viewMode: getPreference("viewMode") || "grid",
    sortMode: getPreference("sortMode") || "newest",
  });

  // Load documents from the real API on mount / subjectId change
  useEffect(() => {
    if (!subjectId) return;
    listDocuments(subjectId)
      .then((docs) => {
        const normalized = docs.map((d) => ({
          id: d.id,
          subjectId: d.subject_id,
          title: d.title,
          original_filename: d.original_filename,
          type: "pdf",
          size: d.file_size,
          pages: d.page_count ?? null,
          uploadedAt: d.upload_date,
          processingStatus: d.processing_status,
          embeddingStatus: d.processing_status,
          favorite: d.is_favorite ?? false,
        }));
        dispatch({ type: "INIT_DOCS", documents: normalized });
      })
      .catch(() => {
        // silently fail — workspace shows empty
      });
  }, [subjectId]);

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
    (docId) => {
      import("../api/documentApi").then(({ toggleDocumentFavorite }) => {
        toggleDocumentFavorite(subjectId, docId).catch((err) => {
          console.error("Failed to toggle favorite", err);
          dispatch({ type: "TOGGLE_FAVORITE", docId }); // Revert on failure
        });
      });
      dispatch({ type: "TOGGLE_FAVORITE", docId }); // Optimistic update
    },
    [subjectId]
  );
  const bulkFavorite = useCallback(
    (docIds) => {
      docIds.forEach((id) => favoriteDocument(subjectId, id));
      dispatch({ type: "CLEAR_SELECTION" });
    },
    [subjectId]
  );
  const addDocument = useCallback(
    (document) => {
      // documentService handles adding, this might be called for optimisitic updates
      dispatch({ type: "ADD_DOCUMENT", document });
    },
    []
  );
  const updateDocumentTitle = useCallback(
    (docId, title) => dispatch({ type: "UPDATE_DOCUMENT_TITLE", docId, title }),
    []
  );
  const removeDocument = useCallback(
    async (docId) => {
      try {
        await apiDeleteDocument(subjectId, docId);
      } catch (e) {
        console.error('Failed to delete document:', e);
      }
      dispatch({ type: "REMOVE_DOCUMENT", docId });
    },
    [subjectId]
  );
  const removeDocuments = useCallback(
    async (docIds) => {
      await Promise.allSettled(docIds.map((id) => apiDeleteDocument(subjectId, id)));
      dispatch({ type: "REMOVE_DOCUMENTS", docIds });
    },
    [subjectId]
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
      updateDocumentTitle,
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
      updateDocumentTitle,
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
