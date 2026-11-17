const { chromium } = require('playwright');

async function testDetail() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  try {
    const url = 'https://shop.flexiforce.com/en/operator-kit-door-up-to-28m2-frequenz400-100.html';
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const data = await page.evaluate(() => {
      const sku = document.querySelector('.product.attribute.sku .value, [itemprop="sku"]')?.innerText?.trim() || '';
      const title = document.querySelector('h1.page-title span, [itemprop="name"]')?.innerText?.trim() || '';
      const shortDesc = document.querySelector('.product.attribute.overview .value')?.innerText?.trim() || '';
      const desc = document.querySelector('#description .value')?.innerText?.trim() || '';
      const breadcrumbs = Array.from(document.querySelectorAll('.breadcrumbs .item')).map(e => e.innerText.trim());
      const specs = Array.from(document.querySelectorAll('#product-attribute-specs-table tr')).map(tr => ({
        key: tr.querySelector('th')?.innerText?.trim(),
        val: tr.querySelector('td')?.innerText?.trim()
      }));
      const docs = Array.from(document.querySelectorAll('a[href$=".pdf"], a[href*="pdf"]')).map(a => ({
        name: a.innerText.trim(),
        href: a.href
      }));
      return { sku, title, shortDesc, desc, breadcrumbs, specs, docs };
    });
    console.log('Product detail extracted:\n', JSON.stringify(data, null, 2));
  } finally {
    await browser.close();
  }
}
testDetail();

