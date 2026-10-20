// react\src\constant\routes.ts
// 라우트 경로 정의
export const ROUTES = {
  HOME: '/',
  TASK: {
    LIST: '/tasks',
    DETAIL: (id: string | number = ':id') => `/tasks/${id}`,
    SSE: '/tasks/sse'
  },
  CHAT: '/chat',
} as const;