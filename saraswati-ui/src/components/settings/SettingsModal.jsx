import { useState, useEffect } from "react";
import { X, User, Monitor, Layout, FileText, Sparkles, HardDrive, Info } from "lucide-react";
import { useApp } from "../../context/AppContext";

const TABS = [
  { id: "general", label: "General", icon: User },
  { id: "appearance", label: "Appearance", icon: Monitor },
  { id: "workspace", label: "Workspace", icon: Layout },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "ai", label: "AI Preferences", icon: Sparkles },
  { id: "storage", label: "Storage", icon: HardDrive },
  { id: "about", label: "About", icon: Info },
];

function SettingsModal() {
  const { isSettingsOpen, closeSettings, preferences, updatePreference, addToast, emptyAllTrash } = useApp();
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (!isSettingsOpen) return;
    function onKey(e) {
      if (e.key === "Escape") closeSettings();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isSettingsOpen, closeSettings]);

  if (!isSettingsOpen) return null;

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all local data? This action is destructive and cannot be undone.")) {
      emptyAllTrash();
      localStorage.clear();
      addToast("Local data cleared successfully", "success");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Application Name</h3>
              <input type="text" disabled value="SARASWATI" className="w-full max-w-sm rounded-lg border border-border-subtle bg-surface px-3 py-2 text-[13px] text-ink-soft opacity-70" />
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Language</h3>
              <select className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink" defaultValue="en">
                <option value="en">English (US)</option>
              </select>
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Default Landing Page</h3>
              <select
                value={preferences.landingPage || "home"}
                onChange={(e) => updatePreference("landingPage", e.target.value)}
                className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink"
              >
                <option value="home">Home</option>
                <option value="subjects">Subjects</option>
                <option value="recent">Recent</option>
              </select>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Theme</h3>
              <select
                value={preferences.theme || "system"}
                onChange={(e) => updatePreference("theme", e.target.value)}
                className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            <label className="flex max-w-sm items-center justify-between">
              <span className="text-[13px] font-medium text-ink">Sidebar Collapsed by Default</span>
              <input
                type="checkbox"
                checked={preferences.sidebarCollapsed || false}
                onChange={(e) => updatePreference("sidebarCollapsed", e.target.checked)}
                className="h-4 w-4 rounded border-border-subtle text-gold"
              />
            </label>
            <label className="flex max-w-sm items-center justify-between">
              <span className="text-[13px] font-medium text-ink">Enable Animations</span>
              <input
                type="checkbox"
                checked={preferences.animationsEnabled ?? true}
                onChange={(e) => updatePreference("animationsEnabled", e.target.checked)}
                className="h-4 w-4 rounded border-border-subtle text-gold"
              />
            </label>
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">UI Density (Future)</h3>
              <select className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink" defaultValue="comfortable">
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>
        );

      case "workspace":
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Default View Mode</h3>
              <select
                value={preferences.viewMode || "grid"}
                onChange={(e) => updatePreference("viewMode", e.target.value)}
                className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
              </select>
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Default Sort Preference</h3>
              <select
                value={preferences.sortMode || "newest"}
                onChange={(e) => updatePreference("sortMode", e.target.value)}
                className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Default Filter</h3>
              <select
                value={preferences.activeFilter || "all"}
                onChange={(e) => updatePreference("activeFilter", e.target.value)}
                className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink"
              >
                <option value="all">All Documents</option>
                <option value="pdf">PDFs Only</option>
                <option value="notes">Notes Only</option>
              </select>
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Document Layout</h3>
              <select
                value={preferences.documentLayout || "standard"}
                onChange={(e) => updatePreference("documentLayout", e.target.value)}
                className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink"
              >
                <option value="standard">Standard</option>
                <option value="wide">Wide</option>
              </select>
            </div>
            <label className="flex max-w-sm items-center justify-between">
              <span className="text-[13px] font-medium text-ink">Remember Last Opened Subject</span>
              <input
                type="checkbox"
                checked={preferences.rememberLastSubject ?? true}
                onChange={(e) => updatePreference("rememberLastSubject", e.target.checked)}
                className="h-4 w-4 rounded border-border-subtle text-gold"
              />
            </label>
          </div>
        );

      case "documents":
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Default Upload Behavior</h3>
              <select
                value={preferences.uploadBehavior || "auto"}
                onChange={(e) => updatePreference("uploadBehavior", e.target.value)}
                className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink"
              >
                <option value="auto">Auto-Index on Upload</option>
                <option value="manual">Manual Indexing</option>
              </select>
            </div>
            <label className="flex max-w-sm items-center justify-between">
              <span className="text-[13px] font-medium text-ink">Auto Open After Upload</span>
              <input
                type="checkbox"
                checked={preferences.autoOpenUpload ?? true}
                onChange={(e) => updatePreference("autoOpenUpload", e.target.checked)}
                className="h-4 w-4 rounded border-border-subtle text-gold"
              />
            </label>
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Recent Documents Limit</h3>
              <input
                type="number"
                value={preferences.recentDocsLimit || 20}
                onChange={(e) => updatePreference("recentDocsLimit", parseInt(e.target.value))}
                className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink"
              />
            </div>
          </div>
        );

      case "ai":
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Preferred AI Provider</h3>
              <select className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink" defaultValue="saraswati">
                <option value="saraswati">SARASWATI Core (Local)</option>
                <option value="openai">OpenAI Placeholder</option>
              </select>
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Model Selection (Future)</h3>
              <select className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink" defaultValue="default">
                <option value="default">Default Optimized Model</option>
              </select>
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Response Style</h3>
              <select
                value={preferences.aiResponseStyle || "balanced"}
                onChange={(e) => updatePreference("aiResponseStyle", e.target.value)}
                className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink"
              >
                <option value="concise">Concise</option>
                <option value="balanced">Balanced</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Citation Preference</h3>
              <select
                value={preferences.aiCitationStyle || "inline"}
                onChange={(e) => updatePreference("aiCitationStyle", e.target.value)}
                className="w-full max-w-sm rounded-lg border border-border-subtle bg-bg px-3 py-2 text-[13px] text-ink"
              >
                <option value="inline">Inline Citations</option>
                <option value="footnote">Footnotes</option>
              </select>
            </div>
            <label className="flex max-w-sm items-center justify-between">
              <span className="text-[13px] font-medium text-ink">Enable Response Streaming</span>
              <input
                type="checkbox"
                checked={preferences.aiStreaming ?? true}
                onChange={(e) => updatePreference("aiStreaming", e.target.checked)}
                className="h-4 w-4 rounded border-border-subtle text-gold"
              />
            </label>
          </div>
        );

      case "storage":
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Local Storage Usage</h3>
              <p className="text-[13px] text-ink-soft">1.2 GB of 5 GB used</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div className="rounded-lg border border-border-subtle p-3">
                <span className="block text-[11px] text-ink-soft">Subjects</span>
                <span className="block mt-1 text-[16px] font-semibold text-ink">5</span>
              </div>
              <div className="rounded-lg border border-border-subtle p-3">
                <span className="block text-[11px] text-ink-soft">Documents</span>
                <span className="block mt-1 text-[16px] font-semibold text-ink">11</span>
              </div>
              <div className="rounded-lg border border-border-subtle p-3">
                <span className="block text-[11px] text-ink-soft">Notes</span>
                <span className="block mt-1 text-[16px] font-semibold text-ink">5</span>
              </div>
              <div className="rounded-lg border border-border-subtle p-3">
                <span className="block text-[11px] text-ink-soft">Bookmarks</span>
                <span className="block mt-1 text-[16px] font-semibold text-ink">5</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 max-w-sm">
              <button className="rounded-lg border border-border-subtle px-4 py-2 text-[13px] font-medium transition-colors hover:bg-surface-hover">
                Export Workspace
              </button>
              <button className="rounded-lg border border-border-subtle px-4 py-2 text-[13px] font-medium transition-colors hover:bg-surface-hover">
                Import Workspace
              </button>
              <button onClick={handleClearData} className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-500/20">
                Clear Local Data
              </button>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-2 text-[14px] font-semibold text-ink">Application Version</h3>
              <p className="text-[13px] text-ink-soft">v1.0.0-beta</p>
            </div>
            <div>
              <h3 className="mb-2 text-[14px] font-semibold text-ink">Frontend Framework</h3>
              <p className="text-[13px] text-ink-soft">React 18 / Vite / Tailwind CSS</p>
            </div>
            <div>
              <h3 className="mb-2 text-[14px] font-semibold text-ink">Build Information</h3>
              <p className="text-[13px] text-ink-soft">Hash: 7a8b9c0d • Date: Oct 2023</p>
            </div>
            <div>
              <h3 className="mb-2 text-[14px] font-semibold text-ink">Future Backend Status</h3>
              <p className="text-[13px] text-ink-soft">Placeholder for cloud sync and hosted AI APIs.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closeSettings}>
      <div 
        className="modal-content flex h-[80vh] max-h-[800px] w-[900px] overflow-hidden rounded-2xl border border-border-subtle bg-bg-elevated shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-[240px] shrink-0 flex-col border-r border-border-subtle bg-surface px-4 py-6">
          <h2 className="mb-6 px-2 text-[18px] font-bold text-ink">Settings</h2>
          <nav className="flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
                  activeTab === tab.id
                    ? "bg-gold/10 font-medium text-gold"
                    : "text-ink-soft hover:bg-surface-hover hover:text-ink"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden px-10 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[20px] font-semibold text-ink">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h2>
            <button onClick={closeSettings} className="rounded-md p-1.5 text-ink-faint hover:bg-surface hover:text-ink transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
