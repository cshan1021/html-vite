const SearchManager = {
  // 1. 현재 URL의 쿼리 파라미터 가져오기
  getParams() {
    return new URLSearchParams(window.location.search);
  },

  // 2. [list.html] URL 파라미터를 검색 Form 입력창들에 자동으로 채워주기
  // (페이지 새로고침이나 뒤로가기 했을 때 검색창 값 유지용)
  bindParamsToForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const params = this.getParams();
    params.forEach((value, key) => {
      const input = form.elements[key];
      if (input) {
        input.value = value;
      }
    });
  },

  // 3. [list.html] 상세보기 페이지로 이동할 URL 생성 (현재 검색 파라미터 유지)
  makeDetailUrl(detailBasePath, targetParams = {}) {
    const currentParams = this.getParams();

    // ID 등 추가로 전달할 파라미터 병합 (예: { id: 10 })
    Object.keys(targetParams).forEach(key => {
      currentParams.set(key, targetParams[key]);
    });

    return `${detailBasePath}?${currentParams.toString()}`;
  },

  // 4. [detail.html] "목록으로" 버튼의 href 속성에 이전 검색 조건 자동으로 설정
  setupBackButton(backBtnId, defaultListPath = '/list.html') {
    const backBtn = document.getElementById(backBtnId);
    if (!backBtn) return;

    const currentParams = this.getParams();
    currentParams.delete('id'); // 상세조회용 id 키는 제거

    const searchString = currentParams.toString();
    backBtn.href = searchString ? `${defaultListPath}?${searchString}` : defaultListPath;
  }
};


const SearchSession = {
  // Storage에 저장할 Key 이름 (화면별로 다르게 지정 가능)
  STORAGE_KEY: "APP_SEARCH_CONDITION",

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