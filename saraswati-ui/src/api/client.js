/**
 * API client — thin fetch wrapper with JWT injection and error handling.
 *
 * Usage:
 *   import { api } from './client';
 *   const data = await api.get('/api/subjects');
 *   const created = await api.post('/api/subjects', { name: 'DBMS' });
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function request(method, path, body, options = {}) {
  // 1. Use native Headers API to prevent object spreading override bugs
  const headers = new Headers(options.headers || {});

  // 2. Safely attach Content-Type
  if (!(body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  // 4. Extract headers out of options so it does not overwrite the carefully constructed Headers instance
  const { headers: _discardedHeaders, ...restOptions } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    ...restOptions,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.detail ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, message, data);
  }

  return data;
}

export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = {
  get: (path, options) => request('GET', path, null, options),
  post: (path, body, options) => request('POST', path, body, options),
  put: (path, body, options) => request('PUT', path, body, options),
  delete: (path, options) => request('DELETE', path, null, options),
};

export default api;
