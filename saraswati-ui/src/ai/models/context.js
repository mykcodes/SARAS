export const ContextType = {
  WORKSPACE: "workspace",
  SUBJECT: "subject",
  DOCUMENT: "document",
  MULTI_DOCUMENT: "multi-document",
  PAGE_RANGE: "page-range",
  HIGHLIGHTED: "highlighted",
  NOTES: "notes",
  BOOKMARKS: "bookmarks",
  CONVERSATION: "conversation",
};

export function createContextObject({
  type,
  subjectId,
  documentIds,
  pageRange,
  highlightedText,
  noteIds,
  bookmarkIds,
  conversationId,
}) {
  return {
    type: type ?? ContextType.DOCUMENT,
    subjectId: subjectId ?? null,
    documentIds: documentIds ?? [],
    pageRange: pageRange ?? null,
    highlightedText: highlightedText ?? null,
    noteIds: noteIds ?? [],
    bookmarkIds: bookmarkIds ?? [],
    conversationId: conversationId ?? null,
    createdAt: new Date().toISOString(),
  };
}

export function buildContext(selectionMode, params) {
  const base = {
    subjectId: params.subjectId ?? null,
    documentIds: [],
    pageRange: null,
    highlightedText: null,
    noteIds: [],
    bookmarkIds: [],
    conversationId: null,
  };

  switch (selectionMode) {
    case "workspace":
      return createContextObject({
        ...base,
        type: ContextType.WORKSPACE,
      });

    case "subject":
      return createContextObject({
        ...base,
        type: ContextType.SUBJECT,
      });

    case "document":
      return createContextObject({
        ...base,
        type: ContextType.DOCUMENT,
        documentIds: params.documentId ? [params.documentId] : [],
      });

    case "multi":
      return createContextObject({
        ...base,
        type: ContextType.MULTI_DOCUMENT,
        documentIds: params.documentIds ?? [],
      });

    case "pages":
      return createContextObject({
        ...base,
        type: ContextType.PAGE_RANGE,
        documentIds: params.documentId ? [params.documentId] : [],
        pageRange: params.pageRange ?? { start: 1, end: 1 },
      });

    case "highlighted":
      return createContextObject({
        ...base,
        type: ContextType.HIGHLIGHTED,
        documentIds: params.documentId ? [params.documentId] : [],
        highlightedText: params.highlightedText ?? "",
      });

    case "notes":
      return createContextObject({
        ...base,
        type: ContextType.NOTES,
        noteIds: params.noteIds ?? [],
      });

    case "bookmarks":
      return createContextObject({
        ...base,
        type: ContextType.BOOKMARKS,
        bookmarkIds: params.bookmarkIds ?? [],
      });

    case "conversation":
      return createContextObject({
        ...base,
        type: ContextType.CONVERSATION,
        conversationId: params.conversationId ?? null,
      });

    default:
      return createContextObject({
        ...base,
        type: ContextType.DOCUMENT,
        documentIds: params.documentId ? [params.documentId] : [],
      });
  }
}

export function getContextLabel(context) {
  switch (context.type) {
    case ContextType.WORKSPACE:
      return "Entire Workspace";
    case ContextType.SUBJECT:
      return "Entire Subject";
    case ContextType.DOCUMENT:
      return "Current Document";
    case ContextType.MULTI_DOCUMENT:
      return `${context.documentIds.length} Documents`;
    case ContextType.PAGE_RANGE:
      return context.pageRange
        ? `Pages ${context.pageRange.start}–${context.pageRange.end}`
        : "Selected Pages";
    case ContextType.HIGHLIGHTED:
      return "Highlighted Text";
    case ContextType.NOTES:
      return `${context.noteIds.length} Notes`;
    case ContextType.BOOKMARKS:
      return `${context.bookmarkIds.length} Bookmarks`;
    case ContextType.CONVERSATION:
      return "Conversation History";
    default:
      return "Unknown Context";
  }
}

export function isContextEmpty(context) {
  if (!context) return true;
  if (context.type === ContextType.WORKSPACE || context.type === ContextType.SUBJECT) {
    return !context.subjectId;
  }
  if (context.type === ContextType.HIGHLIGHTED) {
    return !context.highlightedText;
  }
  return (
    context.documentIds.length === 0 &&
    context.noteIds.length === 0 &&
    context.bookmarkIds.length === 0
  );
}
