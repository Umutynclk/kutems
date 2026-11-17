#!/usr/bin/env node
// scripts/import/04b-firestore-import-admin.js
// Phase 5: Import normalized products and categories into Firestore using Admin SDK + user OAuth token

const path = require('path');
const fs = require('fs');
const os = require('os');
const https = require('https');
const cfg = require('./config');
const { ensureDir, readJSON, writeJSON, log } = require('./utils');

const PROJECT_ID = 'kutems';
const BATCH_MAX = 500; // Firestore REST API batch limit

// Load access token from firebase-tools config
function getAccessToken() {
  const configPath = path.join(os.homedir(), '.config/configstore/firebase-tools.json');
  if (!fs.existsSync(configPath)) throw new Error('Firebase Tools config not found. Please run: npx firebase login');
  const conf = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!conf.tokens || !conf.tokens.access_token) throw new Error('No access token in firebase-tools config');
  const expiresAt = conf.tokens.expires_at;
  if (expiresAt && expiresAt < Date.now()) {
    log('WARN', 'Access token may be expired. If import fails, run: npx firebase login --reauth');
  }
  return conf.tokens.access_token;
}

// Firestore REST API batch write
function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Convert a plain JS value to Firestore REST API value format
function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function toFirestoreDoc(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    fields[k] = toFirestoreValue(v);
  }
  return { fields };
}

// Commit a batch using the Firestore batchWrite REST endpoint
async function commitBatch(writes, token) {
  const options = {
    hostname: 'firestore.googleapis.com',
    path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents:batchWrite`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  return httpsRequest(options, { writes });
}

// Chunk array into sub-arrays of size n
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function main() {
  log('INFO', '=== KUTEMS FIRESTORE IMPORT (REST API + OAuth) ===');

  // Validate project
  const token = getAccessToken();
  log('INFO', 'OAuth token loaded successfully.');

  const normProductsFile = path.join(cfg.READY_DIR, 'products_normalized.json');
  const normCategoriesFile = path.join(cfg.READY_DIR, 'categories_normalized.json');

  if (!fs.existsSync(normProductsFile) || !fs.existsSync(normCategoriesFile)) {
    log('ERROR', 'Normalized data files not found.');
    process.exit(1);
  }

  const products = readJSON(normProductsFile);
  const categories = readJSON(normCategoriesFile);
  log('INFO', `Loaded ${products.length} products and ${categories.length} categories.`);

  // Validate Article Numbers
  const articleNumbers = new Set();
  const duplicates = [];
  for (const p of products) {
    if (articleNumbers.has(p.articleNumber)) duplicates.push(p.articleNumber);
    articleNumbers.add(p.articleNumber);
  }
  if (duplicates.length > 0) {
    log('WARN', `Found ${duplicates.length} duplicate articleNumbers:`, duplicates.slice(0, 10));
  } else {
    log('INFO', 'All Article Numbers are unique.');
  }

  // Backup
  ensureDir(cfg.BACKUP_DIR);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFolder = path.join(cfg.BACKUP_DIR, `backup_${ts}`);
  ensureDir(backupFolder);
  writeJSON(path.join(backupFolder, 'products_to_import.json'), products);
  writeJSON(path.join(backupFolder, 'categories_to_import.json'), categories);
  log('INFO', `Backup snapshot saved to ${backupFolder}`);

  // --- Import Categories ---
  log('INFO', `Importing ${categories.length} categories...`);
  const catWrites = categories.map(cat => ({
    update: {
      name: `projects/${PROJECT_ID}/databases/(default)/documents/categories/${cat.id}`,
      ...toFirestoreDoc(cat)
    },
    updateMask: { fieldPaths: Object.keys(cat) }
  }));

  const catChunks = chunk(catWrites, BATCH_MAX);
  for (let i = 0; i < catChunks.length; i++) {
    await commitBatch(catChunks[i], token);
    log('INFO', `Categories batch ${i + 1}/${catChunks.length} committed.`);
  }
  log('INFO', `✓ ${categories.length} categories imported.`);

  // --- Import Products ---
  log('INFO', `Importing ${products.length} products in batches of ${BATCH_MAX}...`);
  const productChunks = chunk(products, BATCH_MAX);
  let totalCommitted = 0;

  const failed = [];
  for (let ci = 0; ci < productChunks.length; ci++) {
    const batch = productChunks[ci];
    const writes = batch.map(p => ({
      update: {
        name: `projects/${PROJECT_ID}/databases/(default)/documents/products/${p.id}`,
        ...toFirestoreDoc(p)
      },
      updateMask: { fieldPaths: Object.keys(p) }
    }));
    try {
      await commitBatch(writes, token);
      totalCommitted += batch.length;
      log('INFO', `Batch ${ci + 1}/${productChunks.length} committed — ${totalCommitted}/${products.length} products.`);
    } catch (err) {
      log('ERROR', `Batch ${ci + 1} failed: ${err.message}`);
      for (const p of batch) failed.push({ id: p.id, articleNumber: p.articleNumber, error: err.message });
    }
  }

  // Write reports
  const failedCsv = failed.length > 0
    ? 'id,articleNumber,error\n' + failed.map(f => `${f.id},${f.articleNumber},"${f.error}"`).join('\n')
    : 'id,articleNumber,error';
  fs.writeFileSync(path.join(cfg.REPORTS_DIR, 'failed-products.csv'), failedCsv, 'utf8');

  const summary = {
    projectId: PROJECT_ID,
    firestoreDatabase: '(default)',
    firestoreLocation: 'eur3',
    totalProductsImported: totalCommitted,
    totalCategoriesImported: categories.length,
    failedProducts: failed.length,
    duplicateArticleNumbers: duplicates.length,
    timestamp: new Date().toISOString()
  };
  writeJSON(path.join(cfg.REPORTS_DIR, 'migration_status.json'), summary);

  log('INFO', '=== IMPORT COMPLETE ===');
  log('INFO', `Products: ${totalCommitted}/${products.length} | Categories: ${categories.length} | Failed: ${failed.length}`);

  if (failed.length > 0) {
    log('WARN', `${failed.length} products failed. See reports/failed-products.csv`);
    process.exit(1);
  }
}

main().catch(err => {
  log('ERROR', 'Fatal error in import:', err.message);
  process.exit(1);
});
