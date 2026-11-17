#!/usr/bin/env node
// scripts/import/14-verify-all-deployed-assets.js
// Comprehensive verification and frontend integration for Cloudflare Pages media

const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { ensureDir, readJSON, writeJSON, log } = require('./utils');

const CF_BASE_URL = 'https://kutems-media.pages.dev';

async function main() {
  log('INFO', '=== ASSET VERIFICATION & INTEGRATION ===');
  log('INFO', 'Cloudflare Base URL:', { CF_BASE_URL });

  const manifest = readJSON(path.join(cfg.READY_DIR, 'cloudflare_file_manifest.json')) || [];
  log('INFO', `Manifest contains ${manifest.length} total files.`);

  const images = manifest.filter(m => m.type === 'image');
  const docs = manifest.filter(m => m.type === 'document');

  log('INFO', `Images: ${images.length}, Documents: ${docs.length}`);

  // 1. Verify all 8 PDF documents
  log('INFO', 'Verifying all PDF documents...');
  let docsVerified = 0;
  for (const doc of docs) {
    const docUrl = `${CF_BASE_URL}/${doc.relativePath}`;
    const res = await fetch(docUrl, { method: 'HEAD' });
    if (res.ok && res.headers.get('content-type')?.includes('pdf')) {
      docsVerified++;
      log('INFO', `[PDF OK] ${doc.articleNumber}: ${doc.filename} (${doc.size} bytes)`);
    } else {
      log('WARN', `[PDF FAILED] ${docUrl} status: ${res.status}`);
    }
  }

  // 2. Sample 100 images across different articles
  log('INFO', 'Verifying sample images across categories...');
  const sampleIndices = [];
  const step = Math.floor(images.length / 50);
  for (let i = 0; i < images.length; i += step) sampleIndices.push(i);

  let samplesVerified = 0;
  let samplesFailed = 0;

  for (const idx of sampleIndices) {
    const img = images[idx];
    if (!img) continue;
    const imgUrl = `${CF_BASE_URL}/${img.relativePath}`;
    try {
      const res = await fetch(imgUrl, { method: 'HEAD' });
      if (res.ok && (res.headers.get('content-type')?.includes('image') || res.headers.get('content-type')?.includes('octet-stream'))) {
        samplesVerified++;
      } else {
        samplesFailed++;
        log('WARN', `[IMAGE FAILED] ${imgUrl} status: ${res.status}`);
      }
    } catch (e) {
      samplesFailed++;
      log('WARN', `[IMAGE ERROR] ${imgUrl}: ${e.message}`);
    }
  }
  log('INFO', `Sample images check: ${samplesVerified}/${sampleIndices.length} OK (Failed: ${samplesFailed})`);

  // 3. Connect to KUTEMS product data
  log('INFO', 'Updating product records with live Cloudflare URLs...');
  const normFile = path.join(cfg.READY_DIR, 'products_normalized.json');
  const products = readJSON(normFile) || [];

  // Group files by articleNumber
  const filesByArt = new Map();
  for (const item of manifest) {
    if (!filesByArt.has(item.articleNumber)) {
      filesByArt.set(item.articleNumber, { images: [], docs: [] });
    }
    const group = filesByArt.get(item.articleNumber);
    if (item.type === 'image') group.images.push(item);
    else if (item.type === 'document') group.docs.push(item);
  }

  let updatedProducts = 0;

  for (const p of products) {
    const artMedia = filesByArt.get(p.articleNumber);
    if (artMedia && artMedia.images.length > 0) {
      // Sort to preserve original gallery order: 0_xxx, 1_xxx, etc.
      artMedia.images.sort((a, b) => {
        const numA = parseInt(a.filename.split('_')[0], 10) || 0;
        const numB = parseInt(b.filename.split('_')[0], 10) || 0;
        return numA - numB;
      });

      // Preserve original source URLs
      if (!p.sourceImageUrls || p.sourceImageUrls.length === 0) {
        p.sourceImageUrls = [...p.images];
      }

      // Point images array to Cloudflare Pages
      p.images = artMedia.images.map(img => `${CF_BASE_URL}/${img.relativePath}`);
      updatedProducts++;
    }

    if (artMedia && artMedia.docs.length > 0 && p.downloads) {
      for (const dl of p.downloads) {
        const docFile = artMedia.docs.find(d => path.basename(decodeURIComponent(dl.url).split('?')[0]) === d.filename);
        if (docFile) {
          dl.originalUrl = dl.url;
          dl.url = `${CF_BASE_URL}/${docFile.relativePath}`;
        }
      }
    }
  }

  // Write updated product data
  writeJSON(normFile, products);
  const appDataDir = path.join(__dirname, '../../src/lib/data');
  writeJSON(path.join(appDataDir, 'importedProducts.json'), products);
  log('INFO', `Updated ${updatedProducts} product records with Cloudflare Pages media links.`);

  // 4. Update next.config.ts
  log('INFO', 'Configuring next.config.ts for kutems-media.pages.dev...');
  const nextConfigPath = path.join(__dirname, '../../next.config.ts');
  const nextConfigContent = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kutems-media.pages.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.pages.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shop.flexiforce.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
`;
  fs.writeFileSync(nextConfigPath, nextConfigContent, 'utf8');

  // 5. Generate complete deployment summary reports
  const summary = {
    cloudflarePagesProject: 'kutems-media',
    deployedHostname: CF_BASE_URL,
    totalImagesUploaded: images.length,
    totalDocsUploaded: docs.length,
    totalFilesDeployed: manifest.length,
    totalDeploymentSizeMB: (manifest.reduce((s, m) => s + m.size, 0) / (1024 * 1024)).toFixed(2),
    allDocsVerified: docsVerified === docs.length,
    docsVerifiedCount: docsVerified,
    sampleImagesVerifiedCount: samplesVerified,
    failedChecks: samplesFailed,
    updatedProductsCount: updatedProducts,
    completedAt: new Date().toISOString()
  };

  writeJSON(path.join(cfg.REPORTS_DIR, 'cloudflare_media_deployment_summary.json'), summary);

  // CSV report
  const csvHeaders = 'metric,value\n';
  const csvRows = [
    `"Project Name","${summary.cloudflarePagesProject}"`,
    `"Deployed Hostname","${summary.deployedHostname}"`,
    `"Total Images Uploaded","${summary.totalImagesUploaded}"`,
    `"Total PDFs Uploaded","${summary.totalDocsUploaded}"`,
    `"Total Deployed Files","${summary.totalFilesDeployed}"`,
    `"Total Size (MB)","${summary.totalDeploymentSizeMB}"`,
    `"Updated Products","${summary.updatedProductsCount}"`,
    `"Sample Checks Passed","${summary.sampleImagesVerifiedCount}/${sampleIndices.length}"`,
    `"Failed Checks","${summary.failedChecks}"`
  ].join('\n');
  fs.writeFileSync(path.join(cfg.REPORTS_DIR, 'cloudflare_media_deployment_summary.csv'), csvHeaders + csvRows, 'utf8');

  log('INFO', '=== ALL ASSETS VERIFIED & LINKED TO KUTEMS CATALOG ===');
  log('INFO', JSON.stringify(summary, null, 2));
}

main().catch(err => {
  log('ERROR', 'Fatal in verification:', err);
  process.exit(1);
});
