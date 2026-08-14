// js/common-search-session.js

const SearchSessionManager = {
  // Storage에 저장할 Key 이름 (화면별로 다르게 지정 가능)
  STORAGE_KEY: "VITE_SEARCH_CONDITION",

  // 1. 검색 조건 객체(Object)를 JSON으로 저장
  saveState(paramsObj) {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(paramsObj));
  },

  // 2. 저장된 검색 조건 객체 가져오기
  getState() {
    const data = sessionStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  // 3. 저장된 검색 조건 삭제 (초기화 버튼 클릭 시 사용)
  clearState() {
    sessionStorage.removeItem(this.STORAGE_KEY);
  },

  // 4. 저장된 조건이 있다면 Form 입력창에 자동으로 값 채워주기
  bindToForm(formId) {
    const state = this.getState();
    if (!state) return null;

    const form = document.getElementById(formId);
    if (!form) return state;

    // 객체의 key-value를 순회하며 input/select 요소를 찾아 값 할당
    Object.keys(state).forEach((key) => {
      const input = form.elements[key];
      if (input) {
        input.value = state[key];
      }
    });

    return state; // 저장되어 있던 조건 반환
  }
};