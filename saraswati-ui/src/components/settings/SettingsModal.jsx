import { useState, useEffect } from "react";
import { X, User, Monitor, Layout, FileText, Sparkles, HardDrive, Info } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getStorageMetrics } from "../../api/storageApi";
import { formatFileSize } from "../../lib/formatters";

const TABS = [
  { id: "general", label: "General", icon: User },
  { id: "storage", label: "Storage", icon: HardDrive },
];

function SettingsModal() {
  const { isSettingsOpen, closeSettings, preferences, updatePreference, addToast, emptyAllTrash } = useApp();
  const [activeTab, setActiveTab] = useState("general");
  const [storageMetrics, setStorageMetrics] = useState(null);

  useEffect(() => {
    if (isSettingsOpen) {
      getStorageMetrics().then((data) => {
        if (data) setStorageMetrics(data);
      }).catch(() => {});
    }
  }, [isSettingsOpen]);

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

      case "storage":
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-4 text-[14px] font-semibold text-ink">Local Storage Usage</h3>
              <p className="text-[13px] text-ink-soft">
                {storageMetrics ? (
                  `${formatFileSize(storageMetrics.used_bytes)} of 5.0 GB used (${(5 * 1024 * 1024 * 1024 - storageMetrics.used_bytes > 0) ? formatFileSize(5 * 1024 * 1024 * 1024 - storageMetrics.used_bytes) : "0 B"} remaining)`
                ) : (
                  "Loading storage metrics..."
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div className="rounded-lg border border-border-subtle p-3">
                <span className="block text-[11px] text-ink-soft">Subjects</span>
                <span className="block mt-1 text-[16px] font-semibold text-ink">{storageMetrics?.subjects_count ?? 0}</span>
              </div>
              <div className="rounded-lg border border-border-subtle p-3">
                <span className="block text-[11px] text-ink-soft">Documents</span>
                <span className="block mt-1 text-[16px] font-semibold text-ink">{storageMetrics?.documents_count ?? 0}</span>
              </div>
              <div className="rounded-lg border border-border-subtle p-3">
                <span className="block text-[11px] text-ink-soft">Notes</span>
                <span className="block mt-1 text-[16px] font-semibold text-ink">{storageMetrics?.notes_count ?? 0}</span>
              </div>
              <div className="rounded-lg border border-border-subtle p-3">
                <span className="block text-[11px] text-ink-soft">Total Files</span>
                <span className="block mt-1 text-[16px] font-semibold text-ink">
                  {(storageMetrics?.documents_count ?? 0) + (storageMetrics?.notes_count ?? 0)}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 max-w-sm">
              <button onClick={handleClearData} className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-500/20">
                Clear Local Data
              </button>
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
