// react\src\constant\endpoints.ts
// 엔드포인트 상수 정의
export const API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL   || 'http://localhost:8080'   // 개발(npm run dev): 개인 .env 사용
  : window.__APP_CONFIG__?.API_URL || 'http://localhost:8080';  // 배포(npm run build): config.js 사용

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
