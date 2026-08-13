import { defineConfig } from 'vite'
import nunjucks from 'vite-plugin-nunjucks'
import { resolve } from 'node:path'

export default defineConfig({
  root: 'src',
  plugins: [
    nunjucks()
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'src/index.html'),
        boardList: resolve(import.meta.dirname, 'src/board/list.html'),
        boardDetail: resolve(import.meta.dirname, 'src/board/detail.html'),
        chat: resolve(import.meta.dirname, 'src/chat/chat.html')
      }
    }
  }
})
