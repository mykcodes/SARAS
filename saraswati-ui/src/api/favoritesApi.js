import api from './client';

/** GET /api/favorites */
export function getFavorites() {
  return api.get('/api/favorites');
}
