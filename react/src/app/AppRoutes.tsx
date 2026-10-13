// react\src\app\AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../component/layout/MainLayout';

// 페이지
import HomePage from '../domain/home/HomePage';
import TaskListPage from '../domain/task/ListPage';
import TaskDetailPage from '../domain/task/DetailPage';
import ChatPage from '../domain/chat/ChatPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 홈페이지 */}
        <Route path="/" element={<HomePage />} />

        {/* 게시판 */}
        <Route path="/task" element={<TaskListPage />} />
        <Route path="/task/:id" element={<TaskDetailPage />} />

        {/* CHAT */}
        <Route path="/chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}