import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './test-results.xml',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'cobertura'],
      reportsDirectory: './coverage',
    },
  },
})
