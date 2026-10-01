// src/layouts/MainLayout.jsx
import { Link, NavLink, Outlet } from 'react-router-dom';

// css import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@/assets/css/style.css';

export default function MainLayout() {
  return (
    <div className="app-wrapper">
      {/* 헤더 영역 */}
      <header className="app-header">
        <div className="app-container d-flex align-items-center justify-content-between">
          <Link className="navbar-brand fw-semibold text-white" to="/">
            React Vite 프로젝트
          </Link>
          <span className="text-white-50 small">작업 관리 및 AI 대화 서비스</span>
        </div>
      </header>

      {/* 메인 셸 (사이드바 + 콘텐츠) */}
      <div className="app-shell app-container">
        {/* 사이드바 영역 */}
        <aside className="app-sidebar">
          <div className="sidebar-title">메뉴</div>
          <nav className="sidebar-nav">
            <NavLink 
              to="/board" 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <i className="bi bi-list-task me-2"></i>
              <span>게시판</span>
            </NavLink>
            <NavLink 
              to="/chat" 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <i className="bi bi-chat-dots me-2"></i>
              <span>AI CHAT</span>
            </NavLink>
          </nav>
        </aside>

        {/* 본문 영역 (Nunjucks의 {% block content %} 역할) */}
        <main id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}