// react\src\domain\board\api.ts
import { DEFAULT_SEARCH_FILTER } from '../../schema/base';
import type { BaseResponse, BaseListData } from '../../schema/base';

// 검색 필터 정의 또는 확장
export const BOARD_SEARCH_FILTER = { ...DEFAULT_SEARCH_FILTER };
export type BoardSearchFilterParams = typeof BOARD_SEARCH_FILTER;

// API URL 헬퍼
const TASK_API_URL = `${import.meta.env.VITE_API_URL || ''}/api/v1/tasks`;

// Board - Task 목록 조회
export type TaskListItem = {
  id: string | number;
  task_id: string;
  task_type?: string;
  data_key?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  progress?: number;
}
export type TaskListData = BaseListData<TaskListItem>;

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

  const resp: BaseResponse<TaskListData> = await res.json();

  // BaseResponse { success, message, data: BaseListData } 구조인 경우
  if (resp && typeof resp === 'object' && 'data' in resp && resp.data) {
    return resp.data;
  }
  // BaseResponse 없이 BaseListData 구조만 바로 내려오는 경우 (Fallback)
  if (resp && typeof resp === 'object' && 'items' in resp) {
    return resp as unknown as BaseListData<TaskListItem>;
  }
  // 예외 기본값
  return {
    items: [],
    total: 0,
    page: filterParams.page ?? 1,
    limit: filterParams.size ?? 10,
  };
};

// Board - Task 상세 조회
export type TaskStatusItem = {
  id?: string | number;
  task_id?: string;
  step?: string;
  status?: string;
  progress?: number;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

export type TaskDetailItem = {
  id: string | number;
  task_id: string;
  task_type?: string;
  data_key?: string;
  created_at?: string;
  updated_at?: string;
  task_statuses?: TaskStatusItem[];
}

export const fetchTaskDetail = async (
  id: string | number
): Promise<TaskDetailItem> => {
  if (!id) throw new Error('작업 ID가 필요합니다.');

  const url = `${TASK_API_URL}/${encodeURIComponent(String(id))}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

  const resp: BaseResponse<TaskDetailItem> = await res.json();

  // BaseResponse { success, message, data: TaskDetailItem } 형태인 경우
  if (resp && typeof resp === 'object' && 'data' in resp && resp.data) {
    return resp.data;
  }

  // BaseResponse 없이 TaskDetailItem 구조만 바로 내려오는 경우
  if (resp && typeof resp === 'object' && 'task_id' in resp) {
    return resp as unknown as TaskDetailItem;
  }

  // 올바른 응답 형식이 아닌 경우
  throw new Error('올바르지 않은 상세 데이터 응답 형식입니다.');
};