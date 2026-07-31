import { useState, useEffect } from "react";
import { Home, FolderOpen, Clock, Star, Trash2, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import StorageCard from "./StorageCard";
import ProfileCard from "./ProfileCard";
import { NAV_ITEMS } from "../../lib/data";
import { useApp } from "../../context/AppContext";
import { getStorageMetrics } from "../../api/storageApi";

const ICONS = {
  home: Home,
  subjects: FolderOpen,
  recent: Clock,
  favorites: Star,
  trash: Trash2,
};

// Format bytes according to specific rules: MB if < 1GB, else GB.
function formatUsedBytes(bytes) {
  if (bytes === 0) return { value: 0, unit: "MB" };
  const gb = 1024 * 1024 * 1024;
  const mb = 1024 * 1024;
  if (bytes < gb) {
    return { value: parseFloat((bytes / mb).toFixed(2)), unit: "MB" };
  }
  return { value: parseFloat((bytes / gb).toFixed(2)), unit: "GB" };
}

function Sidebar() {
  const { openSettings } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });
  
  const [name, setName] = useState(() => localStorage.getItem("userName") || "Saraswati User");
  // Total is strictly 5 GB internally for percentages
  const [storage, setStorage] = useState({ used: 0, total: 5 * 1024 * 1024 * 1024 });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed);
  }, [isCollapsed]);
  
  useEffect(() => {
    getStorageMetrics().then((data) => {
      if (data) {
        setStorage({ used: data.used_bytes, total: 5 * 1024 * 1024 * 1024 }); // Total is always 5GB
      }
    }).catch(() => {});
  }, []);

  const role = "Student";
  const initial = name.charAt(0).toUpperCase();
  
  const formattedUsed = formatUsedBytes(storage.used);
  // Total is always 5 GB
  const totalValue = 5;
  const totalUnit = "GB";

  return (
    <aside className={`sticky top-0 h-screen shrink-0 flex-col border-r border-border-subtle bg-bg-elevated py-5 transition-all duration-300 flex ${isCollapsed ? "w-[80px] px-2" : "w-[248px] px-4"}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-surface text-ink-soft shadow-sm transition-colors hover:text-ink"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <Logo isCollapsed={isCollapsed} />

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            icon={ICONS[item.id]}
            label={item.label}
            badge={item.badge}
            to={item.to}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-4">
        <SidebarItem icon={Settings} label="Settings" isCollapsed={isCollapsed} onClick={openSettings} />
        
        <div className="border-t border-border-subtle pt-4">
          <StorageCard
            used={formattedUsed.value}
            usedUnit={formattedUsed.unit}
            total={totalValue}
            totalUnit={totalUnit}
            isCollapsed={isCollapsed}
          />
        </div>
        <ProfileCard name={name} role={role} initial={initial} isCollapsed={isCollapsed} onNameChange={setName} />
      </div>
    </aside>
  );
}

export default Sidebar;