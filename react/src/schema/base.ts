// react\src\schema\base.ts
// 공통 검색 요청
export const DEFAULT_SEARCH_FILTER = {
  keyword: '',
  status: '',
  task_type: '',
  start_date: '',
  end_date: '',
  page: 1,
  limit: 10,
};
/*
예시) 필터 확장 (task_type 추가)
export const SEARCH_FILTER = {
  ...DEFAULT_SEARCH_FILTER,
  task_type: '',
};
export type SearchFilterParams = typeof SEARCH_FILTER;
*/

// 공통 응답
export type BaseResponse<T, K extends string = 'data'> = {
  success: boolean;
  message?: string;
} & Record<K, T>;
/* 예시)
'data' 키 사용 type UserResponse = BaseResponse<User>; => { success: boolean; message: string; data: User }
'item' 키 사용 type ProductResponse = BaseResponse<Product, 'item'>; =>  { success: boolean; message: string; item: Product }
'result' 키 사용 type OrderResponse = BaseResponse<Order, 'result'>; =>  { success: boolean; message: string; result: Order }
*/

// 리스트 응답
export type BaseListData<T, K extends string = 'items'> = {
  total: number;
  page: number;
  limit: number;
} & Record<K, T[]>;
/* 예시)
export type ListItem = {
  id?: string | number;
  title?: string;
  status?: string;
  createdAt?: string;
}
export type BaseListResponse = BaseResponse<BaseListData<ListItem>>;
=> 결과 구조:
{
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    items: BaseItem[];
  }
}
*/