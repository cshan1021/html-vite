// react\src\domain\task\SsePage.tsx
import { useState, useCallback } from 'react';

import { ENDPOINTS } from '../../constant/config';
import { useSse } from '../../hook/useSse';
import type { TaskSseResponse } from './schema';

export default function SsePage() {
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  // 1. 동적으로 구독 URL 생성 (taskId가 있을 때만 연결)
  const sseUrl = currentTaskId ? `${ENDPOINTS.TASKS.SSE}/${currentTaskId}` : '';

  // 2. 공통 SSE 훅 연결
  const {
    data: taskState,
    isConnected,
    errorMsg,
    disconnect,
  } = useSse<TaskSseResponse>({
    url: sseUrl,
    // Axum SSE 기본 이벤트명인 'message' 적용 (생략 시 기본값 'message')
    eventName: 'task_event',
    shouldClose: (res) => res.status === 'COMPLETED' || res.status === 'ERROR',
  });

  // 3. 작업 시작 (백엔드 sse_create API 호출)
  const handleStartTask = async () => {
    try {
      setIsStarting(true);
      const response = await fetch(ENDPOINTS.TASKS.SSE, {
        method: 'GET', // 또는 백엔드 라우터 설정에 맞춰 POST
      });
      const result = await response.json();

      if (result.success && result.data) {
        setCurrentTaskId(result.data); // taskId 받아와서 SSE 연결 트리거
      } else {
        alert('작업 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('Task 생성 오류:', err);
      alert('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsStarting(false);
    }
  };

  // 4. 작업 취소 (백엔드 sse_cancel API 호출 및 연결 종료)
  const handleCancelTask = useCallback(async () => {
    if (!currentTaskId) return;

    try {
      // 백엔드로 취소 요청 전달
      await fetch(`${ENDPOINTS.TASKS.SSE}/cancel/${currentTaskId}`, {
        method: 'GET', // 또는 DELETE/POST
      });
    } catch (err) {
      console.error('Task 취소 오류:', err);
    } finally {
      disconnect(); // 클라이언트 SSE 연결 수동 종료
    }
  }, [currentTaskId, disconnect]);

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
        {/* 상단 컨트롤 영역: 작업 시작 / 연결 상태 및 취소 버튼 */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <span
              className={`spinner-grow spinner-grow-sm ${
                isConnected ? 'text-success' : 'text-secondary'
              }`}
              role="status"
            ></span>
            <span className="fw-semibold">
              {isConnected ? '실시간 스트리밍 중...' : '연결 대기/종료됨'}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* 작업 시작 버튼 (연결되어 있지 않을 때 활성화) */}
            {!isConnected && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleStartTask}
                disabled={isStarting}
              >
                {isStarting ? '생성 중...' : '새 작업 시작'}
              </button>
            )}

            {/* 작업 중지/취소 버튼 */}
            {isConnected && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleCancelTask}
              >
                작업 취소
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
            '새 작업 시작' 버튼을 눌러 실시간 이벤트를 수신하세요.
          </div>
        )}
      </div>
    </div>
  );
}