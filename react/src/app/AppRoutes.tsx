// react\src\app\AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';

import MainLayout from '../component/layout/MainLayout';
import { ROUTES } from '../constant/routes';

// 페이지
import HomePage from '../domain/home/HomePage';
import TaskListPage from '../domain/task/ListPage';
import TaskDetailPage from '../domain/task/DetailPage';
import TaskSsePage from '../domain/task/SsePage';
import ChatPage from '../domain/chat/ChatPage';

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
      </Route>
    </Routes>
  );
}