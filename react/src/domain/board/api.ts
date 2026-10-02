// react\src\domain\board\api.ts
// 1. 요청/응답 타입 정의
export interface TaskFilterParams {
  keyword?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number | string;
  size?: number | string;
  [key: string]: any; // 필요시 기타 동적 쿼리 허용
}

export interface TaskItem {
  id: string | number;
  title: string;
  status?: string;
  createdAt?: string;
  [key: string]: any; // 서버 응답 필드 구조에 맞춰 확장
}

// API 공통 응답 구조 (data 래핑 대응)
interface ApiResponse<T> {
  data?: T | { items?: T[] };
  items?: T[];
  [key: string]: any;
}

// Base URL 헬퍼 (중복 제거 및 슬래시 처리)
const BASE_URL = `${import.meta.env.VITE_API_URL || ''}/api/v1/tasks`;

// 2. 목록 조회 API
export const fetchTaskList = async (
  filterParams: TaskFilterParams
): Promise<TaskItem[]> => {
  const params = new URLSearchParams();
  
  Object.entries(filterParams).forEach(([key, value]) => {
    // null, undefined, 빈 문자열 제외 처리 (0이나 false 값은 유지하도록 조건 보완)
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

  const resp: ApiResponse<TaskItem> = await res.json();

  // payload 추출
  const payload = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;

  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === 'object' && 'items' in payload && Array.isArray(payload.items)) {
    return payload.items;
  }

  return [];
};

// 3. 상세 조회 API
export const fetchTaskDetail = async <T = TaskItem>(
  id: string | number
): Promise<T> => {
  if (!id) throw new Error('작업 ID가 필요합니다.');

  const url = `${BASE_URL}/${encodeURIComponent(String(id))}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

  const resp: ApiResponse<T> = await res.json();

  const payload = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return payload as T;
};