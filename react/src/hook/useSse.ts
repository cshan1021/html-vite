// react\src\hook\useSse.ts
import { useEffect, useState, useRef, useCallback } from 'react';

interface UseSseOptions<T> {
  /** SSE 수신 URL */
  url: string;
  /** 수신할 이벤트 이름 (기본값: 'message') */
  eventName?: string;
  /** 연결 자동 종료 조건 */
  shouldClose?: (data: T) => boolean;
}

export const useSse = <T>({
  url,
  eventName = 'message',
  shouldClose,
}: UseSseOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. EventSource 인스턴스를 수동 종료에서도 참조하기 위해 useRef 사용
  const eventSourceRef = useRef<EventSource | null>(null);

  // 2. 사용자가 수동으로 연결을 끊는 함수
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (!url) return;

    // 기존 연결이 있다면 정리
    disconnect();

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setErrorMsg(null);
    };

    const handleEvent = (event: MessageEvent) => {
      try {
        const parsedData: T = JSON.parse(event.data);
        setData(parsedData);

        if (shouldClose && shouldClose(parsedData)) {
          disconnect();
        }
      } catch (err) {
        console.error('SSE JSON 파싱 에러:', err);
      }
    };

    if (eventName === 'message') {
      eventSource.onmessage = handleEvent;
    } else {
      eventSource.addEventListener(eventName, handleEvent);
    }

    eventSource.onerror = (err) => {
      console.error('SSE 연결 오류:', err);
      setErrorMsg('서버 연결 중 오류가 발생했거나 연결이 종료되었습니다.');
      disconnect();
    };

    // Cleanup
    return () => {
      if (eventName !== 'message') {
        eventSource.removeEventListener(eventName, handleEvent);
      }
      disconnect();
    };
  }, [url, eventName, disconnect]);

  // 3. disconnect 함수를 반환 객체에 추가
  return { data, isConnected, errorMsg, disconnect };
};