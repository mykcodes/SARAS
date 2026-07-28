const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Formats an ISO date string as a relative "time ago" label.
 * Mirrors what a real API-backed timestamp would need on the client,
 * since raw dates (not pre-baked strings) are what a backend will send.
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return "Never";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(diffMs / DAY_MS);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.round(days / 7);
  if (weeks === 1) return "1 week ago";
  if (weeks < 5) return `${weeks} weeks ago`;

  const months = Math.round(days / 30);
  if (months <= 1) return "1 month ago";
  return `${months} months ago`;
}

/**
 * Formats a numeric file count as "N file" / "N files".
 */
export function formatFileCount(count) {
  return `${count} ${count === 1 ? "file" : "files"}`;
}

/**
 * Formats bytes into a human-readable file size string.
 * e.g. 1024 → "1.0 KB", 4200000 → "4.0 MB"
 */
export function formatFileSize(bytes) {
  if (bytes == null || bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let size = bytes;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Formats an ISO date string as a short human-readable date.
 * e.g. "Jul 15, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}