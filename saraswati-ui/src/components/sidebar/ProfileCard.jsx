import { useState, useRef, useEffect } from "react";
import { Edit2, Check, X } from "lucide-react";

function ProfileCard({ name, role, initial, isCollapsed, onNameChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed.length > 0) {
      localStorage.setItem("userName", trimmed);
      onNameChange?.(trimmed);
    } else {
      setEditValue(name); // Revert if empty
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(name);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div
      className={`flex w-full items-center rounded-lg border border-border-subtle bg-surface py-2 text-left transition-colors hover:border-border-default ${isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-2.5'}`}
      title={isCollapsed ? name : undefined}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gold-gradient-bg text-[13px] font-semibold text-bg">
        {initial}
      </span>
      {!isCollapsed && (
        <div className="flex min-w-0 flex-1 items-center justify-between">
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-[13px] font-medium text-ink outline-none"
                placeholder="Enter name..."
              />
            ) : (
              <span className="block truncate text-[13px] font-medium text-ink">{name}</span>
            )}
            {!isEditing && <span className="block truncate text-[11px] text-ink-soft">{role}</span>}
          </div>
          
          <div className="flex shrink-0 items-center gap-1 ml-1">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="p-1 text-emerald-500 hover:text-emerald-400 transition-colors">
                  <Check size={14} />
                </button>
                <button onClick={handleCancel} className="p-1 text-ink-soft hover:text-ink transition-colors">
                  <X size={14} />
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="p-1 text-ink-soft hover:text-ink transition-colors" title="Rename Profile">
                <Edit2 size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;
