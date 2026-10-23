// react\src\domain\auth\schema.ts
import type { ApiResponse} from '../../schema/api';

// 로그인 요청
export interface LoginRequest {
  username: string;
  password: string;
}

// 토큰 재발급 요청
export interface RefreshRequest {
  refresh_token: string;
}

 // 로그인/토큰 응답 데이터
export interface LoginData {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}
export type LoginApiResponse = ApiResponse<LoginData>;