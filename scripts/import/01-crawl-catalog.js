#!/usr/bin/env node
// scripts/import/01-crawl-catalog.js
// Phase 1 & 2: Discover all categories and collect all 1,442 product URLs from FlexiForce

const { chromium } = require('playwright');
const cfg = require('./config');
const { sleep, ensureDir, writeJSON, log } = require('./utils');
const path = require('path');

ensureDir(cfg.RAW_DIR);
ensureDir(cfg.REPORTS_DIR);

const SECTIONS = [
  { type: 'automation', url: 'https://shop.flexiforce.com/en/automation.html', totalExpected: 94 },
  { type: 'hardware',   url: 'https://shop.flexiforce.com/en/hardware.html',   totalExpected: 1348 },
];

async function crawlSection(page, section) {
  log('INFO', `Starting crawl for ${section.type} (${section.url})`);
  const products = [];
  const seenUrls = new Set();
  let pageNum = 1;
  let totalItemsExpected = section.totalExpected;

  while (true) {
    const pageUrl = `${section.url}?p=${pageNum}`;
    log('INFO', `[${section.type}] Crawling page ${pageNum}: ${pageUrl}`);

    let retries = 2;
    let loaded = false;
    while (retries >= 0 && !loaded) {
      try {
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
        loaded = true;
      } catch (e) {
        retries--;
        log('WARN', `Retry page ${pageNum} error: ${e.message}`);
        await sleep(2000);
      }
    }

    if (!loaded) {
      log('ERROR', `Could not load page ${pageNum}, skipping`);
      break;
    }

    // Parse items on current page
    const pageItems = await page.evaluate((sType) => {
      const items = Array.from(document.querySelectorAll('.product-item'));
      return items.map(item => {
        const linkEl = item.querySelector('a.product-item-photo, a.product-item-link');
        const href = linkEl?.href || '';
        const name = item.querySelector('.product-item-name, .product-item-link')?.innerText?.trim() || '';
        const img = item.querySelector('img.product-image-photo')?.src || '';
        return {
          url: href,
          name,
          img,
          type: sType
        };
      }).filter(i => i.url);
    }, section.type);

    if (pageItems.length === 0) {
      log('INFO', `No more products found on page ${pageNum}. Finished section.`);
      break;
    }

    let addedThisPage = 0;
    for (const item of pageItems) {
      if (!seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        products.push(item);
        addedThisPage++;
      }
    }

    log('INFO', `[${section.type}] Page ${pageNum}: found ${pageItems.length} items (${addedThisPage} new). Total so far: ${products.length}/${totalItemsExpected}`);

    // Check if next button exists
    const hasNext = await page.evaluate(() => {
      const nextBtn = document.querySelector('.pages .action.next, .pages a.next');
      return !!nextBtn;
    });

    if (!hasNext) {
      log('INFO', `[${section.type}] Reached last page (page ${pageNum})`);
      break;
    }

    pageNum++;
    await sleep(cfg.REQUEST_DELAY);
  }

  return products;
}

async function extractCategories(page) {
  log('INFO', 'Extracting category tree...');
  const categories = [];
  const seenCatSlugs = new Set();

  for (const sec of SECTIONS) {
    try {
      await page.goto(sec.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
      const sidebarCats = await page.evaluate((sType) => {
        const links = Array.from(document.querySelectorAll('.sidebar .filter-options-item a, .sidebar .items a, .layered-nav a'));
        return links.map(a => ({
          name: a.innerText.replace(/\(\d+\)/g, '').trim(),
          url: a.href,
          type: sType
        })).filter(c => c.name && c.url.includes('/en/'));
      }, sec.type);

      for (const cat of sidebarCats) {
        if (!seenCatSlugs.has(cat.url)) {
          seenCatSlugs.add(cat.url);
          categories.push(cat);
        }
      }
    } catch (e) {
      log('WARN', `Category tree extraction error for ${sec.type}: ${e.message}`);
    }
  }

  return categories;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
  });

  const allProducts = [];

  for (const section of SECTIONS) {
    const sectionProducts = await crawlSection(page, section);
    allProducts.push(...sectionProducts);
  }

  const categories = await extractCategories(page);

  await browser.close();

  // Save outputs
  writeJSON(path.join(cfg.RAW_DIR, 'product_urls.json'), allProducts);
  writeJSON(path.join(cfg.RAW_DIR, 'categories_all.json'), categories);

  const autoCount = allProducts.filter(p => p.type === 'automation').length;
  const hardCount = allProducts.filter(p => p.type === 'hardware').length;

  const summary = {
    total: allProducts.length,
    automation: autoCount,
    hardware: hardCount,
    categories: categories.length,
    completedAt: new Date().toISOString()
  };

  writeJSON(path.join(cfg.REPORTS_DIR, 'crawl_summary.json'), summary);

  log('INFO', '=== CRAWL COMPLETE ===');
  log('INFO', `Automation: ${autoCount} / 94 expected`);
  log('INFO', `Hardware:   ${hardCount} / 1348 expected`);
  log('INFO', `Total:      ${allProducts.length} / 1442 expected`);
}

main().catch(err => {
  log('ERROR', 'Fatal in crawl:', err);
  process.exit(1);
});
