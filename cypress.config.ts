import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',  // ✅ Era 3000 → AHORA ES 3001
  },
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 30000,
})