import api from './client';

/**
 * POST /api/auth/register
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ access_token: string, token_type: string, user: object }}
 */
export function register(data) {
  return api.post('/api/auth/register', data);
}

/**
 * POST /api/auth/login
 * @param {{ email: string, password: string }} data
 * @returns {{ access_token: string, token_type: string, user: object }}
 */
export function login(data) {
  return api.post('/api/auth/login', data);
}

/**
 * GET /api/auth/me
 * @returns {{ id: number, name: string, email: string, created_at: string }}
 */
export function getMe() {
  return api.get('/api/auth/me');
}
