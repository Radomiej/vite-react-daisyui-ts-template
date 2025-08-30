/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.e2e.test.{js,ts,jsx,tsx}', // Exclude Playwright E2E tests
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.d.ts',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.e2e.test.{js,ts,jsx,tsx}',
        '**/*.stories.{js,ts,jsx,tsx}',
        '**/test/**',
        '**/__tests__/**',
      ],
      include: [
        'src/**/*.{js,ts,jsx,tsx}'
      ],
      all: true,
      thresholds: {
        lines: 60,
        functions: 40,
        branches: 65,
        statements: 60
      }
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
