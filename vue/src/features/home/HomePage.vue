<!-- vue\src\features\home\HomePage.vue -->
<template>
  <section class="panel p-4 border rounded bg-white">
    <div class="page-title mb-4">
      <h1>작업 관리 서비스</h1>
      <p class="text-muted">
        작업 진행 상태를 조회하고 AI Chat으로 간단한 질문을 보낼 수 있습니다.
      </p>
    </div>
    <div class="d-flex gap-2">
      <!-- React의 <Link to="/board"> 대신 <router-link to="/board"> 사용 -->
      <router-link class="btn btn-primary" to="/board">
        작업 목록 보기
      </router-link>
      <router-link class="btn btn-outline-secondary" to="/chat">
        AI Chat 열기
      </router-link>
    </div>
  </section>
</template>

<script setup>
// js 영역
</script>

<style scoped>
/* css 영역 */
</style>