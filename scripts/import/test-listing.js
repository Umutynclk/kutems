const { chromium } = require('playwright');

async function testListing() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0'
  });
  try {
    await page.goto('https://shop.flexiforce.com/en/automation.html', { waitUntil: 'domcontentloaded' });
    const items = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.product-item')).map(item => {
        const link = item.querySelector('a.product-item-photo, a.product-item-link')?.href || '';
        const name = item.querySelector('.product-item-name, .product-item-link')?.innerText?.trim() || '';
        const img = item.querySelector('img.product-image-photo')?.src || '';
        return { link, name, img };
      });
    });
    console.log(`Extracted ${items.length} items from listing page 1`);
    console.log('Sample item:', items[0]);
  } finally {
    await browser.close();
  }
}
testListing();

