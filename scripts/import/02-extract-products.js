#!/usr/bin/env node
// scripts/import/02-extract-products.js
// Phase 3: Fast concurrent product detail extraction using cheerio + fetch

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const cfg = require('./config');
const { sleep, ensureDir, readJSON, writeJSON, appendJSONL, readJSONL, log } = require('./utils');

ensureDir(cfg.RAW_DIR);
ensureDir(cfg.FAILURES_DIR);

const CONCURRENCY = 6;

async function asyncPool(concurrency, items, fn) {
  const ret = [];
  const executing = new Set();
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    ret.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}

function cleanText(str) {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

function cleanImageUrl(url) {
  if (!url) return '';
  return url.split('?')[0];
}

async function fetchProduct(meta, attempt = 1) {
  try {
    const res = await fetch(meta.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(25000)
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Article number
    let sku = cleanText($('.product.attribute.sku .value, [itemprop="sku"]').text());
    if (!sku) {
      const match = meta.url.match(/\/([^\/]+)\.html$/);
      sku = match ? match[1] : '';
    }

    // Name
    const name = cleanText($('h1.page-title span, [itemprop="name"]').text()) || meta.name;

    // Short description
    const shortDesc = cleanText($('.product.attribute.overview .value').text());

    // Description
    const desc = cleanText($('#description .value').text());
    const descHtml = $('#description .value').html()?.trim() || '';

    // Breadcrumbs
    const breadcrumbs = $('.breadcrumbs .item').map((i, el) => cleanText($(el).text())).get().filter(b => b && b !== 'Home');

    // Category hierarchy
    let mainCategory = meta.type === 'automation' ? 'Automation' : 'Hardware';
    let subCategory = '';
    if (breadcrumbs.length >= 2) {
      mainCategory = breadcrumbs[breadcrumbs.length - 2];
      subCategory = breadcrumbs[breadcrumbs.length - 1];
    } else if (breadcrumbs.length === 1) {
      mainCategory = breadcrumbs[0];
    }

    // Specifications from table
    const specs = [];
    $('#product-attribute-specs-table tr, .additional-attributes tr').each((i, tr) => {
      const key = cleanText($(tr).find('th').text());
      const val = cleanText($(tr).find('td').text());
      if (key && val) {
        specs.push({ key, val });
      }
    });

    // Gallery images
    const images = [];
    const seenImgs = new Set();

    // From gallery JSON
    $('script[type="text/x-magento-init"]').each((i, el) => {
      try {
        const data = JSON.parse($(el).html());
        const gallery = data?.['[data-gallery-role=gallery-placeholder]']?.['mage/gallery/gallery']?.data;
        if (Array.isArray(gallery)) {
          for (const g of gallery) {
            const rawUrl = g.full || g.img || g.src;
            const cleaned = cleanImageUrl(rawUrl);
            if (cleaned && !cleaned.includes('placeholder') && !seenImgs.has(cleaned)) {
              seenImgs.add(cleaned);
              images.push(cleaned);
            }
          }
        }
      } catch (e) {}
    });

    // Fallback: listing image
    if (meta.img) {
      const cleaned = cleanImageUrl(meta.img);
      if (cleaned && !seenImgs.has(cleaned)) {
        seenImgs.add(cleaned);
        images.push(cleaned);
      }
    }

    // Features list if present
    const features = [];
    $('#features li, .product-features li, .overview-features li').each((i, el) => {
      const f = cleanText($(el).text());
      if (f) features.push(f);
    });

    // Documents
    const docs = [];
    $('a[href$=".pdf"]').each((i, el) => {
      const docHref = $(el).attr('href');
      const docName = cleanText($(el).text()) || path.basename(docHref || '');
      if (docHref && !docs.some(d => d.href === docHref)) {
        docs.push({ name: docName, href: docHref });
      }
    });

    return {
      articleNumber: sku,
      name,
      shortDescription: shortDesc,
      description: desc,
      descriptionHtml: descHtml,
      type: meta.type,
      sourceUrl: meta.url,
      mainCategory,
      subCategory,
      breadcrumbs,
      specifications: specs,
      features,
      images,
      downloads: docs,
      extractedAt: new Date().toISOString()
    };
  } catch (err) {
    if (attempt <= 2) {
      await sleep(1500 * attempt);
      return fetchProduct(meta, attempt + 1);
    }
    throw err;
  }
}

async function main() {
  const urlFile = path.join(cfg.RAW_DIR, 'product_urls.json');
  if (!fs.existsSync(urlFile)) {
    log('ERROR', 'product_urls.json not found. Run 01-crawl-catalog.js first.');
    process.exit(1);
  }

  const products = readJSON(urlFile);
  log('INFO', `Loaded ${products.length} product URLs to extract`);

  const rawOut = path.join(cfg.RAW_DIR, 'products_raw.jsonl');
  const failureOut = path.join(cfg.FAILURES_DIR, 'extract_failures.jsonl');
  const checkpointFile = path.join(cfg.DATA_DIR, 'checkpoint_extract.json');

  const checkpoint = readJSON(checkpointFile) || { doneUrls: [] };
  const doneSet = new Set(checkpoint.doneUrls);

  const remaining = products.filter(p => !doneSet.has(p.url));
  log('INFO', `Already done: ${doneSet.size}. Remaining: ${remaining.length}`);

  let successCount = doneSet.size;
  let failCount = 0;
  let countSinceSave = 0;

  await asyncPool(CONCURRENCY, remaining, async (meta) => {
    try {
      const data = await fetchProduct(meta);
      appendJSONL(rawOut, data);
      doneSet.add(meta.url);
      successCount++;
    } catch (err) {
      failCount++;
      appendJSONL(failureOut, { url: meta.url, type: meta.type, error: err.message });
      log('WARN', `Failed: ${meta.url} - ${err.message}`);
    }

    countSinceSave++;
    if (countSinceSave >= 25) {
      countSinceSave = 0;
      writeJSON(checkpointFile, { doneUrls: Array.from(doneSet) });
      log('INFO', `Progress: ${doneSet.size}/${products.length} (${((doneSet.size / products.length) * 100).toFixed(1)}%) | Failures: ${failCount}`);
    }
  });

  writeJSON(checkpointFile, { doneUrls: Array.from(doneSet) });

  const allRaw = readJSONL(rawOut);
  const summary = {
    totalExtracted: allRaw.length,
    automation: allRaw.filter(p => p.type === 'automation').length,
    hardware: allRaw.filter(p => p.type === 'hardware').length,
    failed: failCount,
    completedAt: new Date().toISOString()
  };

  writeJSON(path.join(cfg.REPORTS_DIR, 'extract_summary.json'), summary);
  log('INFO', '=== EXTRACTION COMPLETE ===');
  log('INFO', JSON.stringify(summary, null, 2));
}

main().catch(err => {
  log('ERROR', 'Fatal in extraction:', err);
  process.exit(1);
});
