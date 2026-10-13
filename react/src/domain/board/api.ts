// react\src\domain\board\api.ts
import type { BoardSearchFilterParams } from './schema';
import type { TaskListData, TaskListResponse } from './schema';
import type { TaskDetailData, TaskDetailResponse } from './schema';

// API URL 헬퍼
const TASK_API_URL = `${import.meta.env.VITE_API_URL || ''}/api/v1/tasks`;

// Task 목록 조회
export const fetchTaskList = async (
  filterParams: BoardSearchFilterParams
): Promise<TaskListData> => {
  const params = new URLSearchParams();
  
  Object.entries(filterParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  const url = queryString ? `${TASK_API_URL}?${queryString}` : TASK_API_URL;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

  const resp: TaskListResponse = await res.json();

  // ApiResponse { success, message, data: ApiPagedData } 구조인 경우
  if (resp && typeof resp === 'object' && 'data' in resp && resp.data) {
    return resp.data;
  }
  // ApiResponse 없이 ApiPagedData 구조만 바로 내려오는 경우 (Fallback)
  if (resp && typeof resp === 'object' && 'items' in resp) {
    return resp as unknown as TaskListData;
  }
  // 예외 기본값
  return {
    items: [],
    total: 0,
    page: filterParams.page ?? 1,
    limit: filterParams.limit ?? 10,
  };
};

// Task 상세 조회
export const fetchTaskDetail = async (
  id: string | number
): Promise<TaskDetailData> => {
  if (!id) throw new Error('작업 ID가 필요합니다.');

  const url = `${TASK_API_URL}/${encodeURIComponent(String(id))}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

  const resp: TaskDetailResponse = await res.json();

  // ApiResponse { success, message, data } 형태인 경우
  if (resp && typeof resp === 'object' && 'data' in resp && resp.data) {
    return resp.data;
  }

  // ApiResponse 없이 구조만 바로 내려오는 경우
  if (resp && typeof resp === 'object' && 'task_id' in resp) {
    return resp as unknown as TaskDetailData;
  }

  // 올바른 응답 형식이 아닌 경우
  throw new Error('올바르지 않은 상세 데이터 응답 형식입니다.');
};