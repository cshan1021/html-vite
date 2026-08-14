const CodeManager = {
  STORAGE_KEY: "APP_COMMON_CODES",

  // 1. 공통코드 로드 (세션에 있으면 사용, 없으면 API 호출)
  async init() {
    const cached = sessionStorage.getItem(this.STORAGE_KEY);

    if (cached) {
      // console.log("sessionStorage에서 공통코드를 사용합니다.");
      return JSON.parse(cached);
    }

    // 세션에 없으면 API 호출 후 저장
    return await this.fetchAndSave();
  },

  // 2. 백엔드 API 호출 및 sessionStorage 저장
  async fetchAndSave() {
    try {
      const response = await fetch("/api/v1/common-codes");
      const result = await response.json();
      
      /* 백엔드 응답 데이터 구조 예시:
        {
          "TASK_STATUS": [
            { "code": "PROGRESS", "label": "진행중" },
            { "code": "SUCCESS", "label": "성공" },
            { "code": "FAIL", "label": "실패" }
          ],
          "TASK_TYPE": [
            { "code": "TYPE_A", "label": "유형 A" },
            { "code": "TYPE_B", "label": "유형 B" }
          ]
        }
      */
      const codes = result.data || result;
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(codes));
      return codes;
    } catch (error) {
      console.error("공통코드 로드 실패:", error);
      return {};
    }
  },

  // 3. 특정 그룹의 코드 리스트 반환 (예: getList('TASK_STATUS'))
  getList(groupCode) {
    const cached = sessionStorage.getItem(this.STORAGE_KEY);
    if (!cached) return [];

    const codes = JSON.parse(cached);
    return codes[groupCode] || [];
  },

  // 4. 코드값 -> 라벨 변환 (예: getLabel('TASK_STATUS', 'SUCCESS') -> "성공")
  getLabel(groupCode, code) {
    const list = this.getList(groupCode);
    const item = list.find((item) => item.code === code);
    return item ? item.label : code;
  },

  // 5. [유틸리티] <select> 드롭다운에 옵션 태그 동적 생성
  renderSelect(selectId, groupCode, defaultLabel = "전체") {
    const selectEl = document.getElementById(selectId);
    if (!selectEl) return;

    const list = this.getList(groupCode);
    let html = `<option value="">${defaultLabel}</option>`;

    list.forEach((item) => {
      html += `<option value="${item.code}">${item.label}</option>`;
    });

    selectEl.innerHTML = html;
  }
};