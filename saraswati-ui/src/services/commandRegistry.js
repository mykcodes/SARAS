/**
 * Command Registry — central registry of all available actions.
 *
 * Each action is a plain object with:
 *   id, label, description, icon (lucide name), category, disabled?
 *
 * Quick Actions (Feature 4) and the future command palette (Feature 10)
 * both consume this registry. No keyboard shortcuts yet — architecture only.
 */

export const ACTION_CATEGORIES = {
  ai: "AI Assistant",
  document: "Document",
  navigation: "Navigation",
  workspace: "Workspace",
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
    disabled: true,
  },
  {
    id: "mindmap",
    label: "Create Mind Map",
    description: "Generate a visual mind map of concepts",
    icon: "Network",
    category: "ai",
    disabled: true,
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
];

/**
 * Returns actions filtered by category.
 */
export function getActionsByCategory(category) {
  return ACTIONS.filter((a) => a.category === category);
}

/**
 * Returns a single action by ID.
 */
export function getActionById(id) {
  return ACTIONS.find((a) => a.id === id) ?? null;
}
