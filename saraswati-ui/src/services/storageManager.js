import {
  SUBJECTS,
  DOCUMENTS,
  WORKSPACE_INSIGHTS,
  EXTENDED_INSIGHTS,
  MOCK_CONVERSATIONS,
} from "../lib/data";

const STORAGE_KEY_PREFIX = "saraswati_";
const INIT_FLAG_KEY = "saraswati_initialized";

class StorageManager {
  constructor() {
    this.listeners = new Map();
    this.initializeData();
  }

  // PubSub mechanism
  subscribe(collection, callback) {
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, new Set());
    }
    this.listeners.get(collection).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(collection);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  publish(collection) {
    const callbacks = this.listeners.get(collection);
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }

  // Core Storage Methods
  getItem(key, defaultValue = null) {
    const item = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    return item ? JSON.parse(item) : defaultValue;
  }

  setItem(key, value) {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(value));
    this.publish(key);
  }

  removeItem(key) {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
    this.publish(key);
  }

  // Initialization
  initializeData() {
    const isInitialized = localStorage.getItem(INIT_FLAG_KEY);
    if (!isInitialized) {
      // Seed Subjects
      this.setItem("subjects", SUBJECTS);

      // Seed Documents (flat array)
      const flatDocs = [];
      Object.entries(DOCUMENTS).forEach(([subjectId, docs]) => {
        docs.forEach(doc => {
          flatDocs.push({ ...doc, subjectId });
        });
      });
      this.setItem("documents", flatDocs);

      // Seed Insights
      this.setItem("workspace_insights", WORKSPACE_INSIGHTS);
      this.setItem("extended_insights", EXTENDED_INSIGHTS);

      // Seed Conversations
      this.setItem("conversations", MOCK_CONVERSATIONS);

      // Seed others as empty arrays
      this.setItem("activities", []);
      this.setItem("trash", []);
      this.setItem("notes", []); // Flat array of notes
      this.setItem("preferences", {});

      localStorage.setItem(INIT_FLAG_KEY, "true");
    }
  }
}

// Export a singleton instance
export const storageManager = new StorageManager();
