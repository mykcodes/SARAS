import { SUBJECTS } from "../lib/data";

/**
 * Data-access hook for the subject list.
 *
 * Currently backed by static mock data. The return shape ({ subjects,
 * isLoading, error }) is intentionally the same shape a real data-fetching
 * hook (React Query, SWR, or a plain fetch effect) would return, so that
 * swapping in a backend later only requires changing this file's internals,
 * not any component that consumes it.
 */
function useSubjects() {
  return {
    subjects: SUBJECTS,
    isLoading: false,
    error: null,
  };
}

export default useSubjects;