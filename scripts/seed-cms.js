#!/usr/bin/env node
// scripts/seed-cms.js
// Seeds initial CMS data to Firestore

const path = require('path');
const fs = require('fs');
const os = require('os');
const https = require('https');

const PROJECT_ID = 'kutems';

function getAccessToken() {
  const configPath = path.join(os.homedir(), '.config/configstore/firebase-tools.json');
  const conf = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return conf.tokens.access_token;
}

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          else resolve(parsed);
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

async function writeDoc(collectionName, docId, data, token) {
  const options = {
    hostname: 'firestore.googleapis.com',
    path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}/${docId}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  return httpsRequest(options, toFirestoreDoc(data));
}

async function main() {
  console.log('Seeding initial CMS pages and settings into Firestore...');
  const token = getAccessToken();

  // 1. Home page
  const home = {
    id: 'home',
    pageKey: 'home',
    route: '/',
    title: { tr: 'KUTEMS – Seksiyonel Kapı Yay Hesaplama & Ürün Kataloğu', en: 'KUTEMS – Sectional Door Spring Calculator & Product Catalog' },
    description: { tr: 'KUTEMS seksiyonel kapı sistemleri için torsiyon yay hesaplama, donanım kataloğu ve otomasyon çözümleri profesyonel platformu.', en: 'Professional platform for sectional door spring calculation, hardware catalog and automation solutions.' },
    published: true,
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: { tr: 'Seksiyonel Kapı Sistemlerinde', en: 'In Sectional Door Systems' },
        subtitle: { tr: 'Mühendislik ve Donanım Çözümleri', en: 'Engineering & Hardware Solutions' },
        content: { tr: 'Torsiyon yay hesaplama motoru, 1.400\'den fazla donanım bileşeni ve modern otomasyon çözümleri ile tüm ihtiyaçlarınız tek platformda.', en: 'Torsion spring calculation engine, over 1,400 hardware components, and modern automation solutions on a single platform.' },
        badge: { tr: 'Profesyonel Kapı Çözümleri', en: 'Professional Door Solutions' },
        buttonText: { tr: 'Yay Hesaplama Motoru', en: 'Spring Calculator Engine' },
        buttonLink: '/calculation',
        visible: true,
        order: 1
      },
      {
        id: 'features',
        type: 'features',
        title: { tr: 'Neden KUTEMS?', en: 'Why KUTEMS?' },
        subtitle: { tr: 'Üstün Mühendislik ve Hızlı Tedarik', en: 'Superior Engineering & Rapid Supply' },
        content: { tr: 'KUTEMS, endüstri standardı kalitede donanım ve hassas hesaplama araçları sunar.', en: 'KUTEMS delivers industry-standard quality hardware and precision calculation tools.' },
        visible: true,
        order: 2
      },
      {
        id: 'cta',
        type: 'cta',
        title: { tr: 'Projeniz için Özel Çözüm mü Arıyorsunuz?', en: 'Looking for a Custom Solution for Your Project?' },
        subtitle: { tr: 'Uzman mühendislik ekibimiz ile iletişime geçin.', en: 'Get in touch with our expert engineering team.' },
        buttonText: { tr: 'Teklif Al / İletişime Geç', en: 'Request a Quote / Contact Us' },
        buttonLink: '#inquiry',
        visible: true,
        order: 3
      }
    ],
    seo: {
      title: { tr: 'KUTEMS – Kapı Donanımı & Otomasyon', en: 'KUTEMS – Door Hardware & Automation' },
      description: { tr: 'Seksiyonel kapı donanımları, yay hesaplama ve otomasyon çözümleri.', en: 'Sectional door hardware, spring calculations, and automation solutions.' }
    },
    updatedAt: new Date().toISOString()
  };

  // 2. Hardware page
  const hardware = {
    id: 'hardware',
    pageKey: 'hardware',
    route: '/hardware',
    title: { tr: 'Donanım Kataloğu', en: 'Hardware Catalog' },
    description: { tr: '1.348\'den fazla yüksek kaliteli seksiyonel kapı donanım bileşeni.', en: 'Over 1,348 high quality sectional door hardware components.' },
    published: true,
    sections: [
      {
        id: 'hero',
        type: 'banner',
        title: { tr: 'Endüstri Standardı Kapı Donanımları', en: 'Industry Standard Door Hardware' },
        content: { tr: 'Makaralar, tamburlar, yaylar, profiller ve güvenlik aksesuarları.', en: 'Rollers, drums, springs, profiles and safety accessories.' },
        visible: true,
        order: 1
      }
    ],
    seo: {
      title: { tr: 'Donanım Kataloğu | KUTEMS', en: 'Hardware Catalog | KUTEMS' },
      description: { tr: 'KUTEMS seksiyonel kapı donanım ürünleri.', en: 'KUTEMS sectional door hardware products.' }
    },
    updatedAt: new Date().toISOString()
  };

  // 3. Automation page
  const automation = {
    id: 'automation',
    pageKey: 'automation',
    route: '/automation',
    title: { tr: 'Otomasyon Sistemleri', en: 'Automation Systems' },
    description: { tr: 'Endüstriyel ve konut tipi seksiyonel kapı motorları ve kontrol üniteleri.', en: 'Industrial and residential sectional door drives and control units.' },
    published: true,
    sections: [
      {
        id: 'hero',
        type: 'banner',
        title: { tr: 'Güvenilir ve Güçlü Otomasyon', en: 'Reliable and Powerful Automation' },
        content: { tr: 'Şaft motorları, kontrol panelleri ve uzaktan kumanda sistemleri.', en: 'Shaft motors, control panels and remote access systems.' },
        visible: true,
        order: 1
      }
    ],
    seo: {
      title: { tr: 'Otomasyon Sistemleri | KUTEMS', en: 'Automation Systems | KUTEMS' },
      description: { tr: 'KUTEMS seksiyonel kapı otomasyon çözümleri.', en: 'KUTEMS sectional door automation solutions.' }
    },
    updatedAt: new Date().toISOString()
  };

  // 4. Global Site Settings
  const settings = {
    id: 'global',
    siteName: 'KUTEMS',
    logoUrl: '/images/logo.png',
    defaultLanguage: 'tr',
    contact: {
      phone: '+90 (212) 555 01 23',
      email: 'info@kutems.com.tr',
      address: 'İkitelli Organize Sanayi Bölgesi, Metal İş Sanayi Sitesi, İstanbul, Türkiye'
    },
    social: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com'
    },
    header: {
      navItems: [
        { key: 'calculation', label: { tr: 'Yay Hesaplama', en: 'Spring Calculation' }, href: '/calculation', visible: true, order: 1 },
        { key: 'hardware', label: { tr: 'Donanım Kataloğu', en: 'Hardware Catalog' }, href: '/hardware', visible: true, order: 2 },
        { key: 'automation', label: { tr: 'Otomasyon', en: 'Automation' }, href: '/automation', visible: true, order: 3 }
      ],
      ctaText: { tr: 'Teklif Al', en: 'Get a Quote' },
      ctaHref: '#inquiry'
    },
    footer: {
      title: { tr: 'KUTEMS Endüstriyel Kapı Sistemleri', en: 'KUTEMS Industrial Door Systems' },
      description: { tr: 'Seksiyonel kapı donanımları, yay hesaplama motoru ve otomasyon teknolojilerinde öncü çözüm ortağınız.', en: 'Your pioneering solution partner in sectional door hardware, spring calculations and automation technologies.' },
      copyright: { tr: '© 2026 KUTEMS. Tüm hakları saklıdır.', en: '© 2026 KUTEMS. All rights reserved.' }
    },
    seo: {
      defaultTitle: { tr: 'KUTEMS – Seksiyonel Kapı Yay Hesaplama & Donanım Kataloğu', en: 'KUTEMS – Sectional Door Spring Calculator & Hardware Catalog' },
      defaultDescription: { tr: 'Torsiyon yay hesaplama, kapı donanım kataloğu ve otomasyon sistemleri.', en: 'Torsion spring calculation, door hardware catalog and automation systems.' }
    },
    updatedAt: new Date().toISOString()
  };

  await writeDoc('site_pages', 'home', home, token);
  console.log('✓ site_pages/home seeded');
  await writeDoc('site_pages', 'hardware', hardware, token);
  console.log('✓ site_pages/hardware seeded');
  await writeDoc('site_pages', 'automation', automation, token);
  console.log('✓ site_pages/automation seeded');
  await writeDoc('site_settings', 'global', settings, token);
  console.log('✓ site_settings/global seeded');

  console.log('CMS seed complete!');
}

main().catch(err => {
  console.error('Error seeding CMS:', err);
  process.exit(1);
});
