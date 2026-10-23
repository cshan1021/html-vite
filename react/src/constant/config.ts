// react\src\constant\config.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 엔드포인트 정의
export const API_EPS = {
  TASKS: {
    LIST: `${API_URL}/api/v1/tasks`,
    DETAIL: (id: string | number) => `${API_URL}/api/v1/tasks/${encodeURIComponent(id)}`,
    SSE: `${API_URL}/api/v1/tasks/sse`,
  },
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
  },
} as const;