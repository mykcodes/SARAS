import { Highlighter, Eye } from "lucide-react";

import PreviewToolbar from "./PreviewToolbar";
import BookmarksPanel from "../bookmarks/BookmarksPanel";
import AIPanel from "../ai/AIPanel";
import { AIProvider } from "../../context/AIContext";

function DocumentPreviewShell({ document, subjectId }) {
  return (
    <AIProvider document={document} subjectId={subjectId}>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <PreviewToolbar document={document} subjectId={subjectId} />

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar — bookmarks & highlights */}
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

          {/* Center — Document viewer */}
          <div className="flex flex-1 flex-col items-center justify-center bg-bg p-8">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-12">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-border-default bg-surface-soft">
                <Eye size={32} strokeWidth={1.4} className="text-gold" />
              </span>
              <h3 className="text-[17px] font-semibold text-ink">
                Document Viewer
              </h3>
              <p className="max-w-[300px] text-center text-[13px] leading-relaxed text-ink-soft">
                The PDF viewer and annotation layer will be rendered here. This
                is a production-ready shell reserved for the document rendering engine.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-md border border-border-subtle bg-surface-soft px-2.5 py-1 text-[11px] text-ink-faint">
                  PDF Viewer
                </span>
                <span className="rounded-md border border-border-subtle bg-surface-soft px-2.5 py-1 text-[11px] text-ink-faint">
                  Annotations
                </span>
                <span className="rounded-md border border-border-subtle bg-surface-soft px-2.5 py-1 text-[11px] text-ink-faint">
                  OCR
                </span>
              </div>
            </div>
          </div>

          {/* Right sidebar — AI assistant panel (tabbed: AI / Notes / Bookmarks) */}
          <div className="flex w-[300px] shrink-0 flex-col border-l border-border-subtle bg-bg-elevated">
            <AIPanel document={document} subjectId={subjectId} />
          </div>
        </div>
      </div>
    </AIProvider>
  );
}

export default DocumentPreviewShell;
