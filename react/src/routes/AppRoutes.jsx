// react\src\routes\AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// 페이지
import HomePage from '../features/home/HomePage';
import BoardListPage from '../features/board/ListPage';
import BoardDetailPage from '../features/board/DetailPage';
import ChatPage from '../features/chat/ChatPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 홈페이지 */}
        <Route path="/" element={<HomePage />} />

        {/* 게시판 */}
        <Route path="/board" element={<BoardListPage />} />
        <Route path="/board/:id" element={<BoardDetailPage />} />

        {/* CHAT */}
        <Route path="/chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}