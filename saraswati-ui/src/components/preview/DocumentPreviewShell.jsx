import {
  Sparkles,
  StickyNote,
  Bookmark,
  Highlighter,
  Eye,
  Brain,
} from "lucide-react";

import PreviewToolbar from "./PreviewToolbar";
import PreviewPlaceholder from "./PreviewPlaceholder";

function DocumentPreviewShell({ document, subjectId }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <PreviewToolbar document={document} subjectId={subjectId} />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — bookmarks & highlights */}
        <div className="flex w-[200px] shrink-0 flex-col gap-3 border-r border-border-subtle bg-bg-elevated p-3">
          <PreviewPlaceholder
            icon={Bookmark}
            label="Bookmarks"
            description="Bookmarked pages will appear here."
          />
          <PreviewPlaceholder
            icon={Highlighter}
            label="Highlights"
            description="Your highlights and annotations will appear here."
          />
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

        {/* Right sidebar — AI assistant & notes */}
        <div className="flex w-[260px] shrink-0 flex-col gap-3 border-l border-border-subtle bg-bg-elevated p-3">
          <PreviewPlaceholder
            icon={Sparkles}
            label="AI Assistant"
            description="Ask questions about this document. AI context and RAG-powered answers coming soon."
          />
          <PreviewPlaceholder
            icon={StickyNote}
            label="Notes"
            description="Take notes while studying. Your notes will be synced and searchable."
          />
          <PreviewPlaceholder
            icon={Brain}
            label="AI Context"
            description="Related concepts and cross-document references will appear here."
          />
        </div>
      </div>
    </div>
  );
}

export default DocumentPreviewShell;
