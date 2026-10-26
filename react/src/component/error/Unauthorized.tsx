// react\src\component\error\Unauthorized.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../constant/routes';

interface UnauthorizedProps {
  title?: string;
  message?: string;
  showLoginButton?: boolean;
}

export const Unauthorized: React.FC<UnauthorizedProps> = ({
  title = '접근 권한이 없습니다',
  message = '해당 페이지에 접근할 수 있는 권한이 없거나 로그인 세션이 만료되었습니다.',
  showLoginButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div
        className="card border-0 shadow-sm p-4 text-center"
        style={{ maxWidth: '420px', width: '100%' }}
      >
        {/* 자물쇠 / 방패 느낌의 아이콘 영역 */}
        <div className="mb-3 text-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="currentColor"
            className="bi bi-shield-lock"
            viewBox="0 0 16 16"
          >
            <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.123a.52.52 0 0 0 .157.042.52.52 0 0 0 .157-.042c.075-.028.173-.066.293-.123.241-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.5 1.5 0 0 1 1.044 1.262c.599 4.51-.712 7.844-2.404 10.059a11.72 11.72 0 0 1-2.5 2.443c-.37.26-.744.47-1.044.611-.295.139-.553.21-.71.21-.157 0-.415-.071-.71-.21a5.61 5.61 0 0 1-1.044-.611 11.72 11.72 0 0 1-2.5-2.443C2.41 10.536 1.1 7.202 1.699 2.692A1.5 1.5 0 0 1 2.743 1.43c.658-.215 1.777-.57 2.887-.87z" />
            <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 6.5 6.5a1.5 1.5 0 0 1 3 0z" />
          </svg>
        </div>

        <h2 className="h4 fw-bold mb-2">{title}</h2>
        <p className="text-secondary small mb-4">{message}</p>

        <div className="d-flex gap-2 justify-content-center">
          <button
            type="button"
            className="btn btn-outline-secondary px-3"
            onClick={() => navigate(-1)}
          >
            이전 페이지
          </button>
          {showLoginButton ? (
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={() => navigate(ROUTES.AUTH.LOGIN)}
            >
              로그인하기
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={() => navigate(ROUTES.HOME)}
            >
              홈으로 이동
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;