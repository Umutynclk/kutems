const { chromium } = require('playwright');

async function checkCounts() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0'
  });
  try {
    for (const sec of ['automation', 'hardware']) {
      await page.goto(`https://shop.flexiforce.com/en/${sec}.html`, { waitUntil: 'domcontentloaded' });
      const toolbarAmount = await page.$eval('.toolbar-amount', el => el.innerText.trim()).catch(() => 'unknown');
      const pages = await page.$$eval('.pages .item', els => els.map(e => e.innerText.trim().replace(/\s+/g, ' ')));
      console.log(`=== ${sec.toUpperCase()} ===`);
      console.log('Toolbar count text:', toolbarAmount);
      console.log('Pages list:', pages);
    }
  } finally {
    await browser.close();
  }
}
checkCounts();

