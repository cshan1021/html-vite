const SearchManager = {
  /**
   * 1. Form 내 id가 있는 모든 엘리먼트의 값을 객체(Object)로 추출
   * @param {string|HTMLElement} formTarget - Form의 ID 문자열 또는 Form 엘리먼트
   * @returns {Object} 추출된 검색 조건 객체
   */
  buildParams(formTarget) {
    const form = typeof formTarget === 'string' ? document.getElementById(formTarget) : formTarget;
    if (!form) return {};

    const params = {};
    // id 속성을 가진 모든 입력 요소 조회
    const elements = form.querySelectorAll('[id]');

    elements.forEach(el => {
      const id = el.id;
      const type = el.type;

      if (type === 'checkbox') {
        params[id] = el.checked;
      } else if (type === 'radio') {
        if (el.checked) params[id] = el.value;
      } else {
        params[id] = el.value;
      }
    });

    return params;
  },

  /**
   * 2. 객체 또는 URL 쿼리 파라미터를 Form 엘리먼트에 자동 바인딩
   * @param {string|HTMLElement} formTarget - Form의 ID 문자열 또는 Form 엘리먼트
   * @param {Object|string|URLSearchParams} params - 바인딩할 데이터
   */
  bindParams(formTarget, params) {
    const form = typeof formTarget === 'string' ? document.getElementById(formTarget) : formTarget;
    if (!form || !params) return;

    // 입력 데이터 형태 정규화 (String / URLSearchParams -> JS Object)
    let data = params;
    if (typeof params === 'string') {
      data = Object.fromEntries(new URLSearchParams(params));
    } else if (params instanceof URLSearchParams) {
      data = Object.fromEntries(params);
    }

    Object.keys(data).forEach(id => {
      // form 내부에서 id로 엘리먼트 검색
      const el = form.querySelector(`#${CSS.escape(id)}`);
      if (!el) return;

      const val = data[id];
      const type = el.type;

      if (type === 'checkbox') {
        el.checked = val === true || val === 'true';
      } else if (type === 'radio') {
        el.checked = el.value === String(val);
      } else {
        el.value = val ?? '';
      }
    });
  },

  /**
   * 3. 현재 URL의 Query String을 객체로 변환 (보조 함수)
   */
  getQueryParam() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
  }
};