import api from './client';

/** GET /api/storage/metrics */
export function getStorageMetrics() {
  return api.get('/api/storage/metrics');
}
