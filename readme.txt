# html vite 프로젝트
git init -b main
git remote add origin https://github.com/cshan1021/html-vite
git pull origin main

# vanilla html
npm create vite@latest vanilla -- --template vanilla
cd vanilla
npm install

# vanilla vite-plugin-nunjucks 설정 - html template 용도
# vanilla vite.config.js -> export -> plugins 수정
npm install vite-plugin-nunjucks

# vanilla glob 패키지 설치 - Rollup input 객체 자동 생성
# vanilla vite.config.js -> build -> rollupOptions 수정
npm install glob

# react html
npm create vite@latest react -- --template react
cd react
npm install

# react 패키지
npm install react-router-dom
npm install @tanstack/react-query
npm install bootstrap bootstrap-icons

# vue html
npm create vite@latest vue -- --template vue
cd vue
npm install

# vue 패키지
npm install vue-router@4 pinia
npm install @tanstack/vue-query
npm install bootstrap bootstrap-icons

# vue vite.config.js 수정 -> resolve

# .env.development
# VITE_API_URL=http://localhost:8080

# 실행
npm run dev
npm run build
npm run preview