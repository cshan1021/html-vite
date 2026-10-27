import { ENDPOINTS } from '../constant/config';
import { ROUTES } from '../constant/routes';
import type { LoginData } from '../schema/auth';

/**
 * 인메모리 Access Token 관리 - HttpOnly Cookie
 */
let inMemoryAccessToken: string | null = null;

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

export const setAccessToken = (accessToken: string): void => {
  inMemoryAccessToken = accessToken;
};

export const clearAuthTokens = (): void => {
  inMemoryAccessToken = null;
};

/**
 * 쿼리 파라미터 변환 헬퍼 함수
 */
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

const getAuthHeaders = (): Record<string, string> => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Access Token 만료 시 자동 재발급(Refresh) 함수
 */
let refreshPromise: Promise<LoginData | null> | null = null;

export const refreshAccessToken = (): Promise<LoginData | null> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // HttpOnly Cookie 자동 전송
      });

      if (!res.ok) {
        throw new Error('Refresh token expired or invalid');
      }

      const resp = await res.json();
      // ApiResponse 구조인 경우 resp.data, 일반 반환일 경우 resp 추출
      const responseData: LoginData = resp.data || resp;
      const newAccessToken = responseData?.access_token;

      if (newAccessToken) {
        setAccessToken(newAccessToken);
        return responseData;
      }
      return null;
    } catch (error) {
      clearAuthTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * 401 Unauthorized 감지 및 토큰 자동 재발급/재시도 공통 처리
 */
async function executeWithAuthRetry(
  url: string,
  fetchFn: () => Promise<Response>,
  isRetry: boolean
): Promise<Response> {
  const res = await fetchFn();

  // 401 발생 시 재발급 및 재시도 (로그인, 재발급 API 요청 제외)
  if (
    res.status === 401 &&
    !isRetry &&
    url !== ENDPOINTS.AUTH.REFRESH &&
    url !== ENDPOINTS.AUTH.LOGIN
  ) {
    const refreshResult = await refreshAccessToken();
    if (refreshResult?.access_token) {
      // 새 토큰 수령 성공 시 1회 재시도 (isRetry = true)
      return fetchFn();
    } else {
      clearAuthTokens();

      const unauthorizedUrl = ROUTES?.ERROR?.UNAUTHORIZED || '/error/Unauthorized';
      if (window.location.pathname !== unauthorizedUrl) {
        window.location.href = unauthorizedUrl;
      }
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
  }

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res;
}

/**
 * API 응답 JSON 구조 표준 파싱
 */
async function parseApiResponse<T>(res: Response, fallbackKey?: string): Promise<T> {
  const resp = await res.json();

  if (resp && typeof resp === 'object' && 'data' in resp && resp.data !== undefined) {
    return resp.data as T;
  }
  if (fallbackKey && resp && typeof resp === 'object' && fallbackKey in resp) {
    return resp as T;
  }
  if (resp && typeof resp === 'object') {
    return resp as T;
  }

  throw new Error('올바르지 않은 API 응답 형식입니다.');
}

/**
 * 공통 HTTP GET 요청
 */
export const httpGet = async <T>(
  url: string,
  params?: Record<string, any>,
  fallbackKey?: string,
  customHeaders?: Record<string, string>,
  isRetry = false
): Promise<T> => {
  const requestUrl = buildQueryUrl(url, params);

  const res = await executeWithAuthRetry(
    url,
    () =>
      fetch(requestUrl, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
          ...customHeaders,
        },
        credentials: 'include',
      }),
    isRetry
  );

  return parseApiResponse<T>(res, fallbackKey);
};

/**
 * 공통 HTTP POST 요청
 */
export const httpPost = async <T>(
  url: string,
  body?: Record<string, any>,
  fallbackKey?: string,
  customHeaders?: Record<string, string>,
  isRetry = false
): Promise<T> => {
  const res = await executeWithAuthRetry(
    url,
    () =>
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...customHeaders,
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
      }),
    isRetry
  );

  return parseApiResponse<T>(res, fallbackKey);
};

/**
 * 공통 HTTP multipart/form-data 전송용 요청
 */
export async function httpForm<T>(
  url: string,
  formData: FormData,
  customHeaders?: Record<string, string>,
  isRetry = false
): Promise<T> {
  const res = await executeWithAuthRetry(
    url,
    () =>
      fetch(url, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          ...customHeaders,
        },
        credentials: 'include',
        body: formData,
      }),
    isRetry
  );

  return parseApiResponse<T>(res);
}