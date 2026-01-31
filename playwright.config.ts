import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Increase test timeout to 60 seconds */
  timeout: 60000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }], // 禁用自动打开报告
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    headless: true,
    launchOptions: {
      slowMo: 50,
    },
  },
  

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...{ channel: 'chrome' } },
    },
  ],

  /* 不自动启动web服务器，因为我们已经手动启动了 */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://127.0.0.1:3001',
  //   reuseExistingServer: true,
  // },
});
