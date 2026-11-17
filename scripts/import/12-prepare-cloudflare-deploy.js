#!/usr/bin/env node
// scripts/import/12-prepare-cloudflare-deploy.js
// Prepare static media deployment directory for Cloudflare Pages

const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { ensureDir, readJSON, writeJSON, log } = require('./utils');

const DEPLOY_DIR = path.resolve(__dirname, '../../../kutems-media-deploy');
ensureDir(DEPLOY_DIR);

log('INFO', 'Target Deployment Directory:', { deployDir: DEPLOY_DIR });

// 1. Copy images to products/{articleNumber}/images/{filename}
const IMAGES_SRC = path.join(cfg.DATA_DIR, 'images');
const DOCS_SRC = path.join(cfg.DATA_DIR, 'docs');

let copiedImages = 0;
let copiedDocs = 0;
let totalImageBytes = 0;
let totalDocBytes = 0;

// Read products to preserve gallery order and filenames
const normFile = path.join(cfg.READY_DIR, 'products_normalized.json');
const products = readJSON(normFile) || [];

// Create mapping for files
const fileManifest = [];

// Copy images
const articleDirs = fs.readdirSync(IMAGES_SRC).filter(f => !f.startsWith('.'));
for (const article of articleDirs) {
  const srcArtDir = path.join(IMAGES_SRC, article);
  if (!fs.statSync(srcArtDir).isDirectory()) continue;

  const targetArtImagesDir = path.join(DEPLOY_DIR, 'products', article, 'images');
  ensureDir(targetArtImagesDir);

  const imgFiles = fs.readdirSync(srcArtDir).filter(f => !f.startsWith('.'));
  for (const imgFile of imgFiles) {
    const srcFile = path.join(srcArtDir, imgFile);
    const destFile = path.join(targetArtImagesDir, imgFile);
    fs.copyFileSync(srcFile, destFile);
    const size = fs.statSync(destFile).size;
    copiedImages++;
    totalImageBytes += size;

    fileManifest.push({
      type: 'image',
      articleNumber: article,
      filename: imgFile,
      relativePath: `products/${article}/images/${imgFile}`,
      size
    });
  }
}

// Copy documents
if (fs.existsSync(DOCS_SRC)) {
  const docArticleDirs = fs.readdirSync(DOCS_SRC).filter(f => !f.startsWith('.'));
  for (const article of docArticleDirs) {
    const srcArtDir = path.join(DOCS_SRC, article);
    if (!fs.statSync(srcArtDir).isDirectory()) continue;

    const targetArtDocsDir = path.join(DEPLOY_DIR, 'products', article, 'documents');
    ensureDir(targetArtDocsDir);

    const docFiles = fs.readdirSync(srcArtDir).filter(f => !f.startsWith('.'));
    for (const docFile of docFiles) {
      const srcFile = path.join(srcArtDir, docFile);
      const destFile = path.join(targetArtDocsDir, docFile);
      fs.copyFileSync(srcFile, destFile);
      const size = fs.statSync(destFile).size;
      copiedDocs++;
      totalDocBytes += size;

      fileManifest.push({
        type: 'document',
        articleNumber: article,
        filename: docFile,
        relativePath: `products/${article}/documents/${docFile}`,
        size
      });
    }
  }
}

// 2. Create _headers file for Cloudflare Pages
const headersContent = `/*
  Access-Control-Allow-Origin: *
  X-Content-Type-Options: nosniff

/products/*/images/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

/products/*/documents/*
  Access-Control-Allow-Origin: *
  Content-Disposition: inline
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
`;

fs.writeFileSync(path.join(DEPLOY_DIR, '_headers'), headersContent, 'utf8');

// 3. Create a clean index.html in deploy root
const indexHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>KUTEMS Static Media CDN</title>
</head>
<body style="font-family: sans-serif; padding: 40px; text-align: center;">
  <h1>KUTEMS Static Media CDN</h1>
  <p>Tüm ürün görselleri ve dokümanları Cloudflare Pages üzerinden sunulmaktadır.</p>
</body>
</html>`;
fs.writeFileSync(path.join(DEPLOY_DIR, 'index.html'), indexHtml, 'utf8');

// Write manifest
writeJSON(path.join(cfg.READY_DIR, 'cloudflare_file_manifest.json'), fileManifest);

log('INFO', '=== DEPLOY DIRECTORY PREPARED ===');
log('INFO', `Copied Images: ${copiedImages} (${(totalImageBytes / (1024 * 1024)).toFixed(2)} MB)`);
log('INFO', `Copied Docs:   ${copiedDocs} (${(totalDocBytes / (1024 * 1024)).toFixed(2)} MB)`);
log('INFO', `Total Files:   ${copiedImages + copiedDocs} (${((totalImageBytes + totalDocBytes) / (1024 * 1024)).toFixed(2)} MB)`);
log('INFO', `Deploy Dir:    ${DEPLOY_DIR}`);
