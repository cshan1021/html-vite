// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Context 객체 생성
const AuthContext = createContext(null);

// 2. AuthProvider 컴포넌트 작성
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 실행 시 초기 로그인 상태 확인 (새로고침 대응)
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // 필요 시 토큰 검증 API 호출
          // const res = await fetch('/api/v1/auth/me', { headers: { Authorization: `Bearer ${token}` } });
          // const userData = await res.json();
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
  const login = async (email, password) => {
    try {
      // API 호출 예시
      // const res = await fetch('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      // const data = await res.json();
      
      const fakeToken = 'sample-jwt-token';
      const fakeUser = { id: 'user-01', name: '홍길동', email };

      localStorage.setItem('accessToken', fakeToken);
      setUser(fakeUser);
      return { success: true };
    } catch (error) {
      console.error('로그인 에러:', error);
      return { success: false, message: error.message };
    }
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  // Context 제공 값
  const value = {
    user,
    isAuthenticated: !!user, // user가 존재하면 true
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. 커스텀 훅 (useAuth) 생성
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용해야 합니다.');
  }
  return context;
}