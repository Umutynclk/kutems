#!/usr/bin/env node
// scripts/import/13-deploy-and-verify-cloudflare.js
// Deploy static media to Cloudflare Pages Free and verify every asset

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { readJSON, writeJSON, log } = require('./utils');

const DEPLOY_DIR = path.resolve(__dirname, '../../../kutems-media-deploy');
const PROJECT_NAME = 'kutems-media';

async function main() {
  log('INFO', '=== CLOUDFLARE PAGES DEPLOYMENT ===');
  log('INFO', 'Target Project:', { projectName: PROJECT_NAME, deployDir: DEPLOY_DIR });

  // 1. Run Wrangler deploy
  const wranglerBin = path.join(__dirname, 'node_modules/.bin/wrangler');
  log('INFO', 'Running direct upload via Wrangler...');

  let deployOutput = '';
  try {
    deployOutput = execSync(
      `"${wranglerBin}" pages deploy "${DEPLOY_DIR}" --project-name="${PROJECT_NAME}" --commit-dirty=true`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
  } catch (err) {
    log('ERROR', 'Wrangler deployment failed:', { message: err.message, stderr: err.stderr?.toString() });
    throw err;
  }

  log('INFO', 'Wrangler output:\n' + deployOutput);

  // 2. Parse hostname from Wrangler output
  // Look for https://kutems-media.pages.dev or https://<hash>.kutems-media.pages.dev
  const match = deployOutput.match(/https:\/\/[a-zA-Z0-9.-]+\.pages\.dev/g);
  let deployedUrl = match ? match[match.length - 1] : `https://${PROJECT_NAME}.pages.dev`;

  // Prefer canonical https://kutems-media.pages.dev if present
  if (match && match.some(u => u === `https://${PROJECT_NAME}.pages.dev`)) {
    deployedUrl = `https://${PROJECT_NAME}.pages.dev`;
  }

  log('INFO', 'Detected Deployed Hostname:', { deployedUrl });

  // 3. Verify deployed assets with HTTP checks
  log('INFO', 'Verifying sample assets on Cloudflare Pages...');
  const manifest = readJSON(path.join(cfg.READY_DIR, 'cloudflare_file_manifest.json')) || [];

  let verifiedCount = 0;
  let failedChecks = 0;
  const sampleItems = [
    manifest.find(m => m.type === 'document'),
    ...manifest.filter(m => m.type === 'image').slice(0, 10),
    manifest[Math.floor(manifest.length / 2)],
    manifest[manifest.length - 1]
  ].filter(Boolean);

  for (const item of sampleItems) {
    const testUrl = `${deployedUrl}/${item.relativePath}`;
    try {
      const res = await fetch(testUrl, { method: 'HEAD' });
      if (res.ok) {
        verifiedCount++;
        log('INFO', `Verified [${res.status}]: ${testUrl}`);
      } else {
        failedChecks++;
        log('WARN', `Asset check returned [${res.status}]: ${testUrl}`);
      }
    } catch (e) {
      failedChecks++;
      log('WARN', `Network error testing ${testUrl}: ${e.message}`);
    }
  }

  // 4. Update products with Cloudflare URLs
  log('INFO', 'Updating product records with Cloudflare Pages URLs...');
  const normFile = path.join(cfg.READY_DIR, 'products_normalized.json');
  const products = readJSON(normFile) || [];

  // Map files by articleNumber
  const filesByArticle = new Map();
  for (const item of manifest) {
    if (!filesByArticle.has(item.articleNumber)) {
      filesByArticle.set(item.articleNumber, { images: [], docs: [] });
    }
    const bucket = filesByArticle.get(item.articleNumber);
    if (item.type === 'image') bucket.images.push(item);
    else if (item.type === 'document') bucket.docs.push(item);
  }

  let updatedProductsCount = 0;

  for (const p of products) {
    const media = filesByArticle.get(p.articleNumber);
    if (media && media.images.length > 0) {
      // Sort images by index in filename (e.g. 0_xxx.jpg, 1_xxx.jpg)
      media.images.sort((a, b) => {
        const idxA = parseInt(a.filename.split('_')[0], 10) || 0;
        const idxB = parseInt(b.filename.split('_')[0], 10) || 0;
        return idxA - idxB;
      });

      // Preserve original source URLs in separate field
      if (!p.sourceImageUrls || p.sourceImageUrls.length === 0) {
        p.sourceImageUrls = [...p.images];
      }

      // Point images array to Cloudflare Pages CDN
      p.images = media.images.map(img => `${deployedUrl}/${img.relativePath}`);
      updatedProductsCount++;
    }

    if (media && media.docs.length > 0 && p.downloads) {
      for (const dl of p.downloads) {
        const docFile = media.docs.find(d => path.basename(decodeURIComponent(dl.url).split('?')[0]) === d.filename);
        if (docFile) {
          dl.originalUrl = dl.url;
          dl.url = `${deployedUrl}/${docFile.relativePath}`;
        }
      }
    }
  }

  // Save updated records
  writeJSON(normFile, products);
  const appDataDir = path.join(__dirname, '../../src/lib/data');
  writeJSON(path.join(appDataDir, 'importedProducts.json'), products);

  // 5. Update next.config.ts with the Cloudflare domain
  const cfHost = new URL(deployedUrl).hostname;
  log('INFO', `Updating next.config.ts with Cloudflare host: ${cfHost}`);
  const nextConfigPath = path.join(__dirname, '../../next.config.ts');
  const nextConfigContent = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "${cfHost}",
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

  // 6. Generate final report
  const finalSummary = {
    projectName: PROJECT_NAME,
    deployedHostname: deployedUrl,
    uploadedImages: manifest.filter(m => m.type === 'image').length,
    uploadedPdfs: manifest.filter(m => m.type === 'document').length,
    totalDeployedFiles: manifest.length,
    totalDeployedSizeMB: (manifest.reduce((s, m) => s + m.size, 0) / (1024 * 1024)).toFixed(2),
    sampleVerifiedAssets: verifiedCount,
    failedChecks,
    updatedProductRecords: updatedProductsCount,
    timestamp: new Date().toISOString()
  };

  writeJSON(path.join(cfg.REPORTS_DIR, 'cloudflare_deployment_summary.json'), finalSummary);
  log('INFO', '=== DEPLOYMENT AND VERIFICATION COMPLETE ===');
  log('INFO', JSON.stringify(finalSummary, null, 2));
}

main().catch(err => {
  log('ERROR', 'Fatal in deploy script:', err);
  process.exit(1);
});
