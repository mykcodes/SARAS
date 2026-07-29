let trashItems = [];

export function moveToTrash(item) {
  const trashEntry = {
    ...item,
    trashId: `trash-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    deletedAt: new Date().toISOString(),
    originalLocation: {
      subjectId: item.subjectId || null,
      documentId: item.documentId || item.id || null,
    },
  };
  trashItems.unshift(trashEntry);
  return { ...trashEntry };
}

export function getTrashItems() {
  return trashItems.map((t) => ({ ...t }));
}

export function restoreItem(trashId) {
  const idx = trashItems.findIndex((t) => t.trashId === trashId);
  if (idx === -1) return null;
  const [restored] = trashItems.splice(idx, 1);
  return { ...restored };
}

export function permanentDelete(trashId) {
  const idx = trashItems.findIndex((t) => t.trashId === trashId);
  if (idx !== -1) trashItems.splice(idx, 1);
}

export function emptyTrash() {
  const count = trashItems.length;
  trashItems = [];
  return count;
}

export function getTrashCount() {
  return trashItems.length;
}
