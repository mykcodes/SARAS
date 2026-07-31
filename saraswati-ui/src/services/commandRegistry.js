export const ACTION_CATEGORIES = {
  ai: "AI Assistant",
  document: "Document",
  navigation: "Navigation",
  workspace: "Workspace",
  notes: "Notes",
};

export const ACTIONS = [
  {
    id: "summarize",
    label: "Summarize this document",
    description: "Generate a concise summary of key concepts",
    icon: "FileText",
    category: "ai",
    disabled: false,
  },
  {
    id: "flashcards",
    label: "Generate Flashcards",
    description: "Create study flashcards from document content",
    icon: "Layers",
    category: "ai",
    disabled: false,
  },
  {
    id: "quiz",
    label: "Generate Quiz",
    description: "Create a practice quiz based on the material",
    icon: "HelpCircle",
    category: "ai",
    disabled: false,
  },
  {
    id: "explain",
    label: "Explain Difficult Concepts",
    description: "Break down complex topics into simple explanations",
    icon: "Lightbulb",
    category: "ai",
    disabled: false,
  },
  {
    id: "topics",
    label: "Find Important Topics",
    description: "Identify the most critical topics for revision",
    icon: "Target",
    category: "ai",
    disabled: false,
  },
  {
    id: "compare",
    label: "Compare Documents",
    description: "Compare content across multiple documents",
    icon: "GitCompare",
    category: "ai",
    disabled: false,
  },
  {
    id: "mindmap",
    label: "Create Mind Map",
    description: "Generate a visual mind map of concepts",
    icon: "Network",
    category: "ai",
    disabled: false,
  },
  {
    id: "formulae",
    label: "Extract Formulae",
    description: "Find and list all formulas and equations",
    icon: "Sigma",
    category: "ai",
    disabled: false,
  },
  {
    id: "definitions",
    label: "Extract Definitions",
    description: "Pull out key definitions and terminology",
    icon: "BookOpen",
    category: "ai",
    disabled: false,
  },
  {
    id: "delete-document",
    label: "Delete Document",
    description: "Move document to trash",
    icon: "Trash2",
    category: "document",
    disabled: false,
  },
  {
    id: "favorite-document",
    label: "Toggle Favorite",
    description: "Add or remove document from favorites",
    icon: "Star",
    category: "document",
    disabled: false,
  },
  {
    id: "move-document",
    label: "Move Document",
    description: "Move document to another subject",
    icon: "FolderInput",
    category: "document",
    disabled: false,
  },
  {
    id: "download-document",
    label: "Download Document",
    description: "Download document to local storage",
    icon: "Download",
    category: "document",
    disabled: false,
  },
  {
    id: "document-details",
    label: "Document Details",
    description: "View document metadata and properties",
    icon: "Info",
    category: "document",
    disabled: false,
  },
  {
    id: "upload-document",
    label: "Upload Document",
    description: "Upload a new document to the workspace",
    icon: "UploadCloud",
    category: "workspace",
    disabled: false,
  },
  {
    id: "toggle-insights",
    label: "Toggle Insights Panel",
    description: "Show or hide the insights panel",
    icon: "PanelRightOpen",
    category: "workspace",
    disabled: false,
  },
  {
    id: "create-note",
    label: "Create Note",
    description: "Create a new note",
    icon: "StickyNote",
    category: "notes",
    disabled: false,
  },
  {
    id: "create-tag",
    label: "Create Tag",
    description: "Create a new reusable tag",
    icon: "Tag",
    category: "workspace",
    disabled: false,
  },
  {
    id: "global-search",
    label: "Search Everything",
    description: "Search across all subjects, documents, and notes",
    icon: "Search",
    category: "navigation",
    disabled: false,
  },
  {
    id: "open-recent",
    label: "Recent Activity",
    description: "View recent activity across all subjects",
    icon: "Clock",
    category: "navigation",
    disabled: false,
  },
  {
    id: "open-favorites",
    label: "Favorites",
    description: "View all favorited items",
    icon: "Star",
    category: "navigation",
    disabled: false,
  },
  {
    id: "open-trash",
    label: "Trash",
    description: "View and manage deleted items",
    icon: "Trash2",
    category: "navigation",
    disabled: false,
  },
];

export function getActionsByCategory(category) {
  return ACTIONS.filter((a) => a.category === category);
}

export function getActionById(id) {
  return ACTIONS.find((a) => a.id === id) ?? null;
}

export function getEnabledActions() {
  return ACTIONS.filter((a) => !a.disabled);
}
