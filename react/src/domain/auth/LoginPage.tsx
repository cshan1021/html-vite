// react/src/domain/auth/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { ROUTES } from '../../constant/routes';
import { useAuth } from '../../context/AuthContext';
import type { LoginRequest, LoginData } from '../../schema/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  // 로그인된 상태라면 Protected 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(ROUTES.AUTH.PROTECTED, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 폼 입력 데이터 상태 관리
  const [formData, setFormData] = useState<LoginRequest>({
    login_id: '',
    password: '',
  });

  // useMutation 적용
  const loginMutation = useMutation<LoginData, Error, LoginRequest>({
    mutationFn: (credentials) => login(credentials),
    onSuccess: () => {
      // 로그인 성공 시 메인/보호된 페이지로 이동
      navigate(ROUTES.AUTH.PROTECTED);
    },
    onError: (error) => {
      console.error('Login Error:', error);
    },
  });

  // input 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // mutation 실행
    loginMutation.mutate(formData);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="panel p-4 p-sm-5 mb-5" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold text-dark">로그인</h1>
          <p className="text-secondary small mb-0">서비스 이용을 위해 로그인해주세요.</p>
        </div>

        {/* 에러 발생 시 UI 처리 */}
        {loginMutation.isError && (
          <div className="alert alert-danger py-2 small" role="alert">
            {loginMutation.error?.message ||
              '로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id" className="form-label small fw-semibold text-secondary">
              아이디
            </label>
            <input
              type="text"
              id="login_id"
              name="login_id"
              className="form-control"
              placeholder="아이디를 입력하세요"
              value={formData.login_id}
              onChange={handleChange}
              required
              autoComplete="id"
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
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
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