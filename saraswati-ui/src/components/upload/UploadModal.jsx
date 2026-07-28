import { useEffect } from "react";
import { X } from "lucide-react";
import UploadDropZone from "./UploadDropZone";
import UploadProgressItem from "./UploadProgressItem";
import useUpload from "../../hooks/useUpload";
import { useWorkspace } from "../../context/WorkspaceContext";

function UploadModal() {
  const { uploadModalOpen, closeUploadModal } = useWorkspace();
  const { uploadFiles, uploadQueue, isUploading, cancelUpload, clearCompleted } = useUpload();

  // Close on Escape
  useEffect(() => {
    if (!uploadModalOpen) return;
    function onKey(e) {
      if (e.key === "Escape") closeUploadModal();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [uploadModalOpen, closeUploadModal]);

  if (!uploadModalOpen) return null;

  const hasQueue = uploadQueue.length > 0;
  const completedCount = uploadQueue.filter(
    (q) => q.status === "success" || q.status === "error"
  ).length;

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) closeUploadModal();
      }}
    >
      <div className="modal-content w-full max-w-[520px] rounded-2xl border border-border-subtle bg-bg-elevated p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-ink">Upload Documents</h3>
          <button
            type="button"
            onClick={closeUploadModal}
            disabled={isUploading}
            className="rounded-md p-1.5 text-ink-faint transition-colors hover:text-ink disabled:opacity-40"
            aria-label="Close upload modal"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-1.5 text-[12.5px] text-ink-soft">
          Add study materials to your workspace. Supported formats: PDF, PPT, Word, Images.
        </p>

        {/* Drop zone */}
        <div className="mt-5">
          <UploadDropZone onFilesSelected={uploadFiles} />
        </div>

        {/* Upload queue */}
        {hasQueue && (
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-medium text-ink-soft">
                Upload Queue
              </span>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="text-[11px] text-gold transition-colors hover:text-gold-light"
                >
                  Clear completed
                </button>
              )}
            </div>
            <div className="mt-2 flex max-h-[200px] flex-col gap-2 overflow-y-auto">
              {uploadQueue.map((item) => (
                <UploadProgressItem
                  key={item.id}
                  item={item}
                  onCancel={cancelUpload}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-border-subtle pt-4">
          <button
            type="button"
            onClick={closeUploadModal}
            disabled={isUploading}
            className="rounded-lg border border-border-subtle px-4 py-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-40"
          >
            {isUploading ? "Uploading…" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
