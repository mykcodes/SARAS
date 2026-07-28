const STORAGE_KEY = "saraswati_preferences";

const DEFAULTS = {
  viewMode: "grid",
  sortMode: "newest",
  activeFilter: "all",
  sidebarCollapsed: false,
  insightsVisible: false,
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function save(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* storage full or unavailable */
  }
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
