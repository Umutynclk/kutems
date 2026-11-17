const { chromium } = require('playwright');

async function testScrape() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  console.log('Navigating to automation page...');
  try {
    const res = await page.goto('https://shop.flexiforce.com/en/automation.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Status code:', res.status());
    console.log('Page title:', await page.title());
    const items = await page.$$('.product-item, .item.product');
    console.log('Product items found on page 1:', items.length);
    const links = await page.$$eval('a.product-item-link', els => els.map(e => ({ name: e.innerText.trim(), href: e.href })));
    console.log('Found product links:', links.slice(0, 5));
    const pagination = await page.$$eval('.pages .item', els => els.map(e => e.innerText.trim()));
    console.log('Pagination items:', pagination);
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
}
testScrape();

