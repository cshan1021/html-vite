// src/domains/board/board.js
// 1. 목록 조회 API
export const fetchTaskList = async (filterParams) => {
  const params = new URLSearchParams();
  Object.entries(filterParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const viteApiUrl = import.meta.env.VITE_API_URL + '/api/v1/tasks';
  const res = await fetch(`${viteApiUrl}?${params.toString()}`);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const resp = await res.json();

  const payload = resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
  return payload.items || (Array.isArray(payload) ? payload : []);
};

// 2. 상세 조회 API
export const fetchTaskDetail = async (id) => {
  if (!id) throw new Error('작업 ID가 필요합니다.');

  const viteApiUrl = import.meta.env.VITE_API_URL + '/api/v1/tasks/';
  const url = `${viteApiUrl}${encodeURIComponent(id)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const resp = await res.json();

  return resp && typeof resp === 'object' && 'data' in resp ? resp.data : resp;
};