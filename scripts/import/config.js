// scripts/import/config.js
const path = require('path');

module.exports = {
  BASE_URL: 'https://shop.flexiforce.com',
  AUTOMATION_URL: 'https://shop.flexiforce.com/en/automation.html',
  HARDWARE_URL: 'https://shop.flexiforce.com/en/hardware.html',

  DATA_DIR: path.join(__dirname, 'data'),
  RAW_DIR: path.join(__dirname, 'data/raw'),
  TRANSLATED_DIR: path.join(__dirname, 'data/translated'),
  READY_DIR: path.join(__dirname, 'data/ready'),
  REPORTS_DIR: path.join(__dirname, 'data/reports'),
  FAILURES_DIR: path.join(__dirname, 'data/failures'),
  IMAGES_DIR: path.join(__dirname, 'data/images'),
  BACKUP_DIR: path.join(__dirname, 'data/backup'),

  // Page size on FlexiForce
  PAGE_SIZE: 36,

  // Throttle (ms between requests)
  REQUEST_DELAY: 1200,

  // Concurrency for image downloads
  IMAGE_CONCURRENCY: 3,

  // Firebase project (verify before writing!)
  FIREBASE_PROJECT_ID: 'kutems',
  FIREBASE_STORAGE_BUCKET: 'kutems.firebasestorage.app',

  // Checkpoint files
  CHECKPOINT_CATEGORIES: 'data/checkpoint_categories.json',
  CHECKPOINT_PRODUCTS:   'data/checkpoint_products.json',
  CHECKPOINT_IMAGES:     'data/checkpoint_images.json',
  CHECKPOINT_FIRESTORE:  'data/checkpoint_firestore.json',
};

