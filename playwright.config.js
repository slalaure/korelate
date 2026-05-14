const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* The URL that the Obscura browser (in Docker) will use */
    baseURL: process.env.BASE_URL || 'http://localhost:8080', 

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/test-configuration */
    trace: 'on-first-retry',
    video: 'off',
    screenshot: 'off',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'obscura',
      use: { 
        /* En local, on utilise 127.0.0.1. Note: Obscura bloque 127.0.0.1 par sécurité (SSRF). 
           Pour tester localement avec Obscura, utilisez un tunnel ou votre IP publique. */
        baseURL: process.env.CI ? 'http://app:8080' : 'http://127.0.0.1:8080',
      },
    },
  ],

  /* Run your local dev server before starting the tests */
 /* webServer: {
    command: 'npm start',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120 * 1000,
  },*/
});