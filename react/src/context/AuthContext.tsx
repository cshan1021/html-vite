// react\src\context\AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserInfo, LoginRequest, LoginData } from '../schema/auth';
import { ENDPOINTS } from '../constant/config';
import {
  httpPost,
  setAccessToken,
  clearAuthTokens,
  refreshAccessToken,
} from '../util/http';

// 1. Context 타입 정의
interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginData>;
  logout: () => Promise<void>;
}

// 2. Context 생성
const AuthContext = createContext<AuthContextType | null>(null);

// 3. Provider 구현
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 초기 마운트(페이지 새로고침) 시 세션 자동 복구 (Silent Refresh)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // HttpOnly Cookie 기반 재발급 시도
        const refreshResult = await refreshAccessToken();

        if (refreshResult?.access_token) {
          setIsAuthenticated(true);
          // 백엔드 /auth/refresh 응답에 user 정보가 포함되어 내려온 경우 복구
          if (refreshResult.user) {
            setUser(refreshResult.user);
          }
        } else {
          clearAuthTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        clearAuthTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 로그인 핸들러
  const login = async (credentials: LoginRequest): Promise<LoginData> => {
    const data = await httpPost<LoginData>(ENDPOINTS.AUTH.LOGIN, credentials);

    if (data.access_token) {
      setAccessToken(data.access_token);
      setIsAuthenticated(true);
    }

    if (data.user) {
      setUser(data.user); // Context 메모리 State에 저정
    }

    return data;
  };

  // 로그아웃 핸들러
  const logout = async (): Promise<void> => {
    try {
      // 백엔드 로그아웃 API 호출 (HttpOnly Cookie 삭제용 Max-Age: 0 수신)
      await httpPost(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      clearAuthTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};