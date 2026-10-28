// react\src\schema\auth.ts
import type { ApiResponse} from './api';

// 로그인 요청
export interface LoginRequest {
  id: string;
  password: string;
}

// 토큰 재발급 요청
export interface RefreshRequest {
  refresh_token: string;
}

 // 로그인/토큰 응답 데이터
 export interface UserInfo {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}
export interface LoginData {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  user?: UserInfo;
}
export type LoginApiResponse = ApiResponse<LoginData>;
export type RefreshApiResponse = ApiResponse<LoginData>;