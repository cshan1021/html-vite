// react\src\app\AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../component/layout/MainLayout';

// 페이지
import HomePage from '../domain/home/HomePage';
import BoardListPage from '../domain/board/ListPage';
import BoardDetailPage from '../domain/board/DetailPage';
import ChatPage from '../domain/chat/ChatPage';

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