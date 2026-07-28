export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// File-type constants & helpers
// ---------------------------------------------------------------------------

/** Supported upload file types (MIME → internal type key). */
export const SUPPORTED_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.ms-powerpoint": "pptx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "docx",
  "image/png": "image",
  "image/jpeg": "image",
  "image/webp": "image",
};

/** Human-readable label for each internal file type. */
export const FILE_TYPE_LABELS = {
  pdf: "PDF",
  pptx: "PPT",
  docx: "Word",
  image: "Image",
};

/** Max upload size in bytes (50 MB). */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Resolves a MIME type string to an internal type key.
 * Returns null for unsupported types.
 */
export function resolveFileType(mimeType) {
  return SUPPORTED_TYPES[mimeType] ?? null;
}

/**
 * Generates a pseudo-random ID. Good enough for mock data;
 * a real backend would supply IDs from the server.
 */
export function generateId() {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
