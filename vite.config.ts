import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    env: {
      // apiClient reads this via src/config/env.ts at import time and throws if
      // unset - this keeps tests independent of whether a developer has created
      // their own .env.local from .env.example. Not a real network call target;
      // apiClient calls are mocked at the fetch level in tests.
      VITE_API_BASE_URL: 'http://localhost:3001',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/components/ui/**', 'src/main.tsx', 'src/vite-env.d.ts'],
    },
  },
})
