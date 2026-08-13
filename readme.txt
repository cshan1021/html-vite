# html vite 프로젝트
git init -b main
git remote add origin https://github.com/cshan1021/html-vite
git pull origin main

# vanilla html
npx create-vite@latest vanilla --template vanilla
cd vanilla
npm install
npm run dev

# nunjucks 설정
npm install -D vite-plugin-nunjucks

//vite.config.js
import { defineConfig } from 'vite'
import nunjucks from 'vite-plugin-nunjucks'

export default defineConfig({
  plugins: [
    nunjucks({
      templatesDir: 'src'
    })
  ]
})