import api from './client';

/**
 * Normalizes backend subject response to frontend shape.
 * This ensures the UI can continue using `title` and other camelCase fields internally.
 */
function mapSubjectToFrontend(s) {
  if (!s) return s;
  return {
    ...s,
    id: s.id,
    title: s.name,          // map backend name -> frontend title
    name: s.name,
    description: s.description ?? '',
    color: s.color,
    fileCount: s.file_count ?? 0, // map backend file_count -> frontend fileCount
    createdAt: s.created_at,      // map backend created_at -> frontend createdAt
    updatedAt: s.updated_at,      // map backend updated_at -> frontend updatedAt
    isFavorite: s.is_favorite ?? false,
    tags: [],
    aiMeta: {},
  };
}

/** GET /api/subjects — list all subjects for current user */
export function listSubjects() {
  return api.get('/api/subjects').then((res) => res.map(mapSubjectToFrontend));
}

/** POST /api/subjects — create a new subject */
export function createSubject(data) {
  return api.post('/api/subjects', {
    name: data.title,          // map frontend title -> backend name
    description: data.description,
    color: data.color,
  }).then(mapSubjectToFrontend);
}

/** GET /api/subjects/:id */
export function getSubject(id) {
  return api.get(`/api/subjects/${id}`).then(mapSubjectToFrontend);
}

/** PUT /api/subjects/:id */
export function updateSubject(id, data) {
  return api.put(`/api/subjects/${id}`, {
    name: data.title ?? data.name, // map frontend title/name -> backend name
    description: data.description,
    color: data.color,
  }).then(mapSubjectToFrontend);
}

/** DELETE /api/subjects/:id */
export function deleteSubject(id) {
  return api.delete(`/api/subjects/${id}`);
}

/** PUT /api/subjects/:id/favorite */
export function toggleSubjectFavorite(id) {
  return api.put(`/api/subjects/${id}/favorite`).then(mapSubjectToFrontend);
}