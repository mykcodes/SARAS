import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const GUTTER = 32;

function LoadingSpinner() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-border-subtle border-t-transparent" />
        <div className="h-4 w-4 rounded-full bg-ink-faint opacity-40" />
      </div>
      <p className="text-[12.5px] text-ink-faint">Loading document...</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-surface-soft text-2xl">
        
      </span>
      <p className="text-[13px] font-medium text-ink-soft">Unable to load document</p>
      <p className="max-w-[280px] text-[11.5px] leading-relaxed text-ink-faint">
        {message ?? "The file could not be displayed. It may be missing, corrupt, or an unsupported format."}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-surface-soft text-2xl">
        
      </span>
      <p className="text-[13px] font-medium text-ink-soft">No document selected</p>
      <p className="max-w-[240px] text-[11.5px] leading-relaxed text-ink-faint">
        Select a PDF from your workspace to preview it here.
      </p>
    </div>
  );
}

function PDFViewer({ file, scale = 1.0, setNumPages, currentPage, setCurrentPage }) {
  const [internalNumPages, setInternalNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const pageRefs = useRef([]);
  const isProgrammaticScroll = useRef(false);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      const available = containerRef.current.clientWidth - GUTTER;
      setPageWidth(available > 0 ? available : 0);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    observerRef.current = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [updateWidth]);

  useEffect(() => {
    setInternalNumPages(null);
    if (setNumPages) setNumPages(null);
    setError(null);
    setLoading(true);
  }, [file, setNumPages]);

  const handleLoadSuccess = useCallback(({ numPages: n }) => {
    setInternalNumPages(n);
    if (setNumPages) setNumPages(n);
    setLoading(false);
    setError(null);
  }, [setNumPages]);

  const handleLoadError = useCallback((err) => {
    setError(err?.message ?? "Failed to load PDF.");
    setLoading(false);
  }, []);

  // Programmatic scrolling (when user clicks Next/Prev)
  useEffect(() => {
    if (currentPage && pageRefs.current[currentPage - 1] && !isProgrammaticScroll.current) {
      isProgrammaticScroll.current = true;
      pageRefs.current[currentPage - 1].scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => { isProgrammaticScroll.current = false; }, 600);
    }
  }, [currentPage]);

  // Track scrolling to update current page
  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current || !setCurrentPage || !internalNumPages) return;
    const container = containerRef.current;
    if (!container) return;

    // Find the page mostly in view
    let closestPage = 1;
    let minDistance = Infinity;
    const containerCenter = container.getBoundingClientRect().top + (container.clientHeight / 2);

    for (let i = 0; i < internalNumPages; i++) {
      const el = pageRefs.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + (rect.height / 2);
        const distance = Math.abs(containerCenter - elementCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestPage = i + 1;
        }
      }
    }

    if (closestPage !== currentPage) {
      setCurrentPage(closestPage);
    }
  }, [internalNumPages, currentPage, setCurrentPage]);

  if (!file) {
    return <EmptyState />;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full w-full overflow-y-auto overflow-x-auto"
      style={{ scrollbarGutter: "stable" }}
    >
      {loading && !error && <LoadingSpinner />}
      {error && <ErrorState message={error} />}
      <Document
        file={file}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
        loading={null}
        error={null}
        className={loading || error ? "hidden" : undefined}
      >
        {internalNumPages !== null &&
          Array.from({ length: internalNumPages }, (_, i) => (
            <div
              key={i}
              ref={el => pageRefs.current[i] = el}
              className="mb-4 flex justify-center"
              style={{ paddingInline: GUTTER / 2 }}
            >
              {pageWidth > 0 && (
                <Page
                  pageNumber={i + 1}
                  width={pageWidth * scale}
                  renderTextLayer
                  renderAnnotationLayer
                  className="rounded shadow-sm"
                />
              )}
            </div>
          ))}
      </Document>
    </div>
  );
}

export default PDFViewer;