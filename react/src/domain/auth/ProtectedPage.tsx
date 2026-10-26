// react\src\domain\auth\ProtectedPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { API_EPS } from '../../constant/config';
import { ROUTES } from '../../constant/routes';
import { httpGet } from '../../util/http';

export default function ProtectedPage() {
  const navigate = useNavigate();
  // AuthContext에서 user 정보 및 logout 함수 추출
  const { user, logout } = useAuth();

  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 1. 컴포넌트 마운트 시 보호된 API 호출
  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        setLoading(true);
        const responseData = await httpGet<string>(API_EPS.AUTH.PROTECTED);
        setMessage(responseData);
      } catch (error: unknown) {
        console.error('Protected API Error:', error);
        const msg =
          error instanceof Error
            ? error.message
            : '보호된 데이터 요청에 실패했습니다.';
        setErrorMessage(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, []);

  // 2. 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      // AuthContext의 logout() 호출 (내부에서 API 호출, 스토리지 파기, 상태 초기화 일괄 처리)
      await logout();
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      // 로그인 페이지로 이동
      navigate(ROUTES.AUTH?.LOGIN || '/login');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="panel p-4 p-sm-5 mb-5 text-center" style={{ width: '100%', maxWidth: '420px' }}>
        <h1 className="h3 fw-bold text-dark mb-2">보호된 페이지</h1>

        {/* AuthContext의 user 정보를 활용한 사용자 인사말 */}
        {user && (
          <p className="text-secondary small mb-4">
            <strong>{user.name || user.id}</strong>님 환영합니다! ({user.email || '이메일 미등록'})
          </p>
        )}

        {loading ? (
          <div className="my-4">
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            데이터 로딩 중...
          </div>
        ) : errorMessage ? (
          <div className="alert alert-danger py-2 small my-3" role="alert">
            {errorMessage}
          </div>
        ) : (
          <div className="alert alert-success py-3 my-3 fw-semibold" role="alert">
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 mt-3 py-2 fw-semibold"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}