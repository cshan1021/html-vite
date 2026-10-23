// react/src/util/http.ts

/**
 * LocalStorage에서 access_token을 읽어와 Authorization 헤더 객체를 생성합니다.
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 쿼리 파라미터 객체를 URLSearchParams 문자열로 변환합니다.
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

/**
 * 공통 HTTP GET 요청 헬퍼 함수 (Authorization 헤더 자동 포함)
 */
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
      // 필요 시 토큰 만료 처리 (로그아웃 처리 또는 페이지 이동)
      localStorage.removeItem('access_token');
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

/**
 * 공통 HTTP POST 요청 헬퍼 함수 (Authorization 헤더 자동 포함)
 */
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
      localStorage.removeItem('access_token');
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

/**
 * multipart/form-data 전송용 POST 공통 헬퍼 (Authorization 헤더 자동 포함)
 */
export async function httpForm<T>(
  url: string,
  formData: FormData,
  customHeaders?: Record<string, string>
): Promise<T> {
  // Content-Type은 브라우저가 boundary와 함께 자동 설정하도록 제거한 상태로 Authorization만 병합
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
      localStorage.removeItem('access_token');
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