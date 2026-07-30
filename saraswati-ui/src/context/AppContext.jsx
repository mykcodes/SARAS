import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from "react";
import { logActivity, getRecentActivities } from "../services/activityService";
import { moveToTrash, getTrashItems, restoreItem, permanentDelete, emptyTrash, getTrashCount } from "../services/trashService";
import { getAllPreferences, setPreference } from "../services/preferencesService";

const initialState = {
  globalSearchOpen: false,
  globalSearchQuery: "",
  preferences: getAllPreferences(),
  toasts: [],
  detailsDrawer: null,
  isSettingsOpen: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case "OPEN_GLOBAL_SEARCH":
      return { ...state, globalSearchOpen: true, globalSearchQuery: "" };

    case "CLOSE_GLOBAL_SEARCH":
      return { ...state, globalSearchOpen: false, globalSearchQuery: "" };

    case "SET_GLOBAL_SEARCH_QUERY":
      return { ...state, globalSearchQuery: action.query };

    case "SET_PREFERENCE": {
      const preferences = { ...state.preferences, [action.key]: action.value };
      return { ...state, preferences };
    }

    case "ADD_TOAST": {
      const toast = {
        id: `toast-${Date.now()}`,
        message: action.message,
        type: action.toastType || "info",
        timestamp: Date.now(),
      };
      return { ...state, toasts: [...state.toasts, toast] };
    }

    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    case "OPEN_DETAILS_DRAWER":
      return { ...state, detailsDrawer: action.document };

    case "CLOSE_DETAILS_DRAWER":
      return { ...state, detailsDrawer: null };

    case "OPEN_SETTINGS":
      return { ...state, isSettingsOpen: true };

    case "CLOSE_SETTINGS":
      return { ...state, isSettingsOpen: false };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const openGlobalSearch = useCallback(
    () => dispatch({ type: "OPEN_GLOBAL_SEARCH" }),
    []
  );

  const closeGlobalSearch = useCallback(
    () => dispatch({ type: "CLOSE_GLOBAL_SEARCH" }),
    []
  );

  const setGlobalSearchQuery = useCallback(
    (query) => dispatch({ type: "SET_GLOBAL_SEARCH_QUERY", query }),
    []
  );

  const updatePreference = useCallback((key, value) => {
    setPreference(key, value);
    dispatch({ type: "SET_PREFERENCE", key, value });
  }, []);

  const addToast = useCallback((message, toastType = "info") => {
    dispatch({ type: "ADD_TOAST", message, toastType });
  }, []);

  const removeToast = useCallback(
    (id) => dispatch({ type: "REMOVE_TOAST", id }),
    []
  );

  const openDetailsDrawer = useCallback(
    (document) => dispatch({ type: "OPEN_DETAILS_DRAWER", document }),
    []
  );

  const closeDetailsDrawer = useCallback(
    () => dispatch({ type: "CLOSE_DETAILS_DRAWER" }),
    []
  );

  const openSettings = useCallback(() => dispatch({ type: "OPEN_SETTINGS" }), []);
  const closeSettings = useCallback(() => dispatch({ type: "CLOSE_SETTINGS" }), []);

  const trackActivity = useCallback((action, target, metadata) => {
    logActivity(action, target, metadata);
  }, []);

  const trashDocument = useCallback((item) => {
    const trashed = moveToTrash(item);
    addToast(`"${item.title}" moved to trash`, "info");
    logActivity("deleted", item.title, {
      targetType: "document",
      subjectId: item.subjectId,
      documentId: item.id,
    });
    return trashed;
  }, [addToast]);

  const restoreFromTrash = useCallback((trashId) => {
    const restored = restoreItem(trashId);
    if (restored) {
      addToast(`"${restored.title}" restored`, "success");
      logActivity("restored", restored.title, {
        targetType: restored.targetType || "document",
      });
    }
    return restored;
  }, [addToast]);

  const permanentDeleteFromTrash = useCallback((trashId) => {
    permanentDelete(trashId);
  }, []);

  const emptyAllTrash = useCallback(() => {
    const count = emptyTrash();
    addToast(`${count} item${count !== 1 ? "s" : ""} permanently deleted`, "info");
    return count;
  }, [addToast]);

  useEffect(() => {
    if (state.toasts.length === 0) return;
    const latest = state.toasts[state.toasts.length - 1];
    const timer = setTimeout(() => removeToast(latest.id), 3500);
    return () => clearTimeout(timer);
  }, [state.toasts, removeToast]);

  const value = useMemo(
    () => ({
      ...state,
      openGlobalSearch,
      closeGlobalSearch,
      setGlobalSearchQuery,
      updatePreference,
      addToast,
      removeToast,
      openDetailsDrawer,
      closeDetailsDrawer,
      trackActivity,
      trashDocument,
      restoreFromTrash,
      permanentDeleteFromTrash,
      emptyAllTrash,
      getRecentActivities,
      getTrashItems,
      getTrashCount,
      openSettings,
      closeSettings,
    }),
    [
      state,
      openGlobalSearch,
      closeGlobalSearch,
      setGlobalSearchQuery,
      updatePreference,
      addToast,
      removeToast,
      openDetailsDrawer,
      closeDetailsDrawer,
      trackActivity,
      trashDocument,
      restoreFromTrash,
      permanentDeleteFromTrash,
      emptyAllTrash,
      openSettings,
      closeSettings,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
}

export default AppContext;
