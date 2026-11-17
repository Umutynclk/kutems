#!/usr/bin/env node
// scripts/import/04-firestore-import.js
// Phase 8: Import normalized products and categories into Firestore (kutems project)

const path = require('path');
const fs = require('fs');
const cfg = require('./config');
const { ensureDir, readJSON, writeJSON, log } = require('./utils');
const { initializeApp, getApps } = require('firebase/app');
const {
  getFirestore,
  collection,
  doc,
  writeBatch,
  getDocs,
  query,
  limit
} = require('firebase/firestore');

// Use web config from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBmcEL0rF7Jvplgv0DbL_NLUrp_j5EJ2xI',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'kutems.firebaseapp.com',
  projectId: cfg.FIREBASE_PROJECT_ID, // 'kutems'
  storageBucket: cfg.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: '810820213557',
  appId: '1:810820213557:web:1a25ad40de9b809c014a7c'
};

async function main() {
  log('INFO', '=== FIRESTORE MIGRATION SCRIPT ===');
  log('INFO', 'Target Firebase Project:', { projectId: cfg.FIREBASE_PROJECT_ID });

  if (firebaseConfig.projectId !== 'kutems') {
    log('ERROR', 'SAFETY STOP: Project ID is not kutems!');
    process.exit(1);
  }

  const normProductsFile = path.join(cfg.READY_DIR, 'products_normalized.json');
  const normCategoriesFile = path.join(cfg.READY_DIR, 'categories_normalized.json');

  if (!fs.existsSync(normProductsFile) || !fs.existsSync(normCategoriesFile)) {
    log('ERROR', 'Normalized data files not found. Run 03-normalize.js first.');
    process.exit(1);
  }

  const products = readJSON(normProductsFile);
  const categories = readJSON(normCategoriesFile);

  log('INFO', `Loaded ${products.length} products and ${categories.length} categories.`);

  const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Phase 8 Step 1: Backup existing products and categories if any
  ensureDir(cfg.BACKUP_DIR);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFolder = path.join(cfg.BACKUP_DIR, `backup_${ts}`);
  ensureDir(backupFolder);

  try {
    log('INFO', 'Attempting pre-migration backup of existing Firestore documents...');
    const existingProdSnap = await getDocs(collection(db, 'products')).catch(() => null);
    if (existingProdSnap && !existingProdSnap.empty) {
      const existingProds = existingProdSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      writeJSON(path.join(backupFolder, 'existing_products.json'), existingProds);
      log('INFO', `Backed up ${existingProds.length} existing products.`);
    } else {
      log('INFO', 'No existing Firestore products found or database is fresh.');
    }

    const existingCatSnap = await getDocs(collection(db, 'categories')).catch(() => null);
    if (existingCatSnap && !existingCatSnap.empty) {
      const existingCats = existingCatSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      writeJSON(path.join(backupFolder, 'existing_categories.json'), existingCats);
      log('INFO', `Backed up ${existingCats.length} existing categories.`);
    }
  } catch (e) {
    log('WARN', 'Backup note (skipped if Firestore not initialized yet):', { message: e.message });
  }

  // Phase 8 Step 2: Import Categories (in a single batch)
  log('INFO', `Importing ${categories.length} categories into Firestore...`);
  try {
    const catBatch = writeBatch(db);
    for (const cat of categories) {
      const ref = doc(db, 'categories', cat.id);
      catBatch.set(ref, cat, { merge: true });
    }
    await catBatch.commit();
    log('INFO', 'Categories imported successfully!');
  } catch (err) {
    log('ERROR', 'Failed to import categories into Firestore:', { error: err.message });
    log('INFO', 'Note: If Cloud Firestore API is disabled or unprovisioned in project kutems, enable it in console.firebase.google.com/project/kutems/firestore');
    // Save report and exit cleanly
    writeJSON(path.join(cfg.REPORTS_DIR, 'migration_status.json'), {
      status: 'BLOCKED_BY_FIRESTORE_API_PROVISIONING',
      error: err.message,
      projectId: cfg.FIREBASE_PROJECT_ID,
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Phase 8 Step 3: Import Products in batches of 400
  log('INFO', `Importing ${products.length} products into Firestore...`);
  const BATCH_SIZE = 400;
  let batch = writeBatch(db);
  let batchCount = 0;
  let totalCommitted = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const ref = doc(db, 'products', p.id);
    batch.set(ref, p, { merge: true });
    batchCount++;

    if (batchCount >= BATCH_SIZE || (i + 1) === products.length) {
      await batch.commit();
      totalCommitted += batchCount;
      log('INFO', `Committed batch: ${totalCommitted}/${products.length} products written.`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  log('INFO', '=== FIRESTORE IMPORT COMPLETE ===');
  writeJSON(path.join(cfg.REPORTS_DIR, 'migration_status.json'), {
    status: 'SUCCESS',
    totalProductsImported: totalCommitted,
    totalCategoriesImported: categories.length,
    projectId: cfg.FIREBASE_PROJECT_ID,
    timestamp: new Date().toISOString()
  });
}

main().catch(err => {
  log('ERROR', 'Fatal in Firestore migration:', err);
  process.exit(1);
});

