import React, { createContext, useContext, useEffect, useState } from 'react';

interface DeviceContextType {
  isMobile: boolean;       // 768px 미만 여부 (UI 기준)
  isNativeMobile: boolean; // 실제 모바일 기기 여부 (User-Agent 기준)
}

const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
  isNativeMobile: false,
});

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. 실제 모바일 기기 여부 (컴포넌트 마운트 시 1회 판별)
  const [isNativeMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  });

  // 2. 화면 너비 기반 모바일 여부 (matchMedia 활용 최적화)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // 초기값 맞춤 및 리스너 등록
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <DeviceContext.Provider value={{ isMobile, isNativeMobile }}>
      {children}
    </DeviceContext.Provider>
  );
};

// 하위 컴포넌트에서 쉽게 꺼내 쓸 커스텀 훅
export const useDevice = () => useContext(DeviceContext);