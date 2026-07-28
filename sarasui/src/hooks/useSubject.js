import { getSubjectById } from "../lib/data";

/**
 * Data-access hook for a single subject.
 *
 * Same shape convention as useSubjects: { subject, isLoading, error }, plus
 * a `notFound` flag so pages can render a 404-style state without needing
 * to know how "not found" is represented by the underlying data source.
 * Swapping this for a real fetch (e.g. GET /api/subjects/:id) later only
 * requires changing this file.
 */
function useSubject(subjectId) {
  const subject = getSubjectById(subjectId);

  return {
    subject: subject ?? null,
    isLoading: false,
    error: null,
    notFound: !subject,
  };
}

export default useSubject;