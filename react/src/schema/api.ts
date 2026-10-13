// react\src\schema\api.ts

// 공통 응답
export type ApiResponse<T, K extends string = 'data'> = {
  success: boolean;
  message?: string;
} & Record<K, T>;
/* 예시)
'data' 키 사용 type UserResponse = ApiResponse<User>; => { success: boolean; message: string; data: User }
'item' 키 사용 type ProductResponse = ApiResponse<Product, 'item'>; =>  { success: boolean; message: string; item: Product }
'result' 키 사용 type OrderResponse = ApiResponse<Order, 'result'>; =>  { success: boolean; message: string; result: Order }
*/

// 리스트 응답
export type ApiPagedData<T, K extends string = 'items'> = {
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
export type ListResponse = ApiResponse<ApiPagedData<ListItem>>;
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