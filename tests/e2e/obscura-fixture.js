const { test: base, expect, chromium } = require('@playwright/test');

// Override the default "browser" fixture to connect to Obscura (if configured)
const test = base.extend({
  browser: async ({}, use) => {
    // Check if we are instructed to use a remote browser via CDP
    const wsEndpoint = process.env.OBSCURA_WS_ENDPOINT;
    
    let browser;
    if (wsEndpoint) {
      console.log(`Connecting to remote Obscura via CDP at ${wsEndpoint}`);
      // Use the pattern from Obscura docs for CDP connection
      browser = await chromium.connectOverCDP(wsEndpoint);
    } else {
      console.log('Using local Chromium browser');
      browser = await chromium.launch();
    }
    
    await use(browser);
    await browser.close();
  },
  
  // Also ensure page uses the correct context creation for Obscura if needed
  page: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await context.close();
  }
});

module.exports = { test, expect };