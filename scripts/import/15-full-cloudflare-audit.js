#!/usr/bin/env node
// scripts/import/15-full-cloudflare-audit.js
// Step 1: Validate 100% of all 2,930 assets on Cloudflare Pages (2,922 images + 8 PDFs)

const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { ensureDir, readJSON, writeJSON, log, sleep } = require('./utils');

const CF_BASE_URL = 'https://kutems-media.pages.dev';
const CONCURRENCY = 16;

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

async function verifyAsset(item, attempt = 1) {
  const url = `${CF_BASE_URL}/${item.relativePath}`;
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'KutemsMediaAudit/1.0'
      },
      signal: AbortSignal.timeout(12000)
    });

    const contentType = res.headers.get('content-type') || '';
    const contentLength = res.headers.get('content-length') || '';
    const status = res.status;

    let valid = false;
    if (status === 200) {
      if (item.type === 'document') {
        valid = contentType.includes('pdf');
      } else {
        valid = contentType.includes('image') || contentType.includes('octet-stream');
      }
    }

    if (!valid && attempt <= 2) {
      await sleep(1000 * attempt);
      return verifyAsset(item, attempt + 1);
    }

    return {
      articleNumber: item.articleNumber,
      type: item.type,
      filename: item.filename,
      url,
      httpStatus: status,
      contentType,
      contentLength,
      expectedSize: item.size,
      status: valid ? 'VERIFIED_OK' : 'VERIFICATION_FAILED',
      error: valid ? '' : `Invalid response: status=${status}, contentType=${contentType}`
    };
  } catch (err) {
    if (attempt <= 2) {
      await sleep(1000 * attempt);
      return verifyAsset(item, attempt + 1);
    }
    return {
      articleNumber: item.articleNumber,
      type: item.type,
      filename: item.filename,
      url,
      httpStatus: 0,
      contentType: '',
      contentLength: '',
      expectedSize: item.size,
      status: 'NETWORK_ERROR',
      error: err.message
    };
  }
}

async function main() {
  log('INFO', '=== STARTING 100% CLOUDFLARE MEDIA AUDIT ===');
  const manifestFile = path.join(cfg.READY_DIR, 'cloudflare_file_manifest.json');
  if (!fs.existsSync(manifestFile)) {
    log('ERROR', 'cloudflare_file_manifest.json not found!');
    process.exit(1);
  }

  const manifest = readJSON(manifestFile);
  log('INFO', `Total files to verify: ${manifest.length}`);

  let verifiedImages = 0;
  let verifiedDocs = 0;
  let failedCount = 0;
  let processed = 0;

  const auditResults = [];

  await asyncPool(CONCURRENCY, manifest, async (item) => {
    const result = await verifyAsset(item);
    auditResults.push(result);
    processed++;

    if (result.status === 'VERIFIED_OK') {
      if (item.type === 'document') verifiedDocs++;
      else verifiedImages++;
    } else {
      failedCount++;
      log('WARN', `FAILED: ${result.url} - ${result.error}`);
    }

    if (processed % 200 === 0 || processed === manifest.length) {
      log('INFO', `Verified: ${processed}/${manifest.length} (${((processed / manifest.length) * 100).toFixed(1)}%) | OK: ${verifiedImages + verifiedDocs} | Failed: ${failedCount}`);
    }
  });

  // Sort audit results by articleNumber, type, filename
  auditResults.sort((a, b) => a.articleNumber.localeCompare(b.articleNumber) || a.filename.localeCompare(b.filename));

  // Write CSV: cloudflare-full-url-audit.csv
  const csvHeaders = 'articleNumber,type,filename,url,httpStatus,contentType,contentLength,expectedSize,status,error\n';
  const csvRows = auditResults.map(r =>
    `"${r.articleNumber}","${r.type}","${r.filename}","${r.url}","${r.httpStatus}","${r.contentType}","${r.contentLength}","${r.expectedSize}","${r.status}","${r.error}"`
  ).join('\n');

  const csvPath = path.join(cfg.REPORTS_DIR, 'cloudflare-full-url-audit.csv');
  fs.writeFileSync(csvPath, csvHeaders + csvRows, 'utf8');

  const summary = {
    totalFilesAudited: manifest.length,
    totalImagesAudited: manifest.filter(m => m.type === 'image').length,
    verifiedImagesCount: verifiedImages,
    totalDocsAudited: manifest.filter(m => m.type === 'document').length,
    verifiedDocsCount: verifiedDocs,
    failedCount,
    verificationSuccessRate: `${(((verifiedImages + verifiedDocs) / manifest.length) * 100).toFixed(2)}%`,
    csvReportPath: csvPath,
    completedAt: new Date().toISOString()
  };

  writeJSON(path.join(cfg.REPORTS_DIR, 'cloudflare_full_audit_summary.json'), summary);

  log('INFO', '=== 100% CLOUDFLARE AUDIT COMPLETED ===');
  log('INFO', JSON.stringify(summary, null, 2));
}

main().catch(err => {
  log('ERROR', 'Fatal in full audit:', err);
  process.exit(1);
});
