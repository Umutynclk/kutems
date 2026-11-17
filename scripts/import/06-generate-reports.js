#!/usr/bin/env node
// scripts/import/06-generate-reports.js
// Phase 10: Generate final migration summary, CSVs, and audit reports

const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { writeJSON, readJSON, readJSONL, log } = require('./utils');

function toCsv(rows) {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    const vals = headers.map(h => {
      let val = row[h];
      if (val === undefined || val === null) val = '';
      val = String(val).replace(/"/g, '""');
      if (val.includes(',') || val.includes('\n') || val.includes('"')) {
        val = `"${val}"`;
      }
      return val;
    });
    lines.push(vals.join(','));
  }
  return lines.join('\n');
}

async function main() {
  const normFile = path.join(cfg.READY_DIR, 'products_normalized.json');
  const catFile = path.join(cfg.READY_DIR, 'categories_normalized.json');
  const imgFile = path.join(cfg.READY_DIR, 'image_manifest.json');
  const failFile = path.join(cfg.FAILURES_DIR, 'extract_failures.jsonl');

  const products = readJSON(normFile) || [];
  const categories = readJSON(catFile) || [];
  const images = readJSON(imgFile) || [];
  const failures = readJSONL(failFile) || [];

  const autoCount = products.filter(p => p.type === 'automation').length;
  const hardCount = products.filter(p => p.type === 'hardware').length;

  // Migration summary
  const summary = {
    totalSourceProductsDiscovered: 1442,
    totalNormalizedProducts: products.length,
    automationProducts: autoCount,
    hardwareProducts: hardCount,
    expectedReconciliation: {
      automationTarget: 94,
      automationActual: autoCount,
      hardwareTarget: 1348,
      hardwareActual: hardCount,
      totalTarget: 1442,
      totalActual: products.length,
      match: autoCount === 94 && hardCount === 1348 && products.length === 1442
    },
    totalCategories: categories.length,
    totalImagesCataloged: images.length,
    failedExtractions: failures.length,
    targetFirebaseProject: cfg.FIREBASE_PROJECT_ID,
    generatedAt: new Date().toISOString()
  };

  writeJSON(path.join(cfg.REPORTS_DIR, 'migration-summary.json'), summary);

  // CSV: migration summary
  const summaryRows = [
    { metric: 'Total Products Discovered', value: 1442 },
    { metric: 'Automation Products', value: autoCount },
    { metric: 'Hardware Products', value: hardCount },
    { metric: 'Total Normalized Products', value: products.length },
    { metric: 'Total Categories Built', value: categories.length },
    { metric: 'Total Product Images Cataloged', value: images.length },
    { metric: 'Extraction Failures', value: failures.length }
  ];
  fs.writeFileSync(path.join(cfg.REPORTS_DIR, 'migration-summary.csv'), toCsv(summaryRows), 'utf8');

  // CSV: failed products
  fs.writeFileSync(path.join(cfg.REPORTS_DIR, 'failed-products.csv'), toCsv(failures), 'utf8');

  // CSV: sample products audit
  const auditRows = products.map(p => ({
    articleNumber: p.articleNumber,
    name: p.name.en,
    type: p.type,
    mainCategory: p.mainCategory,
    subCategory: p.subCategory,
    specsCount: p.specifications.length,
    imagesCount: p.images.length,
    sourceUrl: p.sourceUrl
  }));
  fs.writeFileSync(path.join(cfg.REPORTS_DIR, 'products-audit.csv'), toCsv(auditRows), 'utf8');

  log('INFO', '=== FINAL AUDIT & REPORTS GENERATED ===');
  log('INFO', JSON.stringify(summary, null, 2));
}

main().catch(err => {
  log('ERROR', 'Error generating reports:', err);
  process.exit(1);
});

