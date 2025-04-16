import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8', // ou 'istanbul'
      enabled: true, // ativa a cobertura
      reporter: ['text', 'json', 'html'], // formatos de saída
      reportsDirectory: './coverage', // pasta de relatórios
      include: ['src/**/*.{ts,tsx}'], // arquivos a incluir
      exclude: [ // arquivos a excluir
        '**/node_modules/**',
        '**/test/**',
        '**/*.d.ts',
        '**/*.stories.tsx', // exclui arquivos de stories
        '**/index.ts' // arquivos apenas de exportação
      ],
      thresholds: { // limites mínimos
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})