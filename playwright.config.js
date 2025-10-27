// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';



 // Based on the environment you want the tests to be triggered, 
 // read environment variables from the corresponding .env file.
 

 switch(process.env.NODE_ENV) {
  case 'dev':
    dotenv.config({ path: `./tests/environments/dev.env` });
    break;
  case 'qa':
    dotenv.config({ path: `./tests/environments/qa.env` });
    break;
  case 'uat':
    dotenv.config({ path: `./tests/environments/uat.env` });
    break;
  case 'prod':
    dotenv.config({ path: `./tests/environments/prod.env` });
    break;
  default:
    dotenv.config({ path: `./tests/environments/dev.env` });
  }


export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  // Available Reports
  reporter: [["html", { open: "always"}], ["json", {  outputFile: "test-results/jsonReport.json" }]],
  use: {
    screenshot: "on",
    headless: false,
    extraHTTPHeaders: {
      'api-key': process.env.API_KEY || '',
   },

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
  },
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /*{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }, */

  ],

});

