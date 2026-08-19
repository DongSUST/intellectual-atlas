import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // relative asset paths so the build works at any subpath (GitHub Pages) and locally
  base: './',
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    watch: { ignored: ['**/tools/**', '**/.tmp-*/**', '**/*.png'] },
  },
})
