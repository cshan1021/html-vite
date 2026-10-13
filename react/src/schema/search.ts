// react\src\schema\search.ts

// 공통 검색 요청
export const DEFAULT_SEARCH_FILTER = {
  keyword: '',
  page: 1,
  limit: 10,
};
/*
예시) 필터 확장 (status 추가)
export const SEARCH_FILTER = {
  ...DEFAULT_SEARCH_FILTER,
  status: '',
};
export type SearchFilterParams = typeof SEARCH_FILTER;
*/