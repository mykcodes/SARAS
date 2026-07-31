import { useState, useEffect, useCallback } from "react";
import { listSubjects, createSubject as apiCreateSubject, updateSubject as apiUpdateSubject, deleteSubject as apiDeleteSubject, toggleSubjectFavorite } from "../api/subjectApi";

function useSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = useCallback(() => {
    setIsLoading(true);
    listSubjects()
      .then((data) => {
        setSubjects(data);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const create = useCallback(async (data) => {
    const newSubject = await apiCreateSubject(data);
    setSubjects((prev) => [newSubject, ...prev]);
    return newSubject;
  }, []);

  const update = useCallback(async (id, updates) => {
    const updated = await apiUpdateSubject(id, updates);
    setSubjects((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    await apiDeleteSubject(id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggleFavorite = useCallback((id) => {
    setSubjects((prev) => prev.map((s) => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));
    toggleSubjectFavorite(id).catch(err => {
      console.error("Failed to toggle favorite", err);
      setSubjects((prev) => prev.map((s) => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));
    });
  }, []);

  return {
    subjects,
    isLoading,
    error,
    createSubject: create,
    updateSubject: update,
    deleteSubject: remove,
    favoriteSubject: toggleFavorite,
  };
}

export default useSubjects;