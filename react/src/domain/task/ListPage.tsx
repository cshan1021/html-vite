// react/src/pages/TaskListPage.tsx
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { ENDPOINTS } from '../../constant/config';
import { ROUTES } from '../../constant/routes';
import { useSearchFilter } from '../../hook/useSearchFilter';
import { httpGet } from '../../util/http';
import { TASK_SEARCH_FILTER, type TaskListItem, type TaskListData } from './schema';

export default function TaskListPage() {
  const navigate = useNavigate();

  // 공통 검색 필터 훅 적용
  const {
    filter,
    activeFilter,
    handleInputChange,
    handleSubmit,
    handleReset,
  } = useSearchFilter(TASK_SEARCH_FILTER);

  // 데이터 조회 및 캐싱
  const {
    data = { items: [], total: 0, page: 1, limit: 10 },
    isLoading,
    isError,
    error,
  } = useQuery<TaskListData, Error>({
    queryKey: ['task', activeFilter],
    queryFn: () => httpGet<TaskListData>(ENDPOINTS.TASKS.LIST, activeFilter, 'items')
  });

  const { items, total } = data;

  // 상세 페이지 이동
  const handleRowClick = (item: TaskListItem) => {
    const id = item.id || '';
    const params = new URLSearchParams();
    Object.entries(activeFilter).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    navigate(`${ROUTES.TASK.DETAIL(id)}?${params.toString()}`);
  };

  return (
    <div className="task-list-page">
      <div className="page-title mb-4">
        <h1>작업 목록</h1>
        <p className="text-muted">
          키워드, 상태, 기간 조건으로 작업 진행 현황을 검색합니다. (총 {total}건)
        </p>
      </div>

      {/* 검색 필터 폼 */}
      <section className="panel p-4 mb-4 border rounded bg-white">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label" htmlFor="keyword">
              검색어
            </label>
            <input id="keyword" className="form-control" type="text" placeholder="검색어 입력" value={filter.keyword || ''} onChange={handleInputChange}/>
          </div>

          <div className="col-md-2">
            <label className="form-label" htmlFor="status">
              상태
            </label>
            <select id="status" className="form-select" value={filter.status || ''} onChange={handleInputChange}>
              <option value="">전체</option>
              <option value="PENDING">PENDING</option>
              <option value="PROGRESS">PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label" htmlFor="start_date">
              시작일
            </label>
            <input id="start_date" className="form-control" type="date" value={filter.start_date || ''} onChange={handleInputChange}/>
          </div>

          <div className="col-md-3">
            <label className="form-label" htmlFor="end_date">
              종료일
            </label>
            <input id="end_date" className="form-control" type="date" value={filter.end_date || ''} onChange={handleInputChange}/>
          </div>

          <div className="col-12 d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" type="button" onClick={handleReset}>
              초기화
            </button>
            <button className="btn btn-primary" type="submit">
              검색
            </button>
          </div>
        </form>
      </section>

      {/* 테이블 목록 */}
      <section className="panel border rounded bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    데이터를 로딩 중입니다...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="text-center text-danger py-4">
                    {error?.message ||
                      '데이터를 불러오는 중 오류가 발생했습니다.'}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((t: TaskListItem, idx: number) => {
                  const status = t.status || '';
                  const progress = Number.isFinite(t.progress)
                    ? (t.progress as number)
                    : t.progress ?? 0;
                  const updated = t.updated_at || t.created_at || '';
                  const dataKey = t.data_key || '';

                  return (
                    <tr
                      key={t.id || idx}
                      role="button"
                      onClick={() => handleRowClick(t)}
                    >
                      <td>{(data.page - 1) * data.limit + idx + 1}</td>
                      <td className="fw-semibold">{t.id || ''}</td>
                      <td>{t.task_type || ''}</td>
                      <td>{dataKey}</td>
                      <td>{status}</td>
                      <td>{progress}</td>
                      <td>{updated}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}