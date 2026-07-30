import { Highlighter } from "lucide-react";
import PreviewToolbar from "./PreviewToolbar";
import BookmarksPanel from "../bookmarks/BookmarksPanel";
import AIPanel from "../ai/AIPanel";
import { AIProvider } from "../../context/AIContext";
import PDFViewer from "../pdf/PDFViewer";

function DocumentPreviewShell({ document, subjectId }) {
  const fileSource = "/thermo.pdf"

  return (
    <AIProvider document={document} subjectId={subjectId}>
      <div className="flex flex-1 flex-col overflow-hidden">
        <PreviewToolbar document={document} subjectId={subjectId} />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-[200px] shrink-0 flex-col border-r border-border-subtle bg-bg-elevated">
            <div className="flex flex-1 flex-col overflow-hidden">
              <BookmarksPanel />
            </div>
            <div className="flex flex-col gap-3 border-t border-border-subtle p-3">
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface-soft">
                  <Highlighter size={18} strokeWidth={1.4} className="text-ink-faint" />
                </span>
                <p className="text-[11.5px] font-medium text-ink-soft">Highlights</p>
                <p className="max-w-[160px] text-center text-[10.5px] leading-relaxed text-ink-faint">
                  Your highlights and annotations will appear here.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden bg-bg">
            <PDFViewer file={fileSource} />
          </div>

          <div className="flex w-[300px] shrink-0 flex-col border-l border-border-subtle bg-bg-elevated">
            <AIPanel document={document} subjectId={subjectId} />
          </div>
        </div>
      </div>
    </AIProvider>
  );
}

export default DocumentPreviewShell;