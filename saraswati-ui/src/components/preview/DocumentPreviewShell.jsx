import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PreviewToolbar from "./PreviewToolbar";
import AIPanel from "../ai/AIPanel";
import { AIProvider } from "../../context/AIContext";
import PDFViewer from "../pdf/PDFViewer";

function DocumentPreviewShell({ document, subjectId }) {
  const fileSource = "/thermo.pdf"

  const [isAIPanelCollapsed, setIsAIPanelCollapsed] = useState(() => {
    return localStorage.getItem("documentAIPanelCollapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("documentAIPanelCollapsed", isAIPanelCollapsed);
  }, [isAIPanelCollapsed]);

  return (
    <AIProvider document={document} subjectId={subjectId}>
      <div className="flex flex-1 flex-col overflow-hidden">
        <PreviewToolbar document={document} subjectId={subjectId} />
        <div className="flex flex-1 overflow-hidden relative">

          <div className="flex flex-1 flex-col overflow-hidden bg-bg">
            <PDFViewer file={fileSource} />
          </div>

          <div className={`relative flex shrink-0 flex-col border-l border-border-subtle bg-bg-elevated transition-all duration-300 ${isAIPanelCollapsed ? "w-0 border-l-0" : "w-[300px]"}`}>
            <button
              type="button"
              onClick={() => setIsAIPanelCollapsed(!isAIPanelCollapsed)}
              className={`absolute top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-surface text-ink-soft shadow-sm transition-colors hover:text-ink ${isAIPanelCollapsed ? "-left-6" : "-left-3"}`}
              aria-label={isAIPanelCollapsed ? "Expand AI Panel" : "Collapse AI Panel"}
            >
              {isAIPanelCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
            <div className="flex h-full w-[300px] flex-col overflow-hidden">
              <AIPanel document={document} subjectId={subjectId} />
            </div>
          </div>
          
        </div>
      </div>
    </AIProvider>
  );
}

export default DocumentPreviewShell;