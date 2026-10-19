// react\src\app\AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../component/layout/MainLayout';

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
        <Route path="/" element={<HomePage />} />

        {/* 게시판 */}
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />

        {/* SSE */}
        <Route path="/tasks/sse" element={<TaskSsePage />} />

        {/* CHAT */}
        <Route path="/chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}