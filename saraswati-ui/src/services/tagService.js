const SEED_TAGS = [
  { id: "tag-1", name: "Important", color: "#E74C3C" },
  { id: "tag-2", name: "Review", color: "#F39C12" },
  { id: "tag-3", name: "Exam Prep", color: "#3498DB" },
  { id: "tag-4", name: "Fundamentals", color: "#2ECC71" },
  { id: "tag-5", name: "Advanced", color: "#9B59B6" },
];

const SEED_ASSIGNMENTS = [
  { tagId: "tag-1", itemType: "document", itemId: "doc-dbms-1" },
  { tagId: "tag-3", itemType: "document", itemId: "doc-dbms-1" },
  { tagId: "tag-4", itemType: "document", itemId: "doc-cn-1" },
  { tagId: "tag-2", itemType: "document", itemId: "doc-ml-1" },
  { tagId: "tag-5", itemType: "document", itemId: "doc-ml-3" },
  { tagId: "tag-1", itemType: "subject", itemId: "dbms" },
  { tagId: "tag-3", itemType: "subject", itemId: "machine-learning" },
];

let tags = null;
let assignments = null;

function init() {
  if (!tags) {
    tags = SEED_TAGS.map((t) => ({ ...t }));
    assignments = SEED_ASSIGNMENTS.map((a) => ({ ...a }));
  }
}

export function getAllTags() {
  init();
  return tags.map((t) => ({ ...t }));
}

export function createTag(name, color = "#9a978f") {
  init();
  const tag = {
    id: `tag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    color,
  };
  tags.push(tag);
  return { ...tag };
}

export function deleteTag(tagId) {
  init();
  const idx = tags.findIndex((t) => t.id === tagId);
  if (idx !== -1) tags.splice(idx, 1);
  assignments = assignments.filter((a) => a.tagId !== tagId);
}

export function renameTag(tagId, newName) {
  init();
  const tag = tags.find((t) => t.id === tagId);
  if (tag) tag.name = newName;
  return tag ? { ...tag } : null;
}

export function addTagToItem(tagId, itemType, itemId) {
  init();
  const exists = assignments.some(
    (a) => a.tagId === tagId && a.itemType === itemType && a.itemId === itemId
  );
  if (!exists) {
    assignments.push({ tagId, itemType, itemId });
  }
}

export function removeTagFromItem(tagId, itemType, itemId) {
  init();
  assignments = assignments.filter(
    (a) => !(a.tagId === tagId && a.itemType === itemType && a.itemId === itemId)
  );
}

export function getTagsForItem(itemType, itemId) {
  init();
  const tagIds = assignments
    .filter((a) => a.itemType === itemType && a.itemId === itemId)
    .map((a) => a.tagId);
  return tags.filter((t) => tagIds.includes(t.id)).map((t) => ({ ...t }));
}

export function getItemsByTag(tagId) {
  init();
  return assignments.filter((a) => a.tagId === tagId).map((a) => ({ ...a }));
}
