#!/usr/bin/env node
// scripts/import/05-download-images.js
// Phase 4: Download all 2,922 product gallery images locally with retry and verification

const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { sleep, ensureDir, readJSON, writeJSON, log } = require('./utils');

ensureDir(cfg.IMAGES_DIR);

const CONCURRENCY = 8;

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

function getSafeFilename(url, index) {
  const cleanUrl = url.split('?')[0];
  const origName = path.basename(cleanUrl);
  const ext = path.extname(origName) || '.jpg';
  // If original name is descriptive, sanitize it, otherwise use index
  const base = path.basename(origName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${index}_${base}${ext}`;
}

async function downloadImage(item, attempt = 1) {
  const destDir = path.join(cfg.IMAGES_DIR, item.articleNumber);
  ensureDir(destDir);
  const filename = getSafeFilename(item.sourceUrl, item.imageIndex);
  const destPath = path.join(destDir, filename);

  // If already downloaded and valid
  if (fs.existsSync(destPath)) {
    const stat = fs.statSync(destPath);
    if (stat.size > 200) {
      return {
        articleNumber: item.articleNumber,
        imageIndex: item.imageIndex,
        sourceUrl: item.sourceUrl,
        localPath: destPath,
        filename,
        size: stat.size,
        status: 'CACHED'
      };
    }
  }

  try {
    const res = await fetch(item.sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(20000)
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('image') && !contentType.includes('octet-stream')) {
      throw new Error(`Invalid content-type: ${contentType}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 100) {
      throw new Error(`File too small: ${buffer.length} bytes`);
    }

    fs.writeFileSync(destPath, buffer);
    return {
      articleNumber: item.articleNumber,
      imageIndex: item.imageIndex,
      sourceUrl: item.sourceUrl,
      localPath: destPath,
      filename,
      size: buffer.length,
      mimeType: contentType,
      status: 'DOWNLOADED'
    };
  } catch (err) {
    if (attempt <= 2) {
      await sleep(1000 * attempt);
      return downloadImage(item, attempt + 1);
    }
    return {
      articleNumber: item.articleNumber,
      imageIndex: item.imageIndex,
      sourceUrl: item.sourceUrl,
      status: 'FAILED',
      error: err.message
    };
  }
}

async function main() {
  const manifestFile = path.join(cfg.READY_DIR, 'image_manifest.json');
  if (!fs.existsSync(manifestFile)) {
    log('ERROR', 'image_manifest.json not found. Run 03-normalize.js first.');
    process.exit(1);
  }

  const manifest = readJSON(manifestFile);
  log('INFO', `Loaded ${manifest.length} images from manifest to download.`);

  let downloadedCount = 0;
  let cachedCount = 0;
  let failedCount = 0;
  let totalProcessed = 0;

  const downloadResults = [];
  const failures = [];

  await asyncPool(CONCURRENCY, manifest, async (item) => {
    const res = await downloadImage(item);
    totalProcessed++;

    if (res.status === 'DOWNLOADED') downloadedCount++;
    else if (res.status === 'CACHED') cachedCount++;
    else {
      failedCount++;
      failures.push(res);
    }

    downloadResults.push(res);

    if (totalProcessed % 100 === 0 || totalProcessed === manifest.length) {
      log('INFO', `Images: ${totalProcessed}/${manifest.length} (${((totalProcessed / manifest.length) * 100).toFixed(1)}%) | Downloaded: ${downloadedCount} | Cached: ${cachedCount} | Failed: ${failedCount}`);
    }
  });

  // Save report
  const report = {
    totalManifestImages: manifest.length,
    downloadedImages: downloadedCount,
    cachedImages: cachedCount,
    successTotal: downloadedCount + cachedCount,
    failedImages: failedCount,
    timestamp: new Date().toISOString()
  };

  writeJSON(path.join(cfg.REPORTS_DIR, 'image_download_report.json'), report);

  // CSV reports
  const reportRows = [
    { metric: 'Total Images in Manifest', value: manifest.length },
    { metric: 'Successfully Downloaded / Cached', value: downloadedCount + cachedCount },
    { metric: 'Failed Downloads', value: failedCount },
    { metric: 'Success Rate', value: `${(((downloadedCount + cachedCount) / manifest.length) * 100).toFixed(1)}%` }
  ];
  const toCsv = rows => [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n');
  fs.writeFileSync(path.join(cfg.REPORTS_DIR, 'storage-upload-report.csv'), toCsv(reportRows), 'utf8');

  // missing-images.csv
  const missingCsv = 'articleNumber,imageIndex,sourceUrl,error\n' +
    failures.map(f => `"${f.articleNumber}","${f.imageIndex}","${f.sourceUrl}","${f.error}"`).join('\n');
  fs.writeFileSync(path.join(cfg.REPORTS_DIR, 'missing-images.csv'), missingCsv, 'utf8');

  log('INFO', '=== IMAGE DOWNLOAD COMPLETED ===');
  log('INFO', JSON.stringify(report, null, 2));
}

main().catch(err => {
  log('ERROR', 'Fatal in download images:', err);
  process.exit(1);
});
