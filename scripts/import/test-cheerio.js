const cheerio = require('cheerio');

async function testCheerio() {
  const url = 'https://shop.flexiforce.com/en/operator-kit-door-up-to-28m2-frequenz400-100.html';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  const $ = cheerio.load(html);

  const sku = $('.product.attribute.sku .value, [itemprop="sku"]').text().trim();
  const title = $('h1.page-title span, [itemprop="name"]').text().trim();
  const shortDesc = $('.product.attribute.overview .value').text().trim();
  const desc = $('#description .value').text().trim();
  const breadcrumbs = $('.breadcrumbs .item').map((i, el) => $(el).text().trim()).get();
  const specs = $('#product-attribute-specs-table tr').map((i, tr) => ({
    key: $(tr).find('th').text().trim(),
    val: $(tr).find('td').text().trim()
  })).get();

  console.log('Cheerio extracted:', { sku, title, shortDesc, descLength: desc.length, breadcrumbs, specsCount: specs.length });
  console.log('Specs sample:', specs.slice(0, 3));
}
testCheerio();

