// react\src\constant\config.ts
// 엔드포인트 상수 정의
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const ENDPOINTS = {
  TASKS: {
    LIST: `${API_URL}/api/v1/tasks`,
    DETAIL: (id: string | number) => `${API_URL}/api/v1/tasks/${encodeURIComponent(id)}`,
    SSE: `${API_URL}/api/v1/tasks/sse`,
  },
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REFRESH: `${API_URL}/auth/refresh`,
    LOGOUT: `${API_URL}/auth/logout`,
    PROTECTED: `${API_URL}/auth/protected`,
  },
} as const;

// 스토리지 키 상수 정의
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
} as const;