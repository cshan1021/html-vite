<!-- vue\src\features\board\ListPage.vue -->
<template>
  <div class="board-list-page">
    <div class="page-title mb-4">
      <h1>작업 목록</h1>
      <p class="text-muted">키워드, 상태, 기간 조건으로 작업 진행 현황을 검색합니다.</p>
    </div>

    <!-- 검색 폼 영역 -->
    <section class="panel p-4 mb-4 border rounded bg-white">
      <form class="row g-3" @submit.prevent="fetchList" @reset="handleReset">
        <div class="col-md-4">
          <label class="form-label" for="keyword">검색어</label>
          <input
            id="keyword"
            v-model="searchForm.keyword"
            class="form-control"
            type="text"
            placeholder="검색어 입력"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label" for="status">상태</label>
          <select id="status" v-model="searchForm.status" class="form-select">
            <option value="">전체</option>
            <option value="PENDING">PENDING</option>
            <option value="PROGRESS">PROGRESS</option>

            <option value="COMPLETED">COMPLETED</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label" for="start_date">시작일</label>
          <input id="start_date" v-model="searchForm.start_date" class="form-control" type="date" />
        </div>
        <div class="col-md-3">
          <label class="form-label" for="end_date">종료일</label>
          <input id="end_date" v-model="searchForm.end_date" class="form-control" type="date" />
        </div>
        <div class="col-12 d-flex justify-content-end gap-2">
          <button class="btn btn-outline-secondary" type="reset">초기화</button>
          <button class="btn btn-primary" type="submit">검색</button>
        </div>
      </form>
    </section>

    <!-- 테이블 데이터 영역 -->
    <section class="panel border rounded bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">No</th>
              <th scope="col">작업 ID</th>
              <th scope="col">유형</th>
              <th scope="col">데이터 키</th>
              <th scope="col">상태</th>
              <th scope="col">진행률</th>
              <th scope="col">수정 일시</th>
            </tr>
          </thead>
          <tbody>
            <!-- 에러 발생 시 -->
            <tr v-if="errorMessage">
              <td colspan="7" class="text-center text-danger py-4">{{ errorMessage }}</td>
            </tr>

            <!-- 데이터가 없을 때 -->
            <tr v-else-if="items.length === 0">
              <td colspan="7" class="text-center py-4">검색 결과가 없습니다.</td>
            </tr>

            <!-- 데이터가 있을 때 반복 출력 -->
            <tr
              v-else
              v-for="(t, idx) in items"
              :key="t.id || t.ID || idx"
              role="button"
              @click="goDetail(t)"
            >
              <td>{{ idx + 1 }}</td>
              <td class="fw-semibold">{{ t.task_id || '' }}</td>
              <td>{{ t.task_type || '' }}</td>
              <td>{{ t.data_key || '' }}</td>
              <td>
                <span :class="['badge', badgeClass(t.status)]">{{ t.status || '' }}</span>
              </td>
              <td>
                <div class="progress" style="height: 8px;">
                  <div
                    :class="['progress-bar', progressClass(t.status)]"
                    :style="{ width: getProgress(t.progress) + '%' }"
                  ></div>
                </div>
              </td>
              <td>{{ t.updated_at || t.created_at || '' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// API 기본 URL (.env 파일 참조)
const viteApiUrl = `${import.meta.env.VITE_API_URL || ''}/api/v1/tasks`;

// 검색 폼 반응형 상태
const searchForm = reactive({
  keyword: '',
  status: '',
  start_date: '',
  end_date: ''
});

// 목록 데이터 및 에러 상태
const items = ref([]);
const errorMessage = ref('');

// 진행률 수치 계산 헬퍼
const getProgress = (progress) => {
  if (Number.isFinite(progress)) return progress;
  return progress ?? 0;
};

// 뱃지 CSS 클래스 매핑
const badgeClass = (status) => {
  if (!status) return 'text-bg-secondary';
  if (status === 'RUNNING' || status === 'PROGRESS') return 'text-bg-primary';
  if (status === 'DONE' || status === 'COMPLETED') return 'text-bg-success';
  if (status === 'READY' || status === 'PENDING') return 'text-bg-warning';
  if (status === 'FAILED') return 'text-bg-danger';
  return 'text-bg-secondary';
};

// 프로그레스 바 CSS 클래스 매핑
const progressClass = (status) => {
  if (status === 'DONE' || status === 'COMPLETED') return 'bg-success';
  if (status === 'READY' || status === 'PENDING') return 'bg-warning';
  if (status === 'FAILED') return 'bg-danger';
  return '';
};

// 목록 조회 함수
const fetchList = async () => {
  errorMessage.value = '';

  // 비어있지 않은 파라미터만 추출
  const params = new URLSearchParams();
  Object.keys(searchForm).forEach((key) => {
    if (searchForm[key]) {
      params.append(key, searchForm[key]);
    }
  });

  const url = `${viteApiUrl}?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const resp = await res.json();

    const payload = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
    const fetchedItems = payload.items || payload;

    items.value = Array.isArray(fetchedItems) ? fetchedItems : [];
  } catch (err) {
    console.error('fetchList error', err);
    errorMessage.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  }
};

// 폼 초기화
const handleReset = () => {
  searchForm.keyword = '';
  searchForm.status = '';
  searchForm.start_date = '';
  searchForm.end_date = '';
  setTimeout(fetchList, 0);
};

// 상세 페이지 이동 (Vue Router 처리)
const goDetail = (item) => {
  const id = item.id ?? item.ID ?? '';
  
  // 현재 검색 조건 쿼리 스트링 유지
  const query = {};
  Object.keys(searchForm).forEach((key) => {
    if (searchForm[key]) query[key] = searchForm[key];
  });

  router.push({
    path: `/board/${id}`,
    query: { id, ...query }
  });
};

// 컴포넌트 마운트 시 (초기 로드) URL Query 파라미터 바인딩 및 데이터 요청
onMounted(() => {
  if (route.query) {
    if (route.query.keyword) searchForm.keyword = route.query.keyword;
    if (route.query.status) searchForm.status = route.query.status;
    if (route.query.start_date) searchForm.start_date = route.query.start_date;
    if (route.query.end_date) searchForm.end_date = route.query.end_date;
  }
  fetchList();
});
</script>

<style scoped>
/* 행 클릭 시 마우스 커서 손모양 변경 */
tr[role='button'] {
  cursor: pointer;
}
</style>