// react\src\app\App.tsx
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppRoutes from './AppRoutes';
import { AuthProvider } from '../context/AuthContext';
import { DeviceProvider } from '../context/DeviceContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    // API 데이터 캐싱 프로바이더
    <QueryClientProvider client={queryClient}>
      {/* 모바일/PC 디바이스 프로바이더 */}
      <DeviceProvider>
        {/* 인증/로그인 정보 프로바이더 */}
        <AuthProvider>
          {/* 라우터 최상위 감싸기 */}
          <BrowserRouter>
            {/* 라우팅 모듈 연결 */}
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </DeviceProvider>
    </QueryClientProvider>
  );
}