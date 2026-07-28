const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days) => new Date(Date.now() - days * DAY_MS).toISOString();
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

export const NAV_ITEMS = [
  { id: "home", label: "Home", to: "/" },
  { id: "subjects", label: "Subjects", badge: 6, to: "/subjects" },
  { id: "recent", label: "Recent" },
  { id: "favorites", label: "Favorites", to: "/favorites"  },
  { id: "trash", label: "Trash" },
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