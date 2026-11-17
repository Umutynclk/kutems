#!/usr/bin/env node
// scripts/import/03-normalize.js
// Phase 6: Normalize raw product data into the KUTEMS Product model (English only for now)

const cfg = require('./config');
const { readJSON, writeJSON, readJSONL, slugify, log } = require('./utils');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeSlug(name, articleNumber) {
  const base = slugify(name || articleNumber || '');
  const hash = crypto.createHash('md5').update(articleNumber || base).digest('hex').substring(0, 6);
  return `${base}-${hash}`;
}

function getHierarchy(raw) {
  const bc = raw.breadcrumbs || [];
  let mainCat = '';
  let subCat = '';

  if (bc.length >= 4) {
    mainCat = bc[1];
    subCat = bc[2];
  } else if (bc.length === 3) {
    mainCat = bc[1];
    subCat = '';
  } else if (bc.length === 2) {
    mainCat = bc[1];
    subCat = '';
  } else {
    mainCat = raw.type === 'automation' ? 'Automation' : 'Hardware';
    subCat = '';
  }

  return { mainCat, subCat };
}

function buildCategoryMap(productData) {
  const categoryMap = new Map();
  const subCategoryMap = new Map();

  for (const p of productData) {
    const { mainCat, subCat } = getHierarchy(p);
    const mainSlug = slugify(mainCat || p.type);

    if (!categoryMap.has(mainSlug)) {
      categoryMap.set(mainSlug, {
        id: mainSlug,
        slug: mainSlug,
        name: { en: mainCat, tr: mainCat },
        description: { en: '', tr: '' },
        type: p.type,
        productCount: 0,
        subcategories: new Set()
      });
    }
    categoryMap.get(mainSlug).productCount++;

    if (subCat) {
      const subSlug = slugify(subCat);
      categoryMap.get(mainSlug).subcategories.add(subCat);
      if (!subCategoryMap.has(subSlug)) {
        subCategoryMap.set(subSlug, {
          id: subSlug,
          categoryId: mainSlug,
          slug: subSlug,
          name: { en: subCat, tr: subCat },
          productCount: 0
        });
      }
      subCategoryMap.get(subSlug).productCount++;
    }
  }

  let order = 1;
  const categoriesList = [];
  for (const cat of categoryMap.values()) {
    categoriesList.push({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      type: cat.type,
      order: order++,
      productCount: cat.productCount,
      subcategories: Array.from(cat.subcategories).map(s => ({
        id: slugify(s),
        categoryId: cat.id,
        slug: slugify(s),
        name: { en: s, tr: s }
      }))
    });
  }

  return { categoryMap, categoriesList, subCategoryMap };
}

function normalizeProduct(raw, categoryMap, existingSlugs) {
  const article = (raw.articleNumber || '').trim();
  if (!article) return null;

  const name = raw.name || article;
  let slug = makeSlug(name, article);
  let attempt = 0;
  while (existingSlugs.has(slug) && attempt < 10) {
    attempt++;
    slug = `${makeSlug(name, article)}-${attempt}`;
  }
  existingSlugs.add(slug);

  const { mainCat, subCat } = getHierarchy(raw);
  const mainSlug = slugify(mainCat || raw.type);
  const subSlug = subCat ? slugify(subCat) : undefined;

  // Build specifications array
  const specs = (raw.specifications || []).map(s => ({
    key: { en: s.key, tr: s.key },
    value: { en: s.val, tr: s.val },
  }));

  // Clean description
  const descText = raw.description || cleanHtml(raw.descriptionHtml || '');
  const shortDesc = raw.shortDescription || (descText.substring(0, 180).trim()) || '';

  // Images
  const images = (raw.images || []).filter(Boolean);

  // Downloads
  const downloads = (raw.downloads || []).map(d => ({
    title: { en: d.name || 'Document', tr: d.name || 'Document' },
    type: 'pdf',
    url: d.href || '',
    fileSize: '',
  }));

  const now = new Date().toISOString();

  return {
    id: `kut-${article}`,
    type: raw.type,
    articleNumber: article,
    productCode: article,
    categoryId: mainSlug,
    subcategoryId: subSlug,
    slug,

    name: { en: name, tr: name },
    shortDescription: { en: shortDesc, tr: shortDesc },
    description: { en: descText, tr: descText },
    features: { en: raw.features || [], tr: raw.features || [] },

    images,
    sourceImageUrls: images,

    specifications: specs,
    downloads,

    sourceUrl: raw.sourceUrl,
    breadcrumbs: raw.breadcrumbs || [],
    mainCategory: mainCat,
    subCategory: subCat,

    active: true,
    featured: false,
    importedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

async function main() {
  const rawFile = path.join(cfg.RAW_DIR, 'products_raw.jsonl');
  if (!fs.existsSync(rawFile)) {
    log('ERROR', 'No raw data file found. Run 02-extract-products.js first.');
    process.exit(1);
  }

  const rawProducts = readJSONL(rawFile);
  log('INFO', `Loaded ${rawProducts.length} raw products`);

  // Deduplicate by articleNumber
  const byArticle = new Map();
  for (const p of rawProducts) {
    const article = (p.articleNumber || '').trim();
    if (!article) continue;
    if (!byArticle.has(article)) {
      byArticle.set(article, p);
    } else {
      const existing = byArticle.get(article);
      if ((p.specifications?.length || 0) > (existing.specifications?.length || 0)) {
        byArticle.set(article, { ...existing, ...p });
      }
    }
  }

  const productData = Array.from(byArticle.values());
  log('INFO', `Unique products after dedup: ${productData.length}`);

  const { categoryMap, categoriesList } = buildCategoryMap(productData);
  log('INFO', `Built ${categoriesList.length} categories`);

  const existingSlugs = new Set();
  const normalizedProducts = [];

  for (const raw of productData) {
    const norm = normalizeProduct(raw, categoryMap, existingSlugs);
    if (norm) {
      normalizedProducts.push(norm);
    }
  }

  log('INFO', `Normalized products: ${normalizedProducts.length}`);

  // Write normalized JSON files
  writeJSON(path.join(cfg.READY_DIR, 'products_normalized.json'), normalizedProducts);
  writeJSON(path.join(cfg.READY_DIR, 'categories_normalized.json'), categoriesList);

  // Write manifest for images
  const imageManifest = [];
  for (const p of normalizedProducts) {
    for (let i = 0; i < p.images.length; i++) {
      imageManifest.push({
        articleNumber: p.articleNumber,
        imageIndex: i,
        sourceUrl: p.images[i],
        storagePath: `products/${p.articleNumber}/images/${path.basename(p.images[i])}`,
        downloaded: false
      });
    }
  }
  writeJSON(path.join(cfg.READY_DIR, 'image_manifest.json'), imageManifest);

  // Copy to src/lib/data/ for direct zero-latency app usage!
  const appDataDir = path.join(__dirname, '../../src/lib/data');
  writeJSON(path.join(appDataDir, 'importedProducts.json'), normalizedProducts);
  writeJSON(path.join(appDataDir, 'importedCategories.json'), categoriesList);
  log('INFO', `Copied normalized data to ${appDataDir}/importedProducts.json and importedCategories.json`);

  const summary = {
    totalNormalized: normalizedProducts.length,
    automation: normalizedProducts.filter(p => p.type === 'automation').length,
    hardware: normalizedProducts.filter(p => p.type === 'hardware').length,
    totalCategories: categoriesList.length,
    totalImages: imageManifest.length,
    completedAt: new Date().toISOString()
  };

  writeJSON(path.join(cfg.REPORTS_DIR, 'normalize_summary.json'), summary);
  log('INFO', '=== NORMALIZE COMPLETE ===');
  log('INFO', JSON.stringify(summary, null, 2));
}

main().catch(err => {
  log('ERROR', 'Fatal in normalize:', err);
  process.exit(1);
});
