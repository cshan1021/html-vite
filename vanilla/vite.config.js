import { defineConfig } from 'vite'
import nunjucks from 'vite-plugin-nunjucks'
import { resolve } from 'node:path'
import { globSync } from 'glob'

const htmlEntries = Object.fromEntries(
  globSync('**/*.html', {
    cwd: resolve(import.meta.dirname, 'src'),
    absolute: true
  }).map((file) => {
    const relativePath = file
      .replace(resolve(import.meta.dirname, 'src'), '')
      .replace(/\\/g, '/')
      .replace(/\.html$/, '')

    const key = relativePath === '' ? 'index' : relativePath.replace(/^\//, '').replace(/\//g, '-')

    return [key, file]
  })
)

export default defineConfig({
  root: 'src',
  envDir: import.meta.dirname,
  plugins: [
    nunjucks()
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: htmlEntries
    }
  }
})
