import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PreviewToolbar from "./PreviewToolbar";
import AIPanel from "../ai/AIPanel";
import { AIProvider } from "../../context/AIContext";
import PDFViewer from "../pdf/PDFViewer";
import { getDocumentFileUrl } from "../../api/documentApi";

function DocumentPreviewShell({ document, subjectId }) {
  const fileSource = getDocumentFileUrl(subjectId, document.id);

  const [isAIPanelCollapsed, setIsAIPanelCollapsed] = useState(() => {
    return localStorage.getItem("documentAIPanelCollapsed") === "true";
  });

  const [aiPanelWidth, setAiPanelWidth] = useState(360);
  const [isAIFullscreen, setIsAIFullscreen] = useState(false);
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const containerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("documentAIPanelCollapsed", isAIPanelCollapsed);
  }, [isAIPanelCollapsed]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = aiPanelWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const newWidth = Math.max(260, Math.min(800, startWidth + deltaX));
      setAiPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [aiPanelWidth]);

  return (
    <AIProvider document={document} subjectId={subjectId}>
      <div ref={containerRef} className="flex flex-1 flex-col overflow-hidden bg-bg">
        <PreviewToolbar
          document={document}
          subjectId={subjectId}
          scale={scale}
          setScale={setScale}
          numPages={numPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          containerRef={containerRef}
          fileSource={fileSource}
        />
        <div className="flex flex-1 overflow-hidden relative">

          {!isAIFullscreen && (
            <div className="flex flex-1 flex-col overflow-hidden bg-bg transition-all duration-300">
              <PDFViewer
                file={fileSource}
                scale={scale}
                setNumPages={setNumPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}

          <div
            className={`relative flex shrink-0 flex-col border-border-subtle bg-bg-elevated transition-[width,border] duration-300 ${isAIPanelCollapsed && !isAIFullscreen ? "w-0 border-l-0" : "border-l"}`}
            style={{ width: isAIFullscreen ? "100%" : (isAIPanelCollapsed ? 0 : aiPanelWidth) }}
          >
            {/* Drag Resizer Handle */}
            {!isAIPanelCollapsed && !isAIFullscreen && (
              <div
                className="absolute -left-1 top-0 bottom-0 w-2 cursor-col-resize z-20 hover:bg-gold/20 active:bg-gold/40 transition-colors"
                onMouseDown={handleMouseDown}
              />
            )}

            {!isAIFullscreen && (
              <button
                type="button"
                onClick={() => setIsAIPanelCollapsed(!isAIPanelCollapsed)}
                className={`absolute top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-surface text-ink-soft shadow-sm transition-colors hover:text-ink ${isAIPanelCollapsed ? "-left-6" : "-left-3"}`}
                aria-label={isAIPanelCollapsed ? "Expand AI Panel" : "Collapse AI Panel"}
              >
                {isAIPanelCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
            )}

            <div className="flex h-full w-full flex-col overflow-hidden">
              <AIPanel
                document={document}
                subjectId={subjectId}
                isAIFullscreen={isAIFullscreen}
                setIsAIFullscreen={setIsAIFullscreen}
              />
            </div>
          </div>

        </div>
      </div>
    </AIProvider>
  );
}

export default DocumentPreviewShell;