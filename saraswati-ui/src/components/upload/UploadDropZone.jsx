import { useState, useCallback, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "../../lib/utils";

function UploadDropZone({ onFilesSelected }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      if (e.dataTransfer.files?.length) {
        onFilesSelected(e.dataTransfer.files);
      }
    },
    [onFilesSelected]
  );

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e) => {
    if (e.target.files?.length) {
      onFilesSelected(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        "drop-zone flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl px-6 py-10",
        isDragActive && "active"
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border-subtle bg-surface-soft">
        <UploadCloud
          size={24}
          strokeWidth={1.6}
          className={isDragActive ? "text-gold" : "text-ink-soft"}
        />
      </span>
      <div className="text-center">
        <p className="text-[13.5px] font-medium text-ink">
          {isDragActive ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="mt-1 text-[12px] text-ink-faint">
          or{" "}
          <span className="text-gold underline underline-offset-2">browse files</span>
          {" "}— PDF, PPT, Word, Images up to 50 MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.pptx,.ppt,.docx,.doc,.png,.jpg,.jpeg,.webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

export default UploadDropZone;
