// react\src\domain\board\DetailPage.tsx
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTaskDetail, type TaskItem } from './api';

// 1. 상태 이력 항목 인터페이스
export interface TaskStatusHistoryItem {
  id?: string | number;
  step?: string;
  status?: string;
  progress?: number;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

// 2. 상세 조회 API 응답 데이터 인터페이스
export interface TaskDetail extends TaskItem {
  taskId?: string;
  taskType?: string;
  dataKey?: string;
  task_status?: string;
  task_statuses?: TaskStatusHistoryItem[];
  statuses?: TaskStatusHistoryItem[];
}

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>(); // URL 경로 파라미터 (/board/:id)
  const [searchParams] = useSearchParams(); // 기존 목록 검색 파라미터 유지용
  const navigate = useNavigate();

  // 💡 TanStack Query 적용: 상세 데이터 조회 및 캐싱
  const {
    data: detail,
    isLoading,
    isError,
    error,
  } = useQuery<TaskDetail, Error>({
    queryKey: ['task', id], // 'task' 식별자 + 개별 id 기반 캐시 키
    queryFn: () => fetchTaskDetail<TaskDetail>(id!),
    enabled: !!id, // id 값이 존재할 때만 API 요청 진행
  });

  // 뱃지 스타일 매핑 함수
  const getBadgeClass = (status: string): string => {
    switch (status) {
      case 'RUNNING':
      case 'IN_PROGRESS':
      case 'PROGRESS':
        return 'text-bg-primary';
      case 'COMPLETED':
      case 'DONE':
        return 'text-bg-success';
      case 'PENDING':
      case 'READY':
        return 'text-bg-warning';
      case 'FAILED':
        return 'text-bg-danger';
      default:
        return 'text-bg-secondary';
    }
  };

  // 목록으로 돌아가기 (기존 검색 파라미터 복원)
  const handleBackToList = () => {
    const queryString = searchParams.toString();
    navigate(`/board${queryString ? `?${queryString}` : ''}`);
  };

  // 1. 로딩 상태
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">상세 정보를 로딩 중입니다...</p>
      </div>
    );
  }

  // 2. 에러 및 데이터 부재 처리
  if (isError || !detail) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        {error?.message || '상세 정보를 찾을 수 없습니다.'}
        <div className="mt-3">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleBackToList}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 3. 데이터 바인딩 변수
  const taskId = detail.task_id || detail.taskId || '-';
  const taskType = detail.task_type || detail.taskType || '-';
  const dataKey = detail.data_key || detail.dataKey || '-';
  const status = detail.status || detail.task_status || '-';
  const progress = Number.isFinite(detail.progress)
    ? (detail.progress as number)
    : detail.progress ?? 0;
  const statuses: TaskStatusHistoryItem[] =
    detail.task_statuses || detail.statuses || [];

  return (
    <div className="board-detail-page">
      {/* 상단 타이틀 영역 */}
      <div className="page-title d-flex align-items-start justify-content-between mb-4">
        <div>
          <h1>작업 상세</h1>
          <p className="text-muted mb-0">
            {taskId} 작업의 기본 정보와 상태 이력을 확인합니다.
          </p>
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={handleBackToList}
        >
          목록
        </button>
      </div>

      {/* 기본 정보 패널 */}
      <section className="panel p-4 mb-4 border rounded bg-white">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="text-secondary small">작업 ID</div>
            <div className="fw-semibold">{taskId}</div>
          </div>
          <div className="col-md-3">
            <div className="text-secondary small">작업 유형</div>
            <div>{taskType}</div>
          </div>
          <div className="col-md-3">
            <div className="text-secondary small">데이터 키</div>
            <div>{dataKey}</div>
          </div>
          <div className="col-md-3">
            <div className="text-secondary small">현재 상태</div>
            <span className={`badge ${getBadgeClass(status)}`}>{status}</span>
          </div>
          <div className="col-12">
            <div className="text-secondary small mb-2">진행률</div>
            <div className="progress" style={{ height: '12px' }}>
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {progress}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 상태 이력 테이블 패널 */}
      <section className="panel border rounded bg-white">
        <div className="p-4 border-bottom">
          <h2 className="h5 mb-0">상태 이력</h2>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">단계</th>
                <th scope="col">상태</th>
                <th scope="col">진행률</th>
                <th scope="col">메시지</th>
                <th scope="col">생성 일시</th>
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(statuses) || statuses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    상태 이력이 없습니다.
                  </td>
                </tr>
              ) : (
                statuses.map((s: TaskStatusHistoryItem, idx: number) => {
                  const step = s.step || '';
                  const st = s.status || '';
                  const prog = Number.isFinite(s.progress)
                    ? (s.progress as number)
                    : s.progress ?? 0;
                  const msg = s.message || '';
                  const created = s.created_at || s.updated_at || '';

                  return (
                    <tr key={s.id || idx}>
                      <td>{step}</td>
                      <td>
                        <span className={`badge ${getBadgeClass(st)}`}>
                          {st}
                        </span>
                      </td>
                      <td>{prog}%</td>
                      <td>{msg}</td>
                      <td>{created}</td>
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