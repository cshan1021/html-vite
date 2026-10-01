// react\src\App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    // 1. API 데이터 캐싱 프로바이더
    <QueryClientProvider client={queryClient}>
      // 2. 인증/로그인 정보 프로바이더
      <AuthProvider>
        // 3. 라우터 최상위 감싸기
        <BrowserRouter>
          {/* 라우팅 모듈 연결 */}
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}