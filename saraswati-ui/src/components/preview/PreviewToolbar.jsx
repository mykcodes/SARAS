import { useNavigate } from "react-router-dom";
import { ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2, Download } from "lucide-react";
import FileTypeIcon from "../documents/FileTypeIcon";

function PreviewToolbar({ document, subjectId }) {
  const navigate = useNavigate();

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

      {/* Center: page navigation (placeholder) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md p-1.5 text-ink-faint transition-colors hover:text-ink"
          aria-label="Previous page"
          disabled
        >
          <ChevronLeft size={16} />
        </button>
        <span className="min-w-[60px] text-center text-[12px] text-ink-soft">
          1 / {document.pages}
        </span>
        <button
          type="button"
          className="rounded-md p-1.5 text-ink-faint transition-colors hover:text-ink"
          aria-label="Next page"
          disabled
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Right: zoom + actions (placeholder) */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded-md p-1.5 text-ink-faint transition-colors hover:text-ink"
          aria-label="Zoom out"
          disabled
        >
          <ZoomOut size={16} />
        </button>
        <span className="min-w-[40px] text-center text-[11px] text-ink-faint">100%</span>
        <button
          type="button"
          className="rounded-md p-1.5 text-ink-faint transition-colors hover:text-ink"
          aria-label="Zoom in"
          disabled
        >
          <ZoomIn size={16} />
        </button>
        <div className="mx-2 h-5 w-px bg-border-subtle" />
        <button
          type="button"
          className="rounded-md p-1.5 text-ink-faint transition-colors hover:text-ink"
          aria-label="Download"
          disabled
        >
          <Download size={16} />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 text-ink-faint transition-colors hover:text-ink"
          aria-label="Fullscreen"
          disabled
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default PreviewToolbar;
