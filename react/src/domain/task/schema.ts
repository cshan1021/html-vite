// react\src\domain\task\schema.ts
import type { ApiResponse, ApiPagedData } from '../../schema/api';
import type { SseResponse } from '../../schema/sse';

// 검색 필터 정의 또는 확장
export const TASK_SEARCH_FILTER = {
  keyword: '',
  status: '',
  task_type: '',
  start_date: '',
  end_date: '',
  page: 1,
  limit: 10,
};
export type TaskSearchFilterParams = typeof TASK_SEARCH_FILTER;

// Task 목록 스키마
export type TaskListItem = {
  id?: string | number;
  task_id?: string;
  task_type?: string;
  data_key?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  progress?: number;
}
export type TaskListData = ApiPagedData<TaskListItem>;
export type TaskListResponse = ApiResponse<TaskListData> 

// Task 상세 스키마
export type TaskMaster = {
  id?: string | number;
  task_id?: string;
  task_type?: string;
  data_key?: string;
  created_at?: string;
  updated_at?: string;
}
export type TaskStatus = {
  id?: string | number;
  task_id?: string;
  step?: string;
  status?: string;
  progress?: number;
  message?: string;
  created_at?: string;
  updated_at?: string;
}
export type TaskDetailData = {
  master?: TaskMaster
  statuses?: TaskStatus[];
}
export type TaskDetailResponse = ApiResponse<TaskDetailData> 

// SSE 스키마
export type TaskSseData = {
  id?: string | number;
  step?: string;
  progress?: number;
  completed?: boolean;
  failed?: boolean;
  message?: string;
};
export type TaskSseResponse = SseResponse<TaskSseData>;