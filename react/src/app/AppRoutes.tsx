// react\src\app\AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';

// 라우트 경로 정의
import { ROUTES } from '../constant/routes';

// 레이아웃
import MainLayout from '../component/layout/MainLayout';

// 도메인 페이지
import HomePage from '../domain/home/HomePage';
import TaskListPage from '../domain/task/ListPage';
import TaskDetailPage from '../domain/task/DetailPage';
import TaskSsePage from '../domain/task/SsePage';
import ChatPage from '../domain/chat/ChatPage';
import LoginPage from '../domain/auth/LoginPage';
import ProtectedPage from '../domain/auth/ProtectedPage';

// 에러 페이지
import Unauthorized from '../component/error/Unauthorized'


export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 홈페이지 */}
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* 게시판 */}
        <Route path={ROUTES.TASK.LIST} element={<TaskListPage />} />
        <Route path={ROUTES.TASK.DETAIL()} element={<TaskDetailPage />} />

        {/* SSE */}
        <Route path={ROUTES.TASK.SSE} element={<TaskSsePage />} />

        {/* CHAT */}
        <Route path={ROUTES.CHAT} element={<ChatPage />} />

        {/* 로그인 */}
        <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.AUTH.PROTECTED} element={<ProtectedPage />} />

        {/* 오류 */}
        <Route path={ROUTES.ERROR.UNAUTHORIZED} element={<Unauthorized />} />
      </Route>
    </Routes>
  );
}