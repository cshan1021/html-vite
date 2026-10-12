// src/hook/useSearchFilter.ts
import { useState, useEffect, type ChangeEvent, type SubmitEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * 기본 필터 객체(defaultFilter) 기반 공통 검색 훅
 */
export function useSearchFilter<T extends Record<string, any>>(defaultFilter: T) {
  const [searchParams, setSearchParams] = useSearchParams();
  const keys = Object.keys(defaultFilter) as (keyof T)[];

  // Helper: 현재 URL SearchParams에서 필터 객체 추출
  const getFilterFromUrl = (): T => {
    const params = { ...defaultFilter };
    keys.forEach((key) => {
      const urlVal = searchParams.get(key as string);
      if (urlVal !== null) {
        // 숫자 타입 필드(page, size 등)는 숫자로 변환
        const defaultVal = defaultFilter[key];
        if (typeof defaultVal === 'number') {
          params[key] = (Number(urlVal) || defaultVal) as T[keyof T];
        } else {
          params[key] = urlVal as T[keyof T];
        }
      }
    });
    return params;
  };

  // 1. Client State (폼 입력 중인 상태)
  const [filter, setFilter] = useState<T>(getFilterFromUrl);

  // 2. Active Filter (실제 URL 기반 적용 필터 - API 조회 키값으로 사용)
  const activeFilter = getFilterFromUrl();

  // URL 변경(뒤로가기/링크 이동 등) 감지 시 폼 상태 동기화
  useEffect(() => {
    setFilter(getFilterFromUrl());
  }, [searchParams]);

  // input/select 태그의 onChange 전용 핸들러 (id 또는 name 기준)
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, name, value } = e.target;
    const key = (id || name) as keyof T;
    if (key) {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };

  // 특정 필드값 수동 변경 핸들러
  const handleChange = (name: keyof T, value: any) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // 검색 제출 (URL SearchParams 업데이트)
  const handleSubmit = (e?: SubmitEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const newParams = new URLSearchParams();

    Object.entries(filter).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        newParams.set(key, String(val));
      }
    });

    setSearchParams(newParams);
  };

  // 초기화 핸들러 (기본값으로 복원)
  const handleReset = () => {
    setFilter(defaultFilter);
    setSearchParams({});
  };

  return {
    filter,
    activeFilter,
    handleInputChange,
    handleChange,
    handleSubmit,
    handleReset,
    setFilter,
  };
}