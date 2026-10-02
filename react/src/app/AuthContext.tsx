// react\src\app\AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 1. 사용자 정보 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
}

// 2. AuthContext가 제공할 데이터 및 함수들의 타입 정의
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

// 3. AuthProvider의 props 타입 정의
interface AuthProviderProps {
  children: ReactNode;
}

// 4. Context 객체 생성 (초기값 null)
const AuthContext = createContext<AuthContextType | null>(null);

// 5. AuthProvider 컴포넌트
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 앱 실행 시 초기 로그인 상태 확인 (새로고침 대응)
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // 필요 시 토큰 검증 API 호출
          // const res = await fetch('/api/v1/auth/me', { headers: { Authorization: `Bearer ${token}` } });
          // const userData: User = await res.json();
          // setUser(userData);

          // 임시 사용자 정보 설정
          setUser({ id: 'user-01', name: '홍길동', email: 'user@example.com' });
        } catch (error) {
          console.error('인증 토큰 검증 실패:', error);
          localStorage.removeItem('accessToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      // API 호출 예시
      // const res = await fetch('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      // const data = await res.json();

      const fakeToken = 'sample-jwt-token';
      const fakeUser: User = { id: 'user-01', name: '홍길동', email };

      localStorage.setItem('accessToken', fakeToken);
      setUser(fakeUser);
      return { success: true };
    } catch (error) {
      console.error('로그인 에러:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 에러';
      return { success: false, message: errorMessage };
    }
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  // Context 제공 값
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 6. 커스텀 훅 (useAuth)
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용해야 합니다.');
  }
  return context;
}