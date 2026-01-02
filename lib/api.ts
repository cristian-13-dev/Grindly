export const API_BASE = '/api/v1';

export const ENDPOINTS = {
  AUTH: {
    SIGN_IN: `${API_BASE}/auth/sign-in`,
    SIGN_UP: `${API_BASE}/auth/sign-up`,
    REFRESH: `${API_BASE}/auth/refresh`,
  },
  TASKS: `${API_BASE}/tasks`,
  USERS: `${API_BASE}/users`,
  REWARDS: `${API_BASE}/rewards`,
  EVENTS: `${API_BASE}/events`,
};
