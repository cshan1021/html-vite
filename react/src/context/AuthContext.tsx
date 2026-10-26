// react\src\context\AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserInfo, LoginRequest, LoginData } from '../schema/auth';
import { API_EPS } from '../constant/config';
import {
  httpPost,
  getAccessToken,
  setAuthTokens,
  getUserInfo,
  setUserInfo,
  clearAuthTokens,
} from '../util/http';

// 1. Context에서 제공할 상태 및 액션 타입 정의
interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginData>;
  logout: () => Promise<void>;
}

// 2. Context 객체 생성
const AuthContext = createContext<AuthContextType | null>(null);

// 3. Provider 컴포넌트 구현
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 초기 마운트 시 세션 정보 확인
  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getUserInfo<UserInfo>();

    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setIsLoading(false);
  }, []);

  // 로그인 핸들러
  const login = async (credentials: LoginRequest): Promise<LoginData> => {
    const data = await httpPost<LoginData>(API_EPS.AUTH.LOGIN, credentials);

    if (data.access_token) {
      setAuthTokens(data.access_token, data.refresh_token);
      setIsAuthenticated(true);
    }

    if (data.user) {
      setUserInfo(data.user);
      setUser(data.user);
    }

    return data;
  };

  // 로그아웃 핸들러
  const logout = async (): Promise<void> => {
    try {
      await httpPost(API_EPS.AUTH.LOGOUT);
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

// 4. 안전한 Context 사용을 위한 Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};