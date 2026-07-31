import { useState, useEffect } from "react";
import { getSubject } from "../api/subjectApi";

/**
 * Data-access hook for a single subject.
 */
function useSubject(subjectId) {
  const [subject, setSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subjectId) {
      setSubject(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getSubject(subjectId)
      .then((data) => {
        setSubject(data);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setSubject(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [subjectId]);

  return {
    subject,
    isLoading,
    error,
    notFound: !isLoading && !subject,
  };
}

export default useSubject;