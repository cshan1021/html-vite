// react\src\schema\sse.ts

// 이벤트 처리 상태
export type SseStatus = 'PROGRESS' | 'COMPLETED' | 'ERROR' | 'HEARTBEAT';

// 공용 SSE 응답 제네릭 인터페이스
export type SseResponse<T> = {
  // 이벤트 처리 상태
  status: SseStatus;

  // 사용자 메시지
  message: string;

  // 실제 페이로드 데이터
  data?: T;

  // 이벤트 발생 시각
  timestamp: number;
}

/* 예시)
export type TaskPayload = {
  taskId: string;
  percent: number;
};
export type TaskSseResponse = SseResponse<TaskPayload>;
*/
