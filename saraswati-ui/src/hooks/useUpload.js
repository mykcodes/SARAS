import { useState, useCallback, useRef } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { resolveFileType, MAX_FILE_SIZE, generateId } from "../lib/utils";
import { uploadDocument } from "../api/documentApi";

function useUpload() {
  const { documents, subjectId, addDocument } = useWorkspace();
  const [queue, setQueue] = useState([]);
  const intervalsRef = useRef({});

  // --- Validation ---
  const validate = useCallback(
    (file) => {
      const type = resolveFileType(file.type);
      if (!type) return { valid: false, error: "unsupported", message: "File type not supported" };
      if (file.size > MAX_FILE_SIZE)
        return { valid: false, error: "size", message: "File exceeds 50 MB limit" };
      const duplicate = documents.find(
        (d) => d.title === file.name.replace(/\.[^.]+$/, "")
      );
      if (duplicate)
        return { valid: false, error: "duplicate", message: "A file with this name already exists" };
      return { valid: true, type };
    },
    [documents]
  );

  // --- Upload a single file via real API ---
  const simulateOne = useCallback(
    (item) => {
      if (!subjectId) {
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: "error", error: "No subject selected" } : q))
        );
        return;
      }

      uploadDocument(subjectId, item.file, (progress) => {
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, progress } : q))
        );
      })
        .then((doc) => {
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress: 100, status: "success" } : q))
          );
          
          // Format backend response for the workspace state
          const newDoc = {
            id: doc.id,
            subjectId: doc.subject_id,
            title: doc.title,
            original_filename: doc.original_filename,
            type: "pdf",
            size: doc.file_size || 0,
            pages: doc.page_count ?? null,
            uploadedAt: doc.upload_date,
            processingStatus: doc.processing_status,
            embeddingStatus: doc.processing_status,
            favorite: false,
          };
          
          // Add to workspace context
          addDocument(newDoc);
        })
        .catch((err) => {
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: "error", error: err.message || "Upload failed" } : q))
          );
        });
    },
    [subjectId, addDocument]
  );

  // --- Public: add files to queue and start uploading ---
  const uploadFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList);
      const newItems = files.map((file) => {
        const validation = validate(file);
        return {
          id: generateId(),
          file,
          fileName: file.name,
          fileType: validation.valid ? validation.type : null,
          progress: 0,
          status: validation.valid ? "queued" : "error",
          error: validation.valid ? null : validation.message,
        };
      });

      setQueue((prev) => [...prev, ...newItems]);

      // Start uploading valid items
      newItems
        .filter((item) => item.status === "queued")
        .forEach((item) => {
          const uploadingItem = { ...item, status: "uploading" };
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? uploadingItem : q))
          );
          simulateOne(uploadingItem);
        });
    },
    [validate, simulateOne]
  );

  // --- Cancel a single upload ---
  const cancelUpload = useCallback((itemId) => {
    if (intervalsRef.current[itemId]) {
      clearInterval(intervalsRef.current[itemId]);
      delete intervalsRef.current[itemId];
    }
    setQueue((prev) => prev.filter((q) => q.id !== itemId));
  }, []);

  // --- Clear completed ---
  const clearCompleted = useCallback(() => {
    setQueue((prev) => prev.filter((q) => q.status !== "success" && q.status !== "error"));
  }, []);

  const isUploading = queue.some((q) => q.status === "uploading");

  return {
    uploadFiles,
    uploadQueue: queue,
    isUploading,
    cancelUpload,
    clearCompleted,
  };
}

export default useUpload;
