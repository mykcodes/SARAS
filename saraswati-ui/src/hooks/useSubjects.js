import { useState, useEffect, useCallback } from "react";
import { listSubjects, createSubject as apiCreateSubject, updateSubject as apiUpdateSubject, deleteSubject as apiDeleteSubject } from "../api/subjectApi";
import { favoriteSubject as apiFavoriteSubject } from "../services/subjectService"; // Keep this local for now or update if needed

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
    // API does not currently have favorites. 
    // If favoriteSubject is used, fallback to local implementation
    // Wait, the API doesn't support favorite. For now just use the mock or ignore
    return apiFavoriteSubject(id);
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