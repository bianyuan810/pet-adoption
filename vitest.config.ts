import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    include: ['__tests__/**/*.test.ts', '__tests__/**/*.test.tsx', '__tests__/**/*.spec.ts', '__tests__/**/*.spec.tsx'],
    exclude: ['__tests__/e2e/**/*.spec.ts', 'node_modules'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*.ts', 'services/**/*.ts'],
      exclude: ['node_modules', '__tests__', 'lib/supabase.ts', 'lib/test-db.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})