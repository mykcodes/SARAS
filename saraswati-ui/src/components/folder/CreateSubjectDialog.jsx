import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check } from "lucide-react";
import useSubjects from "../../hooks/useSubjects";

const COLOR_OPTIONS = [
  "#D9A441", // Gold
  "#5F8F4E", // Green
  "#3E6FA8", // Blue
  "#B96A32", // Orange
  "#2F9490", // Teal
  "#A84A5C", // Red/Pink
];

function CreateSubjectDialog({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { createSubject } = useSubjects();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setColor(COLOR_OPTIONS[0]);
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Subject name is required.");
      return;
    }
    try {
      const newSubject = await createSubject({ title: title.trim(), description: description.trim(), color });
      onClose();
      if (newSubject && newSubject.id) {
        navigate(`/subjects/${newSubject.id}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content w-full max-w-[420px] rounded-2xl border border-border-subtle bg-bg-elevated p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-ink">New Subject</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-ink-faint transition-colors hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="subject-title" className="text-[12.5px] font-medium text-ink-soft">
              Name
            </label>
            <input
              id="subject-title"
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="e.g. Distributed Systems"
              className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-[13px] text-ink outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
              autoFocus
            />
            {error && <span className="text-[12px] text-red-500">{error}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="subject-description" className="text-[12.5px] font-medium text-ink-soft">
              Description <span className="text-ink-faint">(Optional)</span>
            </label>
            <textarea
              id="subject-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what this subject covers..."
              className="min-h-[80px] resize-none rounded-lg border border-border-subtle bg-surface px-3 py-2 text-[13px] text-ink outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-medium text-ink-soft">Color</label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none"
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                >
                  {color === c && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-3 border-t border-border-subtle pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border-subtle px-4 py-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-gold rounded-lg px-4 py-2 text-[12.5px] font-medium transition-transform active:scale-95"
            >
              Create Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSubjectDialog;
