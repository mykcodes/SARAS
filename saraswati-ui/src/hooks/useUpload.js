import { useState, useCallback, useRef } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { resolveFileType, MAX_FILE_SIZE, generateId } from "../lib/utils";

/**
 * Upload-simulation hook.
 *
 * Validates files, manages an upload queue with simulated progress,
 * and adds completed documents into the workspace via context.
 * When a real API is available, replace the simulateOne() internals.
 *
 * Upload queue item shape:
 *   { id, file, fileName, fileType, progress, status, error }
 *   status: "queued" | "uploading" | "success" | "error"
 */
function useUpload() {
  const { documents, addDocument } = useWorkspace();
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

  // --- Simulate a single upload ---
  const simulateOne = useCallback(
    (item) => {
      const duration = 1500 + Math.random() * 2000; // 1.5-3.5s
      const tick = 80;
      const increment = (tick / duration) * 100;

      const interval = setInterval(() => {
        setQueue((prev) => {
          const target = prev.find((q) => q.id === item.id);
          if (!target || target.status !== "uploading") {
            clearInterval(interval);
            return prev;
          }

          const next = Math.min(target.progress + increment, 100);
          if (next >= 100) {
            clearInterval(interval);

            // Simulate ~10% failure rate
            const failed = Math.random() < 0.1;
            if (failed) {
              return prev.map((q) =>
                q.id === item.id ? { ...q, progress: 100, status: "error", error: "Upload failed — try again" } : q
              );
            }

            // Success — add document to workspace
            const newDoc = {
              id: generateId(),
              title: item.fileName.replace(/\.[^.]+$/, ""),
              type: item.fileType,
              size: item.file.size,
              pages: Math.floor(Math.random() * 40) + 5,
              uploadedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastOpened: null,
              favorite: false,
              indexed: false,
              thumbnailPlaceholder: null,
              embeddingStatus: "pending",
              summary: null,
              tags: [],
            };
            addDocument(newDoc);

            return prev.map((q) =>
              q.id === item.id ? { ...q, progress: 100, status: "success" } : q
            );
          }

          return prev.map((q) =>
            q.id === item.id ? { ...q, progress: next } : q
          );
        });
      }, tick);

      intervalsRef.current[item.id] = interval;
    },
    [addDocument]
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
