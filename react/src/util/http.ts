// react/src/util/http.ts
import { STORAGE_KEYS } from '../constant/config';

/**
 * 토큰 헬퍼 함수
 */
// Access Token 개별 조회
export const getAccessToken = (): string | null => {
  return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

// 로그인 성공 시 인증 토큰 저장
export const setAuthTokens = (accessToken: string, refreshToken?: string): void => {
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

// 로그아웃 또는 토큰 만료 시 인증 토큰 전체 삭제
export const clearAuthTokens = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);
};

// 사용자 정보 조회
export const getUserInfo = <T>(): T | null => {
  const userStr = sessionStorage.getItem(STORAGE_KEYS.USER_INFO);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as T;
  } catch (e) {
    console.error('Failed to parse stored user info:', e);
    return null;
  }
};

// 사용자 정보 저장
export const setUserInfo = <T>(user: T): void => {
  sessionStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
};

/**
 * 공통 HTTP 요청 헬퍼 함수
 */
// 쿼리 파라미터 객체를 URLSearchParams 문자열로 변환합니다.
export const buildQueryUrl = (baseUrl: string, paramsObj?: Record<string, any>): string => {
  if (!paramsObj) return baseUrl;

  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// access_token을 읽어와 Authorization 헤더 객체를 생성합니다.
const getAuthHeaders = (): Record<string, string> => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 공통 HTTP GET 요청 헬퍼 함수
export const httpGet = async <T>(
  url: string,
  params?: Record<string, any>,
  fallbackKey?: string,
  customHeaders?: Record<string, string>
): Promise<T> => {
  const requestUrl = buildQueryUrl(url, params);

  const res = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      ...customHeaders,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthTokens();
    }
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const resp = await res.json();

  // 1. ApiResponse { success, message, data: ... } 구조인 경우
  if (resp && typeof resp === 'object' && 'data' in resp && resp.data !== undefined) {
    return resp.data as T;
  }

  // 2. ApiResponse 래퍼 없이 바로 데이터 객체가 내려오는 경우 (Fallback)
  if (fallbackKey && resp && typeof resp === 'object' && fallbackKey in resp) {
    return resp as T;
  }

  // 3. fallbackKey를 지정하지 않은 경우 전체 객체 반환
  if (!fallbackKey && resp && typeof resp === 'object') {
    return resp as T;
  }

  throw new Error('올바르지 않은 API 응답 형식입니다.');
};

// 공통 HTTP POST 요청 헬퍼 함수
export const httpPost = async <T>(
  url: string,
  body?: Record<string, any>,
  fallbackKey?: string,
  customHeaders?: Record<string, string>
): Promise<T> => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...customHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthTokens();
    }
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const resp = await res.json();

  // 1. ApiResponse { success, message, data: ... } 구조인 경우
  if (resp && typeof resp === 'object' && 'data' in resp && resp.data !== undefined) {
    return resp.data as T;
  }

  // 2. ApiResponse 래퍼 없이 바로 데이터 객체가 내려오는 경우 (Fallback)
  if (fallbackKey && resp && typeof resp === 'object' && fallbackKey in resp) {
    return resp as T;
  }

  // 3. fallbackKey를 지정하지 않은 경우 전체 객체 반환
  if (!fallbackKey && resp && typeof resp === 'object') {
    return resp as T;
  }

  throw new Error('올바르지 않은 API 응답 형식입니다.');
};

// 공통 HTTP  multipart/form-data 전송용 헬퍼 함수
export async function httpForm<T>(
  url: string,
  formData: FormData,
  customHeaders?: Record<string, string>
): Promise<T> {
  const headers: Record<string, string> = {
    ...getAuthHeaders(),
    ...customHeaders,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthTokens();
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const resp = await response.json();

  // ApiResponse 래퍼 구조 처리
  if (resp && typeof resp === 'object' && 'data' in resp && resp.data !== undefined) {
    return resp.data as T;
  }

  return resp as T;
}