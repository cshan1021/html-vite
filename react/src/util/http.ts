// react\src\util\http.ts
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
 * 공통 HTTP GET 요청 헬퍼 함수
 * @template T - 최종적으로 반환받고자 하는 데이터 타입
 * @param url - 요청할 API URL
 * @param params - 쿼리 스트링 파라미터 객체 (선택)
 * @param fallbackKey - ApiResponse 래퍼가 없을 때 데이터 유효성을 검증할 대표 키 (예: 'items', 'task_id')
 */
export const httpGet = async <T>(
  url: string,
  params?: Record<string, any>,
  fallbackKey?: string
): Promise<T> => {
  const requestUrl = buildQueryUrl(url, params);

  const res = await fetch(requestUrl);
  if (!res.ok) {
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
 * 공통 HTTP POST 요청 헬퍼 함수
 * @template T 최종적으로 반환받고자 하는 데이터 타입
 * @param url 요청할 API URL
 * @param body 요청 Body 객체 (선택)
 * @param fallbackKey ApiResponse 래퍼가 없을 때 데이터 유효성을 검증할 대표 키 (선택)
 */
export const httpPost = async <T>(
  url: string,
  body?: Record<string, any>,
  fallbackKey?: string
): Promise<T> => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
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
 * multipart/form-data 전송용 POST 공통 헬퍼
 */
export async function httpForm<T>(
  url: string,
  formData: FormData,
  customHeaders?: Record<string, string>
): Promise<T> {
  // Authorization 등 공통 헤더가 있다면 조합
  const headers: Record<string, string> = {
    ...customHeaders,
  };

  // 중요: Content-Type은 명시하지 않습니다.
  // 브라우저가 boundary를 포함하여 multipart/form-data로 자동으로 설정합니다.

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}