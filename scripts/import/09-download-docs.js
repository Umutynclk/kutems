#!/usr/bin/env node
// scripts/import/09-download-docs.js
// Download product PDF documents and generate document manifest & report

const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { ensureDir, readJSON, writeJSON, log } = require('./utils');

const DOCS_DIR = path.join(cfg.DATA_DIR, 'docs');
ensureDir(DOCS_DIR);

async function downloadDoc(url, destPath) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    signal: AbortSignal.timeout(20000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

const TITLE_TR = {
  'Download manual': 'Kullanım & Montaj Kılavuzu (PDF)',
  'separate manual': 'Ayrı Kurulum Kılavuzu (PDF)',
  'installation manual on-line': 'Çevrimiçi Kurulum Kılavuzu (PDF)'
};

async function main() {
  const normFile = path.join(cfg.READY_DIR, 'products_normalized.json');
  const products = readJSON(normFile) || [];

  const docManifest = [];
  let downloadedCount = 0;
  let failedCount = 0;

  for (const p of products) {
    if (p.downloads && p.downloads.length > 0) {
      for (let i = 0; i < p.downloads.length; i++) {
        const dl = p.downloads[i];
        if (dl.url) {
          const artDir = path.join(DOCS_DIR, p.articleNumber);
          ensureDir(artDir);
          const filename = path.basename(decodeURIComponent(dl.url).split('?')[0]);
          const destPath = path.join(artDir, filename);

          // Update Turkish title
          dl.title.tr = TITLE_TR[dl.title.en] || dl.title.en;

          try {
            const size = await downloadDoc(dl.url, destPath);
            downloadedCount++;
            dl.fileSize = `${(size / 1024).toFixed(1)} KB`;
            docManifest.push({
              articleNumber: p.articleNumber,
              title: dl.title.en,
              titleTr: dl.title.tr,
              url: dl.url,
              localPath: destPath,
              fileSize: dl.fileSize,
              status: 'DOWNLOADED'
            });
            log('INFO', `Downloaded PDF for ${p.articleNumber}: ${filename} (${dl.fileSize})`);
          } catch (e) {
            failedCount++;
            docManifest.push({
              articleNumber: p.articleNumber,
              title: dl.title.en,
              url: dl.url,
              status: 'FAILED',
              error: e.message
            });
            log('WARN', `Failed PDF for ${p.articleNumber}: ${e.message}`);
          }
        }
      }
    }
  }

  // Update products with translated doc titles & fileSizes
  writeJSON(normFile, products);
  const appDataDir = path.join(__dirname, '../../src/lib/data');
  writeJSON(path.join(appDataDir, 'importedProducts.json'), products);

  // Write manifests and CSV reports
  writeJSON(path.join(cfg.READY_DIR, 'document_manifest.json'), docManifest);

  const csvHeaders = 'articleNumber,titleEn,titleTr,url,status,fileSize\n';
  const csvRows = docManifest.map(d => `"${d.articleNumber}","${d.title}","${d.titleTr || ''}","${d.url}","${d.status}","${d.fileSize || ''}"`).join('\n');
  fs.writeFileSync(path.join(cfg.REPORTS_DIR, 'document-upload-report.csv'), csvHeaders + csvRows, 'utf8');

  log('INFO', '=== DOCUMENTS DOWNLOAD COMPLETED ===');
  log('INFO', `Total: ${docManifest.length}, Downloaded: ${downloadedCount}, Failed: ${failedCount}`);
}

main().catch(err => {
  log('ERROR', 'Fatal in doc download:', err);
  process.exit(1);
});
