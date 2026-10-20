// react\src\hook\useSse.ts
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (!url) return;

    // 1. URL 기반으로 EventSource 직접 생성
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setIsConnected(true);
      setErrorMsg(null);
    };

    // 2. 이벤트 핸들러
    const handleEvent = (event: MessageEvent) => {
      try {
        const parsedData: T = JSON.parse(event.data);
        setData(parsedData);

        if (shouldClose && shouldClose(parsedData)) {
          eventSource.close();
          setIsConnected(false);
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

    // 3. 에러 핸들러
    eventSource.onerror = (err) => {
      console.error('SSE 연결 오류:', err);
      setErrorMsg('서버 연결 중 오류가 발생했거나 연결이 종료되었습니다.');
      setIsConnected(false);
      eventSource.close();
    };

    // 4. Cleanup (언마운트 및 url 변경 시에만 연결 해제)
    return () => {
      if (eventName !== 'message') {
        eventSource.removeEventListener(eventName, handleEvent);
      }
      eventSource.close();
    };
  }, [url, eventName]); // url이 변경될 때만 재연결 실행

  return { data, isConnected, errorMsg };
};