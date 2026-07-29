import { storageManager } from "./storageManager";

const DEFAULTS = {
  viewMode: "grid",
  sortMode: "newest",
  activeFilter: "all",
  sidebarCollapsed: false,
  insightsVisible: false,
};

function load() {
  const prefs = storageManager.getItem("preferences", {});
  return { ...DEFAULTS, ...prefs };
}

function save(prefs) {
  storageManager.setItem("preferences", prefs);
}

export function getPreference(key) {
  return load()[key] ?? DEFAULTS[key] ?? null;
}

export function setPreference(key, value) {
  const prefs = load();
  prefs[key] = value;
  save(prefs);
}

export function getAllPreferences() {
  return load();
}

export function resetPreferences() {
  save({ ...DEFAULTS });
  return { ...DEFAULTS };
}
