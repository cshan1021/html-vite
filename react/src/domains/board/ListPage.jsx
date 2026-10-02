// src/domains/board/ListPage.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTaskList } from './board';

export default function BoardListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. 입력 폼의 상태 (Client State)
  const [filter, setFilter] = useState({
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
    start_date: searchParams.get('start_date') || '',
    end_date: searchParams.get('end_date') || '',
  });

  // 2. 실제 API 조회에 적용되는 쿼리 상태 (URL searchParams 기반)
  const activeFilter = {
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
    start_date: searchParams.get('start_date') || '',
    end_date: searchParams.get('end_date') || '',
  };

  // 3. React Query를 통한 서버 데이터 조회 (Server State)
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tasks', activeFilter], // activeFilter가 바뀔 때만 자동 재조회 & 캐싱
    queryFn: () => fetchTaskList(activeFilter),
  });

  // 뱃지 / 프로그레스바 클래스 헬퍼
  const getBadgeClass = (status) => {
    switch (status) {
      case 'RUNNING':
      case 'PROGRESS':
        return 'text-bg-primary';
      case 'DONE':
      case 'COMPLETED':
        return 'text-bg-success';
      case 'READY':
      case 'PENDING':
        return 'text-bg-warning';
      case 'FAILED':
        return 'text-bg-danger';
      default:
        return 'text-bg-secondary';
    }
  };

  const getProgressClass = (status) => {
    switch (status) {
      case 'DONE':
      case 'COMPLETED':
        return 'bg-success';
      case 'READY':
      case 'PENDING':
        return 'bg-warning';
      case 'FAILED':
        return 'bg-danger';
      default:
        return '';
    }
  };

  // 4. 이벤트 핸들러
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFilter((prev) => ({ ...prev, [id]: value }));
  };

  // 검색 시 URL의 SearchParams를 업데이트 (자동으로 React Query가 감지하여 fetch)
  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    setSearchParams(params);
  };

  // 초기화 시 폼 상태와 URL 파라미터를 모두 비움
  const handleReset = () => {
    const emptyFilter = { keyword: '', status: '', start_date: '', end_date: '' };
    setFilter(emptyFilter);
    setSearchParams({});
  };

  // 상세 페이지 이동 (현재 검색 조건 유지)
  const handleRowClick = (item) => {
    const id = item.id || item.ID || '';
    const params = new URLSearchParams();
    Object.entries(activeFilter).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    navigate(`/board/${id}?${params.toString()}`);
  };

  return (
    <div className="board-list-page">
      <div className="page-title mb-4">
        <h1>작업 목록</h1>
        <p className="text-muted">키워드, 상태, 기간 조건으로 작업 진행 현황을 검색합니다.</p>
      </div>

      {/* 검색 필터 폼 */}
      <section className="panel p-4 mb-4 border rounded bg-white">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label" htmlFor="keyword">검색어</label>
            <input
              id="keyword"
              className="form-control"
              type="text"
              placeholder="검색어 입력"
              value={filter.keyword}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label" htmlFor="status">상태</label>
            <select
              id="status"
              className="form-select"
              value={filter.status}
              onChange={handleInputChange}
            >
              <option value="">전체</option>
              <option value="PENDING">PENDING</option>
              <option value="PROGRESS">PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label" htmlFor="start_date">시작일</label>
            <input
              id="start_date"
              className="form-control"
              type="date"
              value={filter.start_date}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label" htmlFor="end_date">종료일</label>
            <input
              id="end_date"
              className="form-control"
              type="date"
              value={filter.end_date}
              onChange={handleInputChange}
            />
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
                  <td colSpan="7" className="text-center py-4">데이터를 로딩 중입니다...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="7" className="text-center text-danger py-4">
                    {error?.message || '데이터를 불러오는 중 오류가 발생했습니다.'}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">검색 결과가 없습니다.</td>
                </tr>
              ) : (
                items.map((t, idx) => {
                  const status = t.status || '';
                  const progress = Number.isFinite(t.progress) ? t.progress : (t.progress ?? 0);
                  const updated = t.updated_at || t.created_at || '';
                  const dataKey = t.data_key || '';

                  return (
                    <tr
                      key={t.id || t.task_id || idx}
                      role="button"
                      onClick={() => handleRowClick(t)}
                    >
                      <td>{idx + 1}</td>
                      <td className="fw-semibold">{t.task_id || ''}</td>
                      <td>{t.task_type || ''}</td>
                      <td>{dataKey}</td>
                      <td>
                        <span className={`badge ${getBadgeClass(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className={`progress-bar ${getProgressClass(status)}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </td>
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