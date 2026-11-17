const cheerio = require('cheerio');

async function testCheerioMedia() {
  const url = 'https://shop.flexiforce.com/en/operator-kit-door-up-to-28m2-frequenz400-100.html';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const $ = cheerio.load(html);

  // Look for gallery JSON script tag
  let gallery = [];
  $('script[type="text/x-magento-init"]').each((i, el) => {
    try {
      const data = JSON.parse($(el).html());
      const g = data?.['[data-gallery-role=gallery-placeholder]']?.['mage/gallery/gallery']?.data;
      if (g) gallery = g;
    } catch(e) {}
  });

  // Images fallback
  const fallbackImgs = $('img').map((i, el) => $(el).attr('src')).get().filter(s => s && s.includes('/catalog/product/'));

  // Docs
  const docs = $('a[href$=".pdf"]').map((i, el) => ({ name: $(el).text().trim(), href: $(el).attr('href') })).get();

  console.log('Gallery JSON images count:', gallery.length);
  if (gallery.length > 0) {
    console.log('Gallery image sample:', gallery[0].full || gallery[0].img);
  }
  console.log('Fallback images:', fallbackImgs);
  console.log('PDF documents:', docs);
}
testCheerioMedia();

