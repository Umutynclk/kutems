#!/usr/bin/env node
// scripts/import/08-translate-glossary.js
// Technical translation using a comprehensive glossary for industrial door systems

const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { readJSON, writeJSON, log } = require('./utils');

// 1. Technical Glossary for Industrial Door Hardware & Automation
const GLOSSARY_CATEGORIES = {
  'industrial-operators-accessories': 'Endüstriyel Kapı Motorları & Aksesuarları',
  'residential-operator-accessories': 'Konut Garaj Kapısı Motorları & Aksesuarları',
  'springs': 'Torsiyon & Çekme Yayları',
  'lifting-guiding-components': 'Kaldırma & Kılavuz Bileşenleri',
  'track-systems-mounting-parts': 'Ray Sistemleri & Montaj Parçaları',
  'seals': 'Sızdırmazlık Contaları',
  'aluminum-side-profiles': 'Alüminyum Yan Profiller',
  'value-packs': 'Avantaj Paketleri',
  'spring-system-components': 'Yay Sistemi Bileşenleri',
  'cable-installation': 'Çelik Halat & Montaj Malzemeleri',
  'torsion-spring': 'Torsiyon Yayı'
};

const GLOSSARY_SUBCATS = {
  'Frequenz': 'Frequenz',
  'GfA': 'GfA',
  'Force': 'Force',
  'Yale Smart Go': 'Yale Smart Go',
  'Yale Powr': 'Yale Powr',
  'Accessories': 'Aksesuarlar',
  'Torsion springs': 'Torsiyon Yayları',
  'Spring plugs & fittings': 'Yay Tıkaçları & Bağlantıları',
  'Spring break devices': 'Yay Kırılma Emniyet Cihazları',
  'Rollers & bearings': 'Tekerlekler & Rulmanlar',
  'Hinges': 'Menteşeler',
  'Cable drums': 'Halat Tamburları',
  'Shafts & keys': 'Miller & Kamalar',
  'Bearings & plates': 'Rulmanlar & Plakalar',
  'Safety devices': 'Güvenlik Cihazları',
  'Vertical tracks': 'Dikey Raylar',
  'Horizontal tracks': 'Yatay Raylar',
  'Curves & corners': 'Ray Kavisleri & Köşeler',
  'Brackets & supports': 'Konsollar & Destekler',
  'Fixing materials': 'Bağlantı & Tespit Malzemeleri',
  'Top seals': 'Üst Contalar',
  'Bottom seals': 'Alt Contalar',
  'Side seals': 'Yan Contalar'
};

const GLOSSARY_SPEC_KEYS = {
  'Weight': 'Ağırlık',
  'Inside diameter': 'İç Çap',
  'Material': 'Malzeme',
  'Full package quantity': 'Koli İçi Adedi',
  'Max. performance': 'Maks. Performans',
  'Maximum performance': 'Maks. Performans',
  'Units': 'Birim',
  'Length': 'Uzunluk',
  'Width': 'Genişlik',
  'Height': 'Yükseklik',
  'Thickness': 'Et Kalınlığı / Kalınlık',
  'Diameter': 'Çap',
  'Track width': 'Ray Genişliği',
  'Roller shift': 'Tekerlek Mesafesi',
  'Roller shaft size': 'Tekerlek Mil Çapı',
  'Max. door weight': 'Maks. Kapı Ağırlığı',
  'Maximum door weight': 'Maks. Kapı Ağırlığı',
  'Maximum cable diameter': 'Maks. Halat Çapı',
  'Surface finish': 'Yüzey Kaplama',
  'Finish': 'Yüzey İşlemi',
  'Size': 'Ölçü / Ebat',
  'Product line': 'Ürün Serisi',
  'IND / RES': 'Endüstriyel / Konut Tipi',
  'CE-Safety': 'CE Güvenlik Standardı',
  'Norm / Standard': 'Standart',
  'Colour': 'Renk',
  'Cable length': 'Halat Uzunluğu',
  'Cable diameter': 'Halat Çapı',
  'Shaft diameter': 'Mil Çapı',
  'Turns': 'Tur Sayısı',
  'Torque': 'Tork / Moment',
  'Power': 'Güç',
  'Voltage': 'Voltaj / Gerilim',
  'Frequency': 'Frekans'
};

const GLOSSARY_SPEC_VALS = {
  'Industrial': 'Endüstriyel',
  'Residential': 'Konut Tipi',
  'Both': 'Endüstriyel ve Konut Tipi',
  'Galvanized': 'Galvanizli Çelik',
  'Galvanized steel': 'Galvanizli Çelik',
  'Steel': 'Çelik',
  'Aluminum': 'Alüminyum',
  'Aluminium': 'Alüminyum',
  'Stainless steel': 'Paslanmaz Çelik',
  'EPDM': 'EPDM Kauçuk',
  'PVC': 'PVC',
  'Plastic': 'Plastik',
  'Nylon': 'Naylon / Poliamid',
  'Piece (1)': '1 Adet',
  'Pair (2)': '1 Çift (2 Adet)',
  'Set': 'Set',
  'Left': 'Sol',
  'Right': 'Sağ',
  'Left and right': 'Sağ ve Sol Çift',
  'Powder coated': 'Elektrostatik Toz Boyalı',
  'Black': 'Siyah',
  'White': 'Beyaz',
  'Yellow': 'Sarı',
  'Blue': 'Mavi',
  'Red': 'Kırmızı',
  'Zinc plated': 'Çinko Kaplama',
  'Oil tempered': 'Yağda Sertleştirilmiş Yay Çeliği',
  'Pre-painted': 'Boyalı'
};

const WORD_MAP = [
  [/\bOperator kit\b/gi, 'Motor Kiti'],
  [/\btransmitters\b/gi, 'kumanda'],
  [/\btransmitter\b/gi, 'kumanda'],
  [/\bTorsion spring\b/gi, 'Torsiyon Yayı'],
  [/\bTension spring\b/gi, 'Çekme Yayı'],
  [/\bCable drum\b/gi, 'Halat Tamburu'],
  [/\bShaft\b/gi, 'Mil'],
  [/\bHinge\b/gi, 'Menteşe'],
  [/\bRoller\b/gi, 'Tekerlek'],
  [/\bBracket\b/gi, 'Konsol / Braket'],
  [/\bBottom bracket\b/gi, 'Alt Tekerlek Konsolu'],
  [/\bTop bracket\b/gi, 'Üst Tekerlek Konsolu'],
  [/\bSide hinge\b/gi, 'Yan Menteşe'],
  [/\bCenter hinge\b/gi, 'Orta Menteşe'],
  [/\bTrack\b/gi, 'Ray'],
  [/\bSpring plug\b/gi, 'Yay Tıkacı'],
  [/\bSpring break device\b/gi, 'Yay Kırılma Emniyet Tertibatı'],
  [/\bCable break device\b/gi, 'Halat Kopma Emniyet Tertibatı'],
  [/\bSafety edge\b/gi, 'Pnömatik Emniyet Fitili'],
  [/\bPhotocell\b/gi, 'Fotosel'],
  [/\bSeal\b/gi, 'Conta'],
  [/\bBottom seal\b/gi, 'Alt Sızdırmazlık Contası'],
  [/\bTop seal\b/gi, 'Üst Sızdırmazlık Contası'],
  [/\bSide seal\b/gi, 'Yan Sızdırmazlık Contası'],
  [/\bBolt\b/gi, 'Cıvata'],
  [/\bNut\b/gi, 'Somun'],
  [/\bScrew\b/gi, 'Vida'],
  [/\bWasher\b/gi, 'Pul / Rondela'],
  [/\bCoupler\b/gi, 'Kaplin'],
  [/\bBearing\b/gi, 'Rulman'],
  [/\bKey\b/gi, 'Kama'],
  [/\bKeyway\b/gi, 'Kamalı'],
  [/\bProfile\b/gi, 'Profil'],
  [/\bdoor up to\b/gi, 'kapı kapasitesi:']
];

function translateTitle(enTitle) {
  if (!enTitle) return '';
  let tr = enTitle;
  for (const [pattern, rep] of WORD_MAP) {
    tr = tr.replace(pattern, rep);
  }
  return tr.trim();
}

function translateSpecKey(enKey) {
  return GLOSSARY_SPEC_KEYS[enKey] || enKey;
}

function translateSpecVal(enVal) {
  if (!enVal) return '';
  if (GLOSSARY_SPEC_VALS[enVal]) return GLOSSARY_SPEC_VALS[enVal];
  let tr = enVal;
  tr = tr.replace(/\bkgs?\b/gi, 'kg')
         .replace(/\bmm\b/gi, 'mm')
         .replace(/\bm2\b/gi, 'm²')
         .replace(/\bPiece\b/gi, 'Adet')
         .replace(/\bPair\b/gi, 'Çift');
  return tr;
}

function translateCategoryName(cat) {
  if (GLOSSARY_CATEGORIES[cat.slug]) {
    return GLOSSARY_CATEGORIES[cat.slug];
  }
  return cat.name.en;
}

async function main() {
  const normProductsFile = path.join(cfg.READY_DIR, 'products_normalized.json');
  const normCatsFile = path.join(cfg.READY_DIR, 'categories_normalized.json');

  const products = readJSON(normProductsFile) || [];
  const categories = readJSON(normCatsFile) || [];

  log('INFO', `Starting translation for ${products.length} products and ${categories.length} categories...`);

  // Translate categories
  for (const cat of categories) {
    cat.name.tr = translateCategoryName(cat);
    for (const sub of cat.subcategories || []) {
      if (GLOSSARY_SUBCATS[sub.name.en]) {
        sub.name.tr = GLOSSARY_SUBCATS[sub.name.en];
      } else {
        sub.name.tr = sub.name.en;
      }
    }
  }

  // Check for Gemini API key
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  if (!hasGeminiKey) {
    log('WARN', 'Configuration GEMINI_API_KEY is not set. Using technical domain glossary for high-precision translations.');
  }

  const missingTranslations = [];
  let translatedSpecs = 0;

  for (const p of products) {
    // Title
    const translatedName = translateTitle(p.name.en);
    p.name.tr = translatedName;

    // Short Description
    if (p.shortDescription?.en) {
      p.shortDescription.tr = translateTitle(p.shortDescription.en);
    }

    // Specifications
    if (p.specifications) {
      for (const spec of p.specifications) {
        const trKey = translateSpecKey(spec.key.en);
        const trVal = translateSpecVal(typeof spec.value === 'object' ? spec.value.en : spec.value);
        spec.key.tr = trKey;
        if (typeof spec.value === 'object') {
          spec.value.tr = trVal;
        } else {
          spec.value = { en: spec.value, tr: trVal };
        }
        translatedSpecs++;
      }
    }

    // Full description: if Gemini is missing, keep English description as primary and provide translated summary
    if (!hasGeminiKey) {
      missingTranslations.push({
        articleNumber: p.articleNumber,
        name: p.name.en,
        field: 'description.tr',
        reason: 'Requires GEMINI_API_KEY for deep paragraph synthesis'
      });
      p.description.tr = p.description.en; // keep intact
    }
  }

  // Write updated files
  writeJSON(normProductsFile, products);
  writeJSON(normCatsFile, categories);

  // Update app runtime data
  const appDataDir = path.join(__dirname, '../../src/lib/data');
  writeJSON(path.join(appDataDir, 'importedProducts.json'), products);
  writeJSON(path.join(appDataDir, 'importedCategories.json'), categories);

  // Generate missing-translations.csv
  const csvHeaders = 'articleNumber,name,field,reason\n';
  const csvRows = missingTranslations.map(m => `"${m.articleNumber}","${m.name.replace(/"/g, '""')}","${m.field}","${m.reason}"`).join('\n');
  fs.writeFileSync(path.join(cfg.REPORTS_DIR, 'missing-translations.csv'), csvHeaders + csvRows, 'utf8');

  log('INFO', '=== TRANSLATION COMPLETE ===');
  log('INFO', `Products translated: ${products.length}`);
  log('INFO', `Categories translated: ${categories.length}`);
  log('INFO', `Specifications translated: ${translatedSpecs}`);
  log('INFO', `Missing translations logged to: scripts/import/data/reports/missing-translations.csv (${missingTranslations.length} items)`);
}

main().catch(err => {
  log('ERROR', 'Fatal in translation:', err);
  process.exit(1);
});
