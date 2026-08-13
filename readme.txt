# html vite 프로젝트
git init -b main
git remote add origin https://github.com/cshan1021/html-vite
git pull origin main

# vanilla html
npx create-vite@latest vanilla --template vanilla
cd vanilla
npm install
npm run dev

# vite-plugin-nunjucks 설정 - html template 용도
npm install -D vite-plugin-nunjucks

//vite.config.js
import { defineConfig } from 'vite'
import nunjucks from 'vite-plugin-nunjucks'

export default defineConfig({
  root: 'src',
  plugins: [
    nunjucks()
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})

# glob 패키지 설치 - vite.config.js -> build -> rollupOptions 용도
# Rollup input 객체 자동 생성
npm install -D glob