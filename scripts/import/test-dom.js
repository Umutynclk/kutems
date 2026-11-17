const { chromium } = require('playwright');

async function testDom() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  try {
    await page.goto('https://shop.flexiforce.com/en/automation.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const itemHtml = await page.$eval('.product-item', el => el.outerHTML);
    console.log('Sample product-item HTML:\n', itemHtml.substring(0, 1500));
  } finally {
    await browser.close();
  }
}
testDom();

