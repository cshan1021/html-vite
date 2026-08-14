# html vite 프로젝트
git init -b main
git remote add origin https://github.com/cshan1021/html-vite
git pull origin main

# vanilla html
# npx create-vite@latest vanilla --template vanilla
cd vanilla
npm install

# vite-plugin-nunjucks 설정 - html template 용도
# vite.config.js -> export -> plugins 수정
npm install -D vite-plugin-nunjucks

# glob 패키지 설치 - Rollup input 객체 자동 생성
# vite.config.js -> build -> rollupOptions 수정
npm install -D glob

# .env.development
# VITE_API_URL=http://localhost

# 실행
npm run dev
npm run build
npm run preview