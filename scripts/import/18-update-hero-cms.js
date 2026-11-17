const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const configPath = path.join(os.homedir(), '.config/configstore/firebase-tools.json');
const conf = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const token = conf.tokens.access_token;

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function updateHomeHero() {
  console.log('Fetching current site_pages/home from Firestore...');
  const getOptions = {
    hostname: 'firestore.googleapis.com',
    path: '/v1/projects/kutems/databases/(default)/documents/site_pages/home',
    headers: { Authorization: 'Bearer ' + token }
  };
  const currentDoc = await request(getOptions);
  
  // Clone sections array
  const currentSections = currentDoc.fields?.sections?.arrayValue?.values || [];
  
  // Update only the hero section
  const updatedSections = currentSections.map(secVal => {
    const f = secVal.mapValue.fields;
    if (f.id?.stringValue === 'hero') {
      return {
        mapValue: {
          fields: {
            ...f,
            imageUrl: { stringValue: '/images/kutems-hero-background.jpg' },
            badge: {
              mapValue: {
                fields: {
                  tr: { stringValue: 'Profesyonel Kapı Çözümleri' },
                  en: { stringValue: 'Professional Door Solutions' },
                }
              }
            },
            title: {
              mapValue: {
                fields: {
                  tr: { stringValue: 'Seksiyonel Kapı Sistemlerinde' },
                  en: { stringValue: 'Engineering and Hardware Solutions for' },
                }
              }
            },
            subtitle: {
              mapValue: {
                fields: {
                  tr: { stringValue: 'Mühendislik ve Donanım Çözümleri' },
                  en: { stringValue: 'Sectional Door Systems' },
                }
              }
            },
            content: {
              mapValue: {
                fields: {
                  tr: { stringValue: "Torsiyon yay hesaplama motoru, 1.400'den fazla donanım bileşeni ve modern otomasyon çözümleri ile tüm ihtiyaçlarınız tek platformda." },
                  en: { stringValue: 'With a torsion spring calculation engine, more than 1,400 hardware components and modern automation solutions, everything you need is on one platform.' },
                }
              }
            },
          }
        }
      };
    }
    return secVal;
  });

  const patchBody = {
    fields: {
      ...currentDoc.fields,
      sections: {
        arrayValue: {
          values: updatedSections
        }
      },
      updatedAt: {
        timestampValue: new Date().toISOString()
      }
    }
  };

  console.log('Patching site_pages/home with hero background image and updated translations...');
  const patchOptions = {
    hostname: 'firestore.googleapis.com',
    path: '/v1/projects/kutems/databases/(default)/documents/site_pages/home?updateMask.fieldPaths=sections&updateMask.fieldPaths=updatedAt',
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    }
  };

  const res = await request(patchOptions, patchBody);
  console.log('Successfully updated site_pages/home in Firestore!');
}

updateHomeHero().catch(err => {
  console.error('Error updating hero in Firestore:', err);
  process.exit(1);
});
