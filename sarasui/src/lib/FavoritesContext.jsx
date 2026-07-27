import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "saraswati:favoriteFolderIds";
const FavoritesContext = createContext(null);

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(() => readStored());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoriteIds]));
    } catch {
      // storage unavailable (private mode, etc.) — favorites just won't persist
    }
  }, [favoriteIds]);

  const value = useMemo(
    () => ({
      favoriteIds,
      isFavorite: (id) => favoriteIds.has(id),
      toggleFavorite: (id) =>
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        }),
    }),
    [favoriteIds]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside a <FavoritesProvider>");
  }
  return ctx;
}