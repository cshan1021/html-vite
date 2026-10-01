<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <!-- 상단 헤더 -->
    <header class="app-header">
      <div class="app-container d-flex align-items-center justify-content-between">
        <router-link class="navbar-brand fw-semibold text-white" to="/">
          html vite 프로젝트
        </router-link>
        <span class="text-white-50 small">작업 관리 및 AI 대화 서비스</span>
      </div>
    </header>

    <!-- 앱 셸 (사이드바 + 메인 본문) -->
    <div class="app-shell app-container">
      <aside class="app-sidebar">
        <div class="sidebar-title">메뉴</div>
        <nav class="sidebar-nav">
          <!-- RouterLink를 사용하여 페이지 이동 시 새로고침 방지 -->
          <router-link to="/board">
            <i class="bi bi-list-task"></i>
            <span>게시판</span>
          </router-link>
          <router-link to="/chat">
            <i class="bi bi-chat-dots"></i>
            <span>AI CHAT</span>
          </router-link>
        </nav>
      </aside>

      <!-- Nunjucks의 {% block content %} 자리에 들어가는 본문 라우터 뷰 -->
      <main id="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
// js 불러오기
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
</script>

<style>
/* scoped를 붙이지 않아야 자식 라우터 컴포넌트들(<router-view>)까지 전역 반영됩니다. */
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
@import '@/assets/css/style.css';
</style>