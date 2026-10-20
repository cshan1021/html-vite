// src/pages/TaskPage.tsx
import { API_EPS } from '../../constant/config';
import { useSse } from '../../hook/useSse';
import type { TaskSseResponse } from './schema';

export default function SsePage() {
  // 공통 SSE 훅 적용
  const {
    data: taskState,
    isConnected,
    errorMsg,
    disconnect,
  } = useSse<TaskSseResponse>({
    url: API_EPS.TASKS.SSE,
    eventName: 'task_event',
    shouldClose: (res) => res.status === 'COMPLETED' || res.status === 'ERROR',
  });

  const progress = taskState?.data?.progress ?? 0;
  const status = taskState?.status;

  return (
    <div>
      {/* 페이지 타이틀 */}
      <div className="page-title">
        <h1>작업 진행 상황</h1>
        <p>실시간 SSE(Server-Sent Events) 작업을 모니터링합니다.</p>
      </div>

      {/* 작업 상태 패널 */}
      <div className="panel p-4">
        {/* 상단 연결 상태 표시 및 중지 버튼 */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <span
              className={`spinner-grow spinner-grow-sm ${
                isConnected ? 'text-success' : 'text-secondary'
              }`}
              role="status"
            ></span>
            <span className="fw-semibold">
              {isConnected ? '실시간 스트리밍 중...' : '연결 종료됨'}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* 작업 중지 버튼 */}
            {isConnected && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={disconnect}
              >
                작업 중지
              </button>
            )}

            {status && (
              <span
                className={`badge fs-6 ${
                  status === 'COMPLETED'
                    ? 'bg-success'
                    : status === 'ERROR'
                    ? 'bg-danger'
                    : 'bg-primary'
                }`}
              >
                {status}
              </span>
            )}
          </div>
        </div>

        {/* 에러 메시지 출력 */}
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        {/* 진행률 바 (Progress Bar) */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-1">
            <span className="small text-muted">진행률</span>
            <span className="fw-bold">{progress}%</span>
          </div>
          <div className="progress" style={{ height: '24px' }}>
            <div
              className={`progress-bar progress-bar-striped ${
                status === 'PROGRESS' && isConnected ? 'progress-bar-animated' : ''
              } ${status === 'COMPLETED' ? 'bg-success' : 'bg-primary'}`}
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {progress}%
            </div>
          </div>
        </div>

        {/* 세부 데이터 정보 표시 */}
        {taskState ? (
          <div className="card bg-light border-0">
            <div className="card-body">
              <h5 className="card-title text-secondary border-bottom pb-2 mb-3 fs-6">
                최신 이벤트 정보
              </h5>
              <div className="row g-2 small">
                <div className="col-sm-4 text-muted">작업 ID:</div>
                <div className="col-sm-8 fw-semibold">{taskState.data?.id ?? '-'}</div>

                <div className="col-sm-4 text-muted">단계(Step):</div>
                <div className="col-sm-8 fw-semibold">{taskState.data?.step ?? '-'}</div>

                <div className="col-sm-4 text-muted">메시지:</div>
                <div className="col-sm-8 text-primary fw-semibold">
                  {taskState.message}
                </div>

                <div className="col-sm-4 text-muted">타임스탬프:</div>
                <div className="col-sm-8 text-muted">
                  {new Date(taskState.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 text-muted">
            이벤트를 수신하기 위해 기다리는 중입니다...
          </div>
        )}
      </div>
    </div>
  );
}