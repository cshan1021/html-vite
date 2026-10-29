// react\src\domain\auth\ProtectedPage.tsx
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { ENDPOINTS } from '../../constant/config';
import { ROUTES } from '../../constant/routes';
import { useAuth } from '../../context/AuthContext';
import { httpGet } from '../../util/http';

export default function ProtectedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // useQuery를 사용하여 데이터 조회, 로딩, 에러 상태 관리
  const {
    data: message = '',
    isLoading,
    isError,
    error,
  } = useQuery<string, Error>({
    queryKey: ['protectedData'],
    queryFn: () => httpGet<string>(ENDPOINTS.AUTH.PROTECTED),
  });

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout Error:', err);
    } finally {
      navigate(ROUTES.AUTH?.LOGIN || '/login');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="panel p-4 p-sm-5 mb-5 text-center" style={{ width: '100%', maxWidth: '420px' }}>
        <h1 className="h3 fw-bold text-dark mb-2">보호된 페이지</h1>

        {user && (
          <p className="text-secondary small mb-4">
            <strong>{user.user_name || user.login_id}</strong>님 환영합니다! ({user.email || '이메일 미등록'})
          </p>
        )}

        {isLoading ? (
          <div className="my-4">
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            데이터 로딩 중...
          </div>
        ) : isError ? (
          <div className="alert alert-danger py-2 small my-3" role="alert">
            {error?.message || '보호된 데이터 요청에 실패했습니다.'}
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