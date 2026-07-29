import { useState, useEffect, useCallback } from "react";
import { storageManager } from "../services/storageManager";
import { getSubjects, createSubject, updateSubject, deleteSubject, favoriteSubject } from "../services/subjectService";

function useSubjects() {
  const [subjects, setSubjects] = useState(getSubjects());

  useEffect(() => {
    // Initial load
    setSubjects(getSubjects());

    // Subscribe to changes
    const unsubscribe = storageManager.subscribe("subjects", () => {
      setSubjects(getSubjects());
    });

    return () => unsubscribe();
  }, []);

  const create = useCallback((data) => {
    return createSubject(data);
  }, []);

  const update = useCallback((id, updates) => {
    return updateSubject(id, updates);
  }, []);

  const remove = useCallback((id) => {
    return deleteSubject(id);
  }, []);

  const toggleFavorite = useCallback((id) => {
    return favoriteSubject(id);
  }, []);

  return {
    subjects,
    isLoading: false,
    error: null,
    createSubject: create,
    updateSubject: update,
    deleteSubject: remove,
    favoriteSubject: toggleFavorite,
  };
}

export default useSubjects;