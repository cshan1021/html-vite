<!-- vue\src\features\board\DetailPage.vue -->
<template>
  <div class="board-detail-page">
    <!-- 상단 타이틀 및 목록 돌아가기 버튼 -->
    <div class="page-title d-flex align-items-start justify-content-between mb-4">
      <div>
        <h1>작업 상세</h1>
        <p class="text-muted">
          {{ detailData?.task_id || detailData?.taskId || '작업' }}의 기본 정보와 상태 이력을 확인합니다.
        </p>
      </div>
      <!-- 기존 검색 조건을 query에 그대로 유지하며 목록으로 이동 -->
      <button class="btn btn-outline-secondary" @click="goList">
        목록
      </button>
    </div>

    <!-- 로딩 중일 때 표시 -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
      <!-- 기본 정보 패널 -->
      <section class="panel p-4 mb-4 border rounded bg-white">
        <div class="row g-4">
          <div class="col-md-3">
            <div class="text-secondary small">작업 ID</div>
            <div class="fw-semibold">
              {{ detailData?.task_id || detailData?.taskId || '-' }}
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-secondary small">작업 유형</div>
            <div>
              {{ detailData?.task_type || detailData?.taskType || '-' }}
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-secondary small">데이터 키</div>
            <div>
              {{ detailData?.data_key || detailData?.dataKey || '-' }}
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-secondary small">현재 상태</div>
            <span :class="['badge', badgeClass(currentStatus)]">
              {{ currentStatus || '-' }}
            </span>
          </div>
          <div class="col-12">
            <div class="text-secondary small mb-2">진행률</div>
            <div class="progress" style="height: 12px;">
              <div
                :class="['progress-bar', progressClass(currentStatus)]"
                :style="{ width: currentProgress + '%' }"
              >
                {{ currentProgress }}%
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 상태 이력 테이블 패널 -->
      <section class="panel border rounded bg-white">
        <div class="p-4 border-bottom">
          <h2 class="h5 mb-0">상태 이력</h2>
        </div>
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">단계</th>
                <th scope="col">상태</th>
                <th scope="col">진행률</th>
                <th scope="col">메시지</th>
                <th scope="col">생성 일시</th>
              </tr>
            </thead>
            <tbody>
              <!-- 이력이 없을 경우 -->
              <tr v-if="statusList.length === 0">
                <td colspan="5" class="text-center py-4">상태 이력이 없습니다.</td>
              </tr>

              <!-- 이력 반복 출력 -->
              <tr v-else v-for="(s, idx) in statusList" :key="s.id || idx">
                <td>{{ s.step || '' }}</td>
                <td>
                  <span :class="['badge', badgeClass(s.status)]">
                    {{ s.status || '' }}
                  </span>
                </td>
                <td>{{ getProgress(s.progress) }}%</td>
                <!-- Vue 템플릿 {{ }}은 자동으로 HTML XSS 이스케이프를 수행합니다 -->
                <td>{{ s.message || '' }}</td>
                <td>{{ s.created_at || s.updated_at || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const viteApiUrl = `${import.meta.env.VITE_API_URL || ''}/api/v1/tasks/`;

const detailData = ref(null);
const isLoading = ref(true);

// 수치 계산 헬퍼
const getProgress = (val) => {
  if (Number.isFinite(val)) return val;
  return val ?? 0;
};

// 현재 작업의 전체 상태 및 진행률 계산
const currentStatus = computed(() => {
  if (!detailData.value) return '';
  return detailData.value.status || detailData.value.task_status || '';
});

const currentProgress = computed(() => {
  if (!detailData.value) return 0;
  return getProgress(detailData.value.progress);
});

// 이력 배열 추출
const statusList = computed(() => {
  if (!detailData.value) return [];
  const list = detailData.value.task_statuses || detailData.value.statuses || [];
  return Array.isArray(list) ? list : [];
});

// 뱃지 CSS 클래스 매핑
const badgeClass = (status) => {
  if (!status) return 'text-bg-secondary';
  if (status === 'RUNNING' || status === 'IN_PROGRESS' || status === 'PROGRESS') return 'text-bg-primary';
  if (status === 'COMPLETED' || status === 'DONE') return 'text-bg-success';
  if (status === 'PENDING' || status === 'READY') return 'text-bg-warning';
  if (status === 'FAILED') return 'text-bg-danger';
  return 'text-bg-secondary';
};

// 프로그레스 바 CSS 클래스 매핑
const progressClass = (status) => {
  if (status === 'COMPLETED' || status === 'DONE') return 'bg-success';
  if (status === 'PENDING' || status === 'READY') return 'bg-warning';
  if (status === 'FAILED') return 'bg-danger';
  return '';
};

// 상세 데이터 패칭
const fetchDetail = async () => {
  // Vue Router의 파라미터나 쿼리 스트링에서 id 확인
  const id = route.params.id || route.query.id || '';

  if (!id) {
    console.error('no id provided');
    isLoading.value = false;
    return;
  }

  const url = viteApiUrl + encodeURIComponent(id);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const resp = await res.json();
    const payload = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
    detailData.value = payload;
  } catch (err) {
    console.error('fetchDetail error', err);
  } finally {
    isLoading.value = false;
  }
};

// 목록으로 돌아가기 (이전 검색 필터 쿼리 스트링 유지)
const goList = () => {
  const query = { ...route.query };
  delete query.id; // 상세 id값만 제외하고 검색 조건 전달

  router.push({
    path: '/board',
    query
  });
};

onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
/* 상세 페이지 전용 스타일 */
</style>