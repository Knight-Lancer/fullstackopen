import { defineConfig, devices } from '@playwright/test'
export default defineConfig({ testDir: './tests', timeout: 15000, expect: { timeout: 6000 }, fullyParallel: false, workers: 1, reporter: 'list', use: { baseURL: 'http://127.0.0.1:5173', trace: 'retain-on-failure' }, projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }] })
