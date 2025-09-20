import { defineConfig, devices } from '@playwright/test';
import { TestExtend } from './resources/types';
require( 'dotenv' ).config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig < TestExtend > ( {
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [ 'html' ],
    [ 'list' ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    testIdAttribute: 'data-test',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup-saucedemo',
      testMatch: /_test\.setup\.ts/,
      use: {
        baseURL: process.env.BASE_URL_SAUCEDEMO,
      }
    },
    {
      name: 'saucedemo',
      dependencies: [ 'setup-saucedemo' ],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL_SAUCEDEMO,
        storageState: process.env.STORAGE_STATE_SAUCEDEMO,
      },
    },
    {
      name: 'restapi',
      // dependencies: [ 'setup' ],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL_RESTAPI,
        storageState: process.env.STORAGE_STATE_RESTAPI,
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
