const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days) => new Date(Date.now() - days * DAY_MS).toISOString();
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

export const NAV_ITEMS = [
  { id: "home", label: "Home", to: "/" },
  { id: "subjects", label: "Subjects", badge: 6, to: "/subjects" },
  { id: "recent", label: "Recent", to: "/recent" },
  { id: "favorites", label: "Favorites", to: "/favorites" },
  { id: "trash", label: "Trash", to: "/trash" },
];

/**
 * Subject mock data, shaped as if it came directly from a backend API.
 * - id: stable identifier used for routing (/subjects/:subjectId), never the title
 * - color: accent used for the folder icon chip
 * - createdAt / updatedAt: ISO timestamps; display strings are derived at
 *   render time via lib/formatters, not stored pre-formatted
 * - tags / aiMeta: reserved for future features (filtering, AI summaries)
 */
export const SUBJECTS = [
  {
    id: "dbms",
    title: "DBMS",
    description: "Database design, normalization, transactions and SQL query practice.",
    color: "#D9A441",
    createdAt: daysAgo(45),
    updatedAt: daysAgo(5),
    fileCount: 3,
    storageUsed: 12400000,
    tags: [],
    aiMeta: { status: "indexed", lastIndexed: daysAgo(5) },
  },
  {
    id: "computer-networks",
    title: "Computer Networks",
    description: "OSI layers, routing protocols, and network security fundamentals.",
    color: "#5F8F4E",
    createdAt: daysAgo(38),
    updatedAt: daysAgo(3),
    fileCount: 2,
    storageUsed: 8200000,
    tags: [],
    aiMeta: { status: "indexed", lastIndexed: daysAgo(3) },
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Supervised and unsupervised learning models with applied case studies.",
    color: "#3E6FA8",
    createdAt: daysAgo(50),
    updatedAt: daysAgo(6),
    fileCount: 3,
    storageUsed: 15800000,
    tags: [],
    aiMeta: { status: "partial", lastIndexed: daysAgo(10) },
  },
  {
    id: "operating-systems",
    title: "Operating Systems",
    description: "Process scheduling, memory management, and file system internals.",
    color: "#B96A32",
    createdAt: daysAgo(60),
    updatedAt: daysAgo(7),
    fileCount: 2,
    storageUsed: 6500000,
    tags: [],
    aiMeta: { status: "indexed", lastIndexed: daysAgo(7) },
  },
  {
    id: "semester-notes",
    title: "Semester Notes",
    description: "Consolidated revision notes across all subjects this semester.",
    color: "#2F9490",
    createdAt: daysAgo(70),
    updatedAt: daysAgo(14),
    fileCount: 1,
    storageUsed: 3200000,
    tags: [],
    aiMeta: { status: "pending", lastIndexed: null },
  },
];

/**
 * Document mock data keyed by subject ID.
 *
 * Each document mirrors what a backend would return:
 *   id, title, type, size (bytes), pages, uploadedAt, updatedAt,
 *   lastOpened, favorite, indexed, thumbnailPlaceholder,
 *   embeddingStatus, summary, tags
 */
export const DOCUMENTS = {
  dbms: [
    {
      id: "doc-dbms-1",
      title: "ER Diagrams & Normalization",
      type: "pdf",
      size: 4200000,
      pages: 42,
      uploadedAt: daysAgo(40),
      updatedAt: daysAgo(5),
      lastOpened: hoursAgo(6),
      favorite: true,
      indexed: true,
      thumbnailPlaceholder: null,
      embeddingStatus: "complete",
      summary: null,
      tags: ["normalization", "er-diagrams"],
    },
    {
      id: "doc-dbms-2",
      title: "SQL Practice Problems",
      type: "docx",
      size: 1800000,
      pages: 18,
      uploadedAt: daysAgo(35),
      updatedAt: daysAgo(12),
      lastOpened: daysAgo(2),
      favorite: false,
      indexed: true,
      thumbnailPlaceholder: null,
      embeddingStatus: "complete",
      summary: null,
      tags: ["sql", "practice"],
    },
    {
      id: "doc-dbms-3",
      title: "Transaction Management Slides",
      type: "pptx",
      size: 6400000,
      pages: 56,
      uploadedAt: daysAgo(30),
      updatedAt: daysAgo(8),
      lastOpened: daysAgo(4),
      favorite: false,
      indexed: true,
      thumbnailPlaceholder: null,
      embeddingStatus: "complete",
      summary: null,
      tags: ["transactions", "acid"],
    },
  ],
  "computer-networks": [
    {
      id: "doc-cn-1",
      title: "OSI Model Overview",
      type: "pdf",
      size: 3100000,
      pages: 28,
      uploadedAt: daysAgo(36),
      updatedAt: daysAgo(3),
      lastOpened: hoursAgo(12),
      favorite: true,
      indexed: true,
      thumbnailPlaceholder: null,
      embeddingStatus: "complete",
      summary: null,
      tags: ["osi", "layers"],
    },
    {
      id: "doc-cn-2",
      title: "Network Topology Diagrams",
      type: "image",
      size: 5100000,
      pages: 1,
      uploadedAt: daysAgo(20),
      updatedAt: daysAgo(10),
      lastOpened: daysAgo(5),
      favorite: false,
      indexed: false,
      thumbnailPlaceholder: null,
      embeddingStatus: "pending",
      summary: null,
      tags: ["topology"],
    },
  ],
  "machine-learning": [
    {
      id: "doc-ml-1",
      title: "Linear Regression Deep Dive",
      type: "pdf",
      size: 5600000,
      pages: 64,
      uploadedAt: daysAgo(48),
      updatedAt: daysAgo(6),
      lastOpened: hoursAgo(3),
      favorite: true,
      indexed: true,
      thumbnailPlaceholder: null,
      embeddingStatus: "complete",
      summary: null,
      tags: ["regression", "supervised"],
    },
    {
      id: "doc-ml-2",
      title: "K-Means Clustering Notes",
      type: "docx",
      size: 2200000,
      pages: 22,
      uploadedAt: daysAgo(42),
      updatedAt: daysAgo(15),
      lastOpened: daysAgo(7),
      favorite: false,
      indexed: true,
      thumbnailPlaceholder: null,
      embeddingStatus: "complete",
      summary: null,
      tags: ["clustering", "unsupervised"],
    },
    {
      id: "doc-ml-3",
      title: "Neural Networks Presentation",
      type: "pptx",
      size: 8000000,
      pages: 48,
      uploadedAt: daysAgo(25),
      updatedAt: daysAgo(10),
      lastOpened: daysAgo(3),
      favorite: true,
      indexed: false,
      thumbnailPlaceholder: null,
      embeddingStatus: "processing",
      summary: null,
      tags: ["neural-networks", "deep-learning"],
    },
  ],
  "operating-systems": [
    {
      id: "doc-os-1",
      title: "Process Scheduling Algorithms",
      type: "pdf",
      size: 3800000,
      pages: 35,
      uploadedAt: daysAgo(55),
      updatedAt: daysAgo(7),
      lastOpened: daysAgo(1),
      favorite: false,
      indexed: true,
      thumbnailPlaceholder: null,
      embeddingStatus: "complete",
      summary: null,
      tags: ["scheduling", "processes"],
    },
    {
      id: "doc-os-2",
      title: "Memory Management Cheat Sheet",
      type: "pdf",
      size: 2700000,
      pages: 12,
      uploadedAt: daysAgo(50),
      updatedAt: daysAgo(20),
      lastOpened: daysAgo(10),
      favorite: true,
      indexed: true,
      thumbnailPlaceholder: null,
      embeddingStatus: "complete",
      summary: null,
      tags: ["memory", "paging"],
    },
  ],
  "semester-notes": [
    {
      id: "doc-sn-1",
      title: "Mid-Semester Consolidated Notes",
      type: "pdf",
      size: 3200000,
      pages: 85,
      uploadedAt: daysAgo(60),
      updatedAt: daysAgo(14),
      lastOpened: daysAgo(7),
      favorite: true,
      indexed: false,
      thumbnailPlaceholder: null,
      embeddingStatus: "pending",
      summary: null,
      tags: ["revision", "consolidated"],
    },
  ],
};

/**
 * Workspace insights mock data keyed by subject ID.
 * Each widget's data is a separate key so components can consume only
 * what they need, and real analytics can replace individual values later.
 */
export const WORKSPACE_INSIGHTS = {
  dbms: {
    studyProgress: 72,
    topicsCovered: [
      { name: "ER Diagrams", covered: true },
      { name: "Normalization", covered: true },
      { name: "SQL Queries", covered: true },
      { name: "Transactions", covered: false },
      { name: "Concurrency Control", covered: false },
    ],
    lastStudySession: hoursAgo(6),
    examReadiness: 68,
    recentActivity: [
      { action: "Opened", target: "ER Diagrams & Normalization", time: hoursAgo(6) },
      { action: "Favorited", target: "ER Diagrams & Normalization", time: daysAgo(1) },
      { action: "Uploaded", target: "Transaction Management Slides", time: daysAgo(30) },
    ],
    aiIndexStatus: { indexed: 3, total: 3, lastRun: daysAgo(5) },
    recommendedNext: "Review Transaction Management Slides — you haven't covered ACID properties yet.",
    recentUploads: [
      { title: "Transaction Management Slides", time: daysAgo(30) },
      { title: "SQL Practice Problems", time: daysAgo(35) },
    ],
  },
  "computer-networks": {
    studyProgress: 45,
    topicsCovered: [
      { name: "OSI Model", covered: true },
      { name: "TCP/IP", covered: false },
      { name: "Routing Protocols", covered: false },
      { name: "Network Security", covered: false },
    ],
    lastStudySession: hoursAgo(12),
    examReadiness: 38,
    recentActivity: [
      { action: "Opened", target: "OSI Model Overview", time: hoursAgo(12) },
      { action: "Uploaded", target: "Network Topology Diagrams", time: daysAgo(20) },
    ],
    aiIndexStatus: { indexed: 1, total: 2, lastRun: daysAgo(3) },
    recommendedNext: "Upload TCP/IP notes — the OSI model alone covers only one layer of the syllabus.",
    recentUploads: [
      { title: "Network Topology Diagrams", time: daysAgo(20) },
    ],
  },
  "machine-learning": {
    studyProgress: 58,
    topicsCovered: [
      { name: "Linear Regression", covered: true },
      { name: "K-Means Clustering", covered: true },
      { name: "Neural Networks", covered: false },
      { name: "Decision Trees", covered: false },
      { name: "SVMs", covered: false },
    ],
    lastStudySession: hoursAgo(3),
    examReadiness: 52,
    recentActivity: [
      { action: "Opened", target: "Linear Regression Deep Dive", time: hoursAgo(3) },
      { action: "Favorited", target: "Neural Networks Presentation", time: daysAgo(2) },
      { action: "Uploaded", target: "Neural Networks Presentation", time: daysAgo(25) },
    ],
    aiIndexStatus: { indexed: 2, total: 3, lastRun: daysAgo(6) },
    recommendedNext: "Finish reviewing Neural Networks Presentation — AI indexing is still in progress.",
    recentUploads: [
      { title: "Neural Networks Presentation", time: daysAgo(25) },
    ],
  },
  "operating-systems": {
    studyProgress: 65,
    topicsCovered: [
      { name: "Process Scheduling", covered: true },
      { name: "Memory Management", covered: true },
      { name: "File Systems", covered: false },
      { name: "Deadlocks", covered: false },
    ],
    lastStudySession: daysAgo(1),
    examReadiness: 60,
    recentActivity: [
      { action: "Opened", target: "Process Scheduling Algorithms", time: daysAgo(1) },
      { action: "Opened", target: "Memory Management Cheat Sheet", time: daysAgo(10) },
    ],
    aiIndexStatus: { indexed: 2, total: 2, lastRun: daysAgo(7) },
    recommendedNext: "Upload file system notes — two key topics are still missing from your collection.",
    recentUploads: [
      { title: "Memory Management Cheat Sheet", time: daysAgo(50) },
    ],
  },
  "semester-notes": {
    studyProgress: 20,
    topicsCovered: [
      { name: "DBMS Basics", covered: true },
      { name: "Networking Basics", covered: false },
      { name: "ML Foundations", covered: false },
      { name: "OS Concepts", covered: false },
    ],
    lastStudySession: daysAgo(7),
    examReadiness: 15,
    recentActivity: [
      { action: "Opened", target: "Mid-Semester Consolidated Notes", time: daysAgo(7) },
    ],
    aiIndexStatus: { indexed: 0, total: 1, lastRun: null },
    recommendedNext: "Start by getting your notes AI-indexed so SARASWATI can help you study effectively.",
    recentUploads: [
      { title: "Mid-Semester Consolidated Notes", time: daysAgo(60) },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helper accessors — these are the only functions components should call.
// When a real API is wired in, only these need to change.
// ---------------------------------------------------------------------------

export function getSubjectById(id) {
  return SUBJECTS.find((subject) => subject.id === id);
}

export function getDocumentsBySubjectId(subjectId) {
  return DOCUMENTS[subjectId] ?? [];
}

export function getDocumentById(subjectId, documentId) {
  const docs = getDocumentsBySubjectId(subjectId);
  return docs.find((doc) => doc.id === documentId) ?? null;
}

export function getInsightsBySubjectId(subjectId) {
  return WORKSPACE_INSIGHTS[subjectId] ?? null;
}

export const USER = {
  name: "Mayank",
  role: "B.Tech - Final Year",
  initial: "M",
};

export const STORAGE = {
  used: 1.2,
  total: 5,
  unit: "GB",
};

// ---------------------------------------------------------------------------
// Extended Insights — additional widget data keyed by subject ID
// ---------------------------------------------------------------------------

export const EXTENDED_INSIGHTS = {
  dbms: {
    weakTopics: [
      { name: "Concurrency Control", confidence: 22 },
      { name: "Transactions (ACID)", confidence: 35 },
      { name: "Query Optimization", confidence: 40 },
    ],
    studyStreak: { currentDays: 5, longestDays: 12, lastStudied: hoursAgo(6) },
    aiUsage: { totalQuestions: 47, avgPerSession: 6, lastUsed: hoursAgo(6) },
    revisionReminder: {
      nextReview: "Normalization — due in 2 days",
      overdueCount: 1,
      overdueTopic: "ER Diagrams",
    },
    readingTime: { totalMinutes: 340, avgPerDoc: 28, lastSession: 45 },
    frequentConcepts: [
      { name: "Normalization", count: 18 },
      { name: "SQL Joins", count: 14 },
      { name: "ER Diagrams", count: 12 },
      { name: "ACID Properties", count: 9 },
      { name: "Indexing", count: 7 },
    ],
  },
  "computer-networks": {
    weakTopics: [
      { name: "Routing Protocols", confidence: 18 },
      { name: "Network Security", confidence: 25 },
      { name: "TCP Congestion", confidence: 30 },
    ],
    studyStreak: { currentDays: 2, longestDays: 7, lastStudied: hoursAgo(12) },
    aiUsage: { totalQuestions: 21, avgPerSession: 5, lastUsed: hoursAgo(12) },
    revisionReminder: {
      nextReview: "OSI Model — due tomorrow",
      overdueCount: 0,
      overdueTopic: null,
    },
    readingTime: { totalMinutes: 180, avgPerDoc: 30, lastSession: 35 },
    frequentConcepts: [
      { name: "OSI Model", count: 15 },
      { name: "TCP/IP", count: 10 },
      { name: "Subnetting", count: 8 },
    ],
  },
  "machine-learning": {
    weakTopics: [
      { name: "SVMs", confidence: 15 },
      { name: "Decision Trees", confidence: 28 },
      { name: "Backpropagation", confidence: 32 },
    ],
    studyStreak: { currentDays: 3, longestDays: 9, lastStudied: hoursAgo(3) },
    aiUsage: { totalQuestions: 63, avgPerSession: 8, lastUsed: hoursAgo(3) },
    revisionReminder: {
      nextReview: "Linear Regression — due in 3 days",
      overdueCount: 2,
      overdueTopic: "K-Means Clustering",
    },
    readingTime: { totalMinutes: 520, avgPerDoc: 40, lastSession: 55 },
    frequentConcepts: [
      { name: "Gradient Descent", count: 22 },
      { name: "Overfitting", count: 16 },
      { name: "Loss Functions", count: 14 },
      { name: "Feature Scaling", count: 11 },
    ],
  },
  "operating-systems": {
    weakTopics: [
      { name: "Deadlocks", confidence: 20 },
      { name: "File Systems", confidence: 30 },
    ],
    studyStreak: { currentDays: 1, longestDays: 6, lastStudied: daysAgo(1) },
    aiUsage: { totalQuestions: 32, avgPerSession: 5, lastUsed: daysAgo(1) },
    revisionReminder: {
      nextReview: "Process Scheduling — due in 4 days",
      overdueCount: 0,
      overdueTopic: null,
    },
    readingTime: { totalMinutes: 260, avgPerDoc: 35, lastSession: 40 },
    frequentConcepts: [
      { name: "Scheduling Algorithms", count: 14 },
      { name: "Virtual Memory", count: 11 },
      { name: "Page Replacement", count: 9 },
    ],
  },
  "semester-notes": {
    weakTopics: [
      { name: "Networking Basics", confidence: 10 },
      { name: "OS Concepts", confidence: 12 },
      { name: "ML Foundations", confidence: 15 },
    ],
    studyStreak: { currentDays: 0, longestDays: 3, lastStudied: daysAgo(7) },
    aiUsage: { totalQuestions: 5, avgPerSession: 2, lastUsed: daysAgo(7) },
    revisionReminder: {
      nextReview: "All topics — overdue",
      overdueCount: 3,
      overdueTopic: "DBMS Basics",
    },
    readingTime: { totalMinutes: 60, avgPerDoc: 20, lastSession: 20 },
    frequentConcepts: [
      { name: "DBMS Basics", count: 4 },
      { name: "Revision", count: 3 },
    ],
  },
};

export function getExtendedInsightsBySubjectId(subjectId) {
  return EXTENDED_INSIGHTS[subjectId] ?? null;
}

// ---------------------------------------------------------------------------
// Mock Conversations
// ---------------------------------------------------------------------------

export const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    title: "Normalization Forms Explained",
    subjectId: "dbms",
    subjectTitle: "DBMS",
    createdAt: daysAgo(3),
    lastMessage: "The difference between 3NF and BCNF is subtle but important…",
    pinned: true,
    messageCount: 12,
  },
  {
    id: "conv-2",
    title: "SQL Join Types",
    subjectId: "dbms",
    subjectTitle: "DBMS",
    createdAt: daysAgo(5),
    lastMessage: "CROSS JOIN produces the Cartesian product of both tables…",
    pinned: false,
    messageCount: 8,
  },
  {
    id: "conv-3",
    title: "OSI vs TCP/IP Model",
    subjectId: "computer-networks",
    subjectTitle: "Computer Networks",
    createdAt: daysAgo(2),
    lastMessage: "The OSI model has 7 layers while TCP/IP consolidates into 4…",
    pinned: true,
    messageCount: 15,
  },
  {
    id: "conv-4",
    title: "Gradient Descent Intuition",
    subjectId: "machine-learning",
    subjectTitle: "Machine Learning",
    createdAt: daysAgo(1),
    lastMessage: "Think of gradient descent as a ball rolling downhill…",
    pinned: false,
    messageCount: 20,
  },
  {
    id: "conv-5",
    title: "Process Scheduling Comparison",
    subjectId: "operating-systems",
    subjectTitle: "Operating Systems",
    createdAt: daysAgo(4),
    lastMessage: "Round Robin is fair but can lead to higher turnaround time…",
    pinned: false,
    messageCount: 10,
  },
];

export function getConversationsBySubjectId(subjectId) {
  if (!subjectId) return MOCK_CONVERSATIONS;
  return MOCK_CONVERSATIONS.filter((c) => c.subjectId === subjectId);
}

// ---------------------------------------------------------------------------
// Mock Notes
// ---------------------------------------------------------------------------

export const MOCK_NOTES = {
  "doc-dbms-1": [
    {
      id: "note-1",
      documentId: "doc-dbms-1",
      content: "Remember: 1NF eliminates repeating groups. Each cell must contain a single value.",
      pinned: true,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
    },
    {
      id: "note-2",
      documentId: "doc-dbms-1",
      content: "BCNF is stricter than 3NF — every determinant must be a candidate key.",
      pinned: false,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
  ],
  "doc-cn-1": [
    {
      id: "note-3",
      documentId: "doc-cn-1",
      content: "Layer 4 (Transport) handles end-to-end communication. TCP vs UDP trade-offs are key.",
      pinned: true,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
  ],
  "doc-ml-1": [
    {
      id: "note-4",
      documentId: "doc-ml-1",
      content: "Cost function J(θ) measures how far predictions are from actual values. MSE is the standard for regression.",
      pinned: false,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(3),
    },
    {
      id: "note-5",
      documentId: "doc-ml-1",
      content: "Learning rate α too high → overshooting. Too low → very slow convergence.",
      pinned: true,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
  ],
};

export function getNotesByDocumentId(documentId) {
  return MOCK_NOTES[documentId] ?? [];
}

// ---------------------------------------------------------------------------
// Mock Bookmarks
// ---------------------------------------------------------------------------

export const MOCK_BOOKMARKS = [
  {
    id: "bm-1",
    type: "document",
    title: "ER Diagrams & Normalization",
    subtitle: "DBMS • 42 pages",
    documentId: "doc-dbms-1",
    subjectId: "dbms",
    createdAt: daysAgo(2),
  },
  {
    id: "bm-2",
    type: "document",
    title: "Linear Regression Deep Dive",
    subtitle: "Machine Learning • 64 pages",
    documentId: "doc-ml-1",
    subjectId: "machine-learning",
    createdAt: daysAgo(3),
  },
  {
    id: "bm-3",
    type: "ai-response",
    title: "Explanation of 3NF vs BCNF",
    subtitle: "From conversation: Normalization Forms Explained",
    conversationId: "conv-1",
    createdAt: daysAgo(1),
  },
  {
    id: "bm-4",
    type: "note",
    title: "Cost function J(θ) measures how far predictions are…",
    subtitle: "Note on Linear Regression Deep Dive",
    noteId: "note-4",
    documentId: "doc-ml-1",
    createdAt: daysAgo(4),
  },
  {
    id: "bm-5",
    type: "ai-response",
    title: "TCP vs UDP comparison table",
    subtitle: "From conversation: OSI vs TCP/IP Model",
    conversationId: "conv-3",
    createdAt: daysAgo(2),
  },
];

export function getBookmarks() {
  return MOCK_BOOKMARKS;
}

// ---------------------------------------------------------------------------
// Mock AI Response Templates
// ---------------------------------------------------------------------------

export const AI_RESPONSE_TEMPLATES = {
  summarize: {
    text: "Here's a concise summary of the key concepts in this document:\n\n**Main Topics:**\n1. The document covers foundational concepts with detailed examples and diagrams.\n2. Key terminology is introduced progressively, building on previous sections.\n3. Practical applications are demonstrated through worked examples.\n\n**Key Takeaways:**\n• The core principle relies on systematic decomposition of complex structures.\n• There are well-defined rules that govern each transformation step.\n• Edge cases are highlighted with specific attention to common misconceptions.",
    citations: [
      { documentName: "Current Document", pageNumber: 3, sectionTitle: "Introduction & Overview" },
      { documentName: "Current Document", pageNumber: 12, sectionTitle: "Core Concepts" },
      { documentName: "Current Document", pageNumber: 28, sectionTitle: "Practical Applications" },
    ],
  },
  flashcards: {
    text: "I've generated **8 flashcards** from this document:\n\n**Card 1** — *Definition*\nQ: What is the primary purpose of the technique described in Section 2?\nA: To decompose complex structures into simpler, well-defined components.\n\n**Card 2** — *Concept*\nQ: What are the three main criteria for evaluation?\nA: Correctness, efficiency, and maintainability.\n\n**Card 3** — *Application*\nQ: When should you apply the advanced variant?\nA: When the basic approach leads to redundancy or anomalies.\n\n*…and 5 more cards ready for review.*",
    citations: [
      { documentName: "Current Document", pageNumber: 5, sectionTitle: "Key Definitions" },
      { documentName: "Current Document", pageNumber: 15, sectionTitle: "Evaluation Criteria" },
    ],
  },
  quiz: {
    text: "Here's a **5-question quiz** based on this document:\n\n**Q1.** Which of the following is NOT a valid property discussed in Chapter 3?\na) Atomicity  b) Consistency  c) Redundancy  d) Isolation\n\n**Q2.** True or False: The technique in Section 4 always produces an optimal result.\n\n**Q3.** Explain the difference between the two approaches described on pages 18-22.\n\n**Q4.** What is the worst-case complexity of the algorithm in Section 5?\n\n**Q5.** Give an example where the basic approach fails and the advanced variant is needed.",
    citations: [
      { documentName: "Current Document", pageNumber: 8, sectionTitle: "Properties" },
      { documentName: "Current Document", pageNumber: 18, sectionTitle: "Approach Comparison" },
    ],
  },
  explain: {
    text: "Let me break down the most challenging concepts:\n\n**Concept 1: Decomposition**\nThink of it like organizing a messy room — you group related items together so each group serves a single purpose. In technical terms, this eliminates redundancy while preserving all the information.\n\n**Concept 2: Dependency Analysis**\nImagine a chain of dominoes — if you know one piece of information, what else can you determine? This \"chain\" is exactly what we analyze to find the optimal structure.\n\n**Why it matters:**\nWithout proper decomposition, you'd face update anomalies — changing one fact requires updating multiple places, risking inconsistency.",
    citations: [
      { documentName: "Current Document", pageNumber: 10, sectionTitle: "Decomposition Theory" },
      { documentName: "Current Document", pageNumber: 22, sectionTitle: "Dependency Analysis" },
    ],
  },
  general: {
    text: "That's a great question! Based on the content in your documents, here's what I found:\n\nThe concept you're asking about is covered in detail across several sections. The key insight is that the approach builds on foundational principles established earlier in the material.\n\nI'd recommend reviewing the referenced sections below for a deeper understanding. The examples on the cited pages are particularly helpful for building intuition.",
    citations: [
      { documentName: "Current Document", pageNumber: 7, sectionTitle: "Foundational Principles" },
      { documentName: "Current Document", pageNumber: 15, sectionTitle: "Detailed Analysis" },
    ],
  },
};