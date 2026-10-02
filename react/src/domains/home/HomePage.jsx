// react\src\domains\home\HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="panel p-4 border rounded bg-white">
      <div className="page-title mb-4">
        <h1>작업 관리 서비스</h1>
        <p className="text-muted">
          작업 진행 상태를 조회하고 AI Chat으로 간단한 질문을 보낼 수 있습니다.
        </p>
      </div>
      <div className="d-flex gap-2">
        <Link className="btn btn-primary" to="/board">
          작업 목록 보기
        </Link>
        <Link className="btn btn-outline-secondary" to="/chat">
          AI Chat 열기
        </Link>
      </div>
    </section>
  );
}