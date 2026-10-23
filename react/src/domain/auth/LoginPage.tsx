import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { API_EPS } from '../../constant/config';
import { ROUTES } from '../../constant/routes';
import { httpPost } from '../../util/http';
import type { LoginRequest, LoginData } from './schema';

export default function LoginPage() {
  const navigate = useNavigate();

  // 폼 입력 상태
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // input 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 로그인 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // httpPost 내부에서 백엔드의 ApiResponse<LoginData> 중 data 필드를 파싱하여 반환합니다.
      const data = await httpPost<LoginData>(
        API_EPS.AUTH.LOGIN,
        formData
      );

      // 토큰 저장 (Local Storage)
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }

      // 로그인 성공 시 이동 (상수화된 라우트Path 활용)
      navigate(ROUTES.TASK.LIST);
    } catch (error: unknown) {
      console.error('Login Error:', error);
      const message =
        error instanceof Error
          ? error.message
          : '로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="panel p-4 p-sm-5 mb-5" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold text-dark">로그인</h1>
          <p className="text-secondary small mb-0">서비스 이용을 위해 로그인해주세요.</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 small" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label small fw-semibold text-secondary">
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="아이디를 입력하세요"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label small fw-semibold text-secondary">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}