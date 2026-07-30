import { useState, useEffect } from "react";
import { Home, FolderOpen, Clock, Star, Trash2, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import StorageCard from "./StorageCard";
import ProfileCard from "./ProfileCard";
import { NAV_ITEMS, USER, STORAGE } from "../../lib/data";
import { useApp } from "../../context/AppContext";

const ICONS = {
  home: Home,
  subjects: FolderOpen,
  recent: Clock,
  favorites: Star,
  trash: Trash2,
};

function Sidebar() {
  const { openSettings } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed);
  }, [isCollapsed]);

  return (
    <aside className={`relative flex h-full shrink-0 flex-col border-r border-border-subtle bg-bg-elevated py-5 transition-all duration-300 ${isCollapsed ? "w-[80px] px-2" : "w-[248px] px-4"}`}>
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
          <StorageCard used={STORAGE.used} total={STORAGE.total} unit={STORAGE.unit} isCollapsed={isCollapsed} />
        </div>
        <ProfileCard name={USER.name} role={USER.role} initial={USER.initial} isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}

export default Sidebar;