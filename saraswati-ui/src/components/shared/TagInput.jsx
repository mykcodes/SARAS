import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { getAllTags, createTag, addTagToItem, removeTagFromItem, getTagsForItem } from "../../services/tagService";
import TagBadge from "./TagBadge";

function TagInput({ itemType, itemId }) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [, setVersion] = useState(0);
  const inputRef = useRef(null);

  const refresh = () => setVersion((v) => v + 1);
  const itemTags = getTagsForItem(itemType, itemId);
  const allTags = getAllTags();
  const availableTags = allTags.filter(
    (t) => !itemTags.some((it) => it.id === t.id)
  );

  const filtered = inputValue.trim()
    ? availableTags.filter((t) =>
        t.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    : availableTags;

  const showSuggestions = isAdding && (filtered.length > 0 || inputValue.trim());

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddExisting = (tag) => {
    addTagToItem(tag.id, itemType, itemId);
    setInputValue("");
    setIsAdding(false);
    refresh();
  };

  const handleCreateNew = () => {
    if (!inputValue.trim()) return;
    const colors = ["#E74C3C", "#F39C12", "#3498DB", "#2ECC71", "#9B59B6", "#1ABC9C"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const newTag = createTag(inputValue.trim(), color);
    addTagToItem(newTag.id, itemType, itemId);
    setInputValue("");
    setIsAdding(false);
    refresh();
  };

  const handleRemoveTag = (tagId) => {
    removeTagFromItem(tagId, itemType, itemId);
    refresh();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (filtered.length === 1) {
        handleAddExisting(filtered[0]);
      } else {
        handleCreateNew();
      }
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {itemTags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} onRemove={handleRemoveTag} />
      ))}
      {isAdding ? (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setTimeout(() => {
                setIsAdding(false);
                setInputValue("");
              }, 200);
            }}
            placeholder="Tag name..."
            className="w-[100px] rounded-md border border-border-default bg-surface-soft px-2 py-0.5 text-[10.5px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          {showSuggestions && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-[120px] w-[140px] overflow-y-auto rounded-lg border border-border-subtle bg-surface-soft py-1 shadow-xl">
              {filtered.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleAddExisting(tag)}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-[11px] text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </button>
              ))}
              {inputValue.trim() && !filtered.some((t) => t.name.toLowerCase() === inputValue.trim().toLowerCase()) && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleCreateNew}
                  className="flex w-full items-center gap-2 border-t border-border-subtle px-2.5 py-1.5 text-[11px] text-gold transition-colors hover:bg-surface-hover"
                >
                  <Plus size={10} />
                  Create "{inputValue.trim()}"
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] text-ink-faint transition-colors hover:text-gold"
        >
          <Plus size={10} />
          Tag
        </button>
      )}
    </div>
  );
}

export default TagInput;
