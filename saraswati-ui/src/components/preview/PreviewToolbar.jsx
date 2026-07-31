import { useNavigate } from "react-router-dom";
import { ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2, Download } from "lucide-react";
import FileTypeIcon from "../documents/FileTypeIcon";

function PreviewToolbar({ document, subjectId, scale, setScale, numPages, currentPage, setCurrentPage, containerRef, fileSource }) {
  const navigate = useNavigate();

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3.0));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => (numPages ? Math.min(p + 1, numPages) : p + 1));

  const handleFullscreen = () => {
    if (containerRef?.current) {
      if (window.document.fullscreenElement) {
        window.document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-border-subtle bg-surface px-4 py-3">
      {/* Left: back + doc info */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/subjects/${subjectId}`)}
          className="rounded-md p-1.5 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
          aria-label="Back to workspace"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="h-5 w-px bg-border-subtle" />
        <FileTypeIcon type={document.type} size={14} />
        <span className="text-[13.5px] font-medium text-ink">{document.title}</span>
      </div>

      {/* Center: page navigation */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="rounded-md p-1.5 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="min-w-[60px] text-center text-[12px] text-ink-soft">
          {currentPage} / {numPages || document.pages || "?"}
        </span>
        <button
          type="button"
          onClick={handleNextPage}
          disabled={numPages && currentPage >= numPages}
          className="rounded-md p-1.5 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Right: zoom + actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          className="rounded-md p-1.5 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-40"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <span className="min-w-[45px] text-center text-[11px] text-ink-faint">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={scale >= 3.0}
          className="rounded-md p-1.5 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-40"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <div className="mx-2 h-5 w-px bg-border-subtle" />
        <a
          href={fileSource}
          download={document.title}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-md p-1.5 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
          aria-label="Download"
        >
          <Download size={16} />
        </a>
        <button
          type="button"
          onClick={handleFullscreen}
          className="rounded-md p-1.5 text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
          aria-label="Fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default PreviewToolbar;
