#!/usr/bin/env node
// scripts/import/07-audit-dataset.js
// Audit the complete normalized and raw datasets

const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { readJSON, readJSONL, log, writeJSON } = require('./utils');

const products = readJSON(path.join(cfg.READY_DIR, 'products_normalized.json')) || [];
const categories = readJSON(path.join(cfg.READY_DIR, 'categories_normalized.json')) || [];
const images = readJSON(path.join(cfg.READY_DIR, 'image_manifest.json')) || [];
const rawProducts = readJSONL(path.join(cfg.RAW_DIR, 'products_raw.jsonl')) || [];

console.log('=== AUDIT REPORT ===');
console.log('Total Raw Products extracted:', rawProducts.length);
console.log('Total Normalized Products:', products.length);

// 1. Article Numbers
const articleMap = new Map();
const duplicates = [];
let missingArticles = 0;

for (const p of products) {
  const art = p.articleNumber;
  if (!art) missingArticles++;
  else {
    if (articleMap.has(art)) duplicates.push({ articleNumber: art, id1: articleMap.get(art).id, id2: p.id });
    else articleMap.set(art, p);
  }
}

console.log('Unique Article Numbers:', articleMap.size);
console.log('Missing Article Numbers:', missingArticles);
console.log('Duplicate Article Numbers:', duplicates.length);

// 2. Section counts
const auto = products.filter(p => p.type === 'automation');
const hard = products.filter(p => p.type === 'hardware');
console.log('Automation Products:', auto.length);
console.log('Hardware Products:', hard.length);

// 3. Category & Subcategory breakdown
console.log('\n--- Categories Breakdown (Total:', categories.length, ') ---');
for (const cat of categories) {
  console.log(`- [${cat.type.toUpperCase()}] ${cat.name.en} (slug: ${cat.slug}) -> ${cat.productCount} products, subcats: ${cat.subcategories.length}`);
}

// 4. Content completeness
let missingEnName = 0;
let missingEnDesc = 0;
let missingTrName = 0;
let missingTrDesc = 0;
let productsWithSpecs = 0;
let totalSpecsCount = 0;
let productsWithDownloads = 0;
let totalDownloadsCount = 0;
let productsWithoutImages = 0;

for (const p of products) {
  if (!p.name?.en) missingEnName++;
  if (!p.description?.en) missingEnDesc++;
  if (!p.name?.tr || p.name.tr === p.name.en) missingTrName++;
  if (!p.description?.tr || p.description.tr === p.description.en) missingTrDesc++;
  if (p.specifications && p.specifications.length > 0) {
    productsWithSpecs++;
    totalSpecsCount += p.specifications.length;
  }
  if (p.downloads && p.downloads.length > 0) {
    productsWithDownloads++;
    totalDownloadsCount += p.downloads.length;
  }
  if (!p.images || p.images.length === 0) productsWithoutImages++;
}

console.log('\n--- Content Completeness ---');
console.log('Missing English Names:', missingEnName);
console.log('Missing English Descriptions:', missingEnDesc);
console.log('Products needing TR translation:', missingTrName);
console.log('Products with Specs:', productsWithSpecs, `(Total specs: ${totalSpecsCount}, avg: ${(totalSpecsCount / products.length).toFixed(1)}/product)`);
console.log('Products with Downloads/PDFs:', productsWithDownloads, `(Total downloads: ${totalDownloadsCount})`);
console.log('Products without Images:', productsWithoutImages);
console.log('Total Manifest Images:', images.length);

const auditData = {
  rawCount: rawProducts.length,
  normalizedCount: products.length,
  uniqueArticles: articleMap.size,
  duplicateArticles: duplicates.length,
  automationCount: auto.length,
  hardwareCount: hard.length,
  categoryCount: categories.length,
  totalManifestImages: images.length,
  productsWithSpecs,
  totalSpecsCount,
  productsWithDownloads,
  totalDownloadsCount,
  missingEnName,
  missingEnDesc,
  missingTrName,
  missingTrDesc,
  productsWithoutImages,
  timestamp: new Date().toISOString()
};

writeJSON(path.join(cfg.REPORTS_DIR, 'dataset_audit.json'), auditData);
