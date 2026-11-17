#!/usr/bin/env node
/**
 * scripts/set-admin-claim.js
 * 
 * KUTEMS — Server-side Admin Claim Assignment
 * Uses Firebase REST API + OAuth token to set admin custom claim
 * 
 * Usage:
 *   node scripts/set-admin-claim.js <user-email>
 * 
 * SECURITY: This script must NEVER be exposed publicly.
 * Only run it locally by an authorized developer.
 */

const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PROJECT_ID = 'kutems';

function getAccessToken() {
  const configPath = path.join(os.homedir(), '.config/configstore/firebase-tools.json');
  if (!fs.existsSync(configPath)) {
    console.error('Firebase Tools config not found. Run: npx firebase login');
    process.exit(1);
  }
  const conf = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!conf.tokens?.access_token) {
    console.error('No access token. Run: npx firebase login --reauth');
    process.exit(1);
  }
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

async function getUserByEmail(email, token) {
  const options = {
    hostname: 'identitytoolkit.googleapis.com',
    path: `/v1/projects/${PROJECT_ID}/accounts:lookup`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const result = await httpsRequest(options, { email: [email] });
  if (!result.users || result.users.length === 0) {
    throw new Error(`No user found with email: ${email}`);
  }
  return result.users[0];
}

async function setCustomClaims(uid, claims, token) {
  const options = {
    hostname: 'identitytoolkit.googleapis.com',
    path: `/v1/projects/${PROJECT_ID}/accounts:update`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  return httpsRequest(options, {
    localId: uid,
    customAttributes: JSON.stringify(claims)
  });
}

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/set-admin-claim.js <user-email>');
    process.exit(1);
  }

  console.log(`\n=== KUTEMS Admin Claim Assignment ===`);
  console.log(`Target email: ${email}`);
  console.log(`Project: ${PROJECT_ID}\n`);

  const token = getAccessToken();

  // Look up user
  console.log('Looking up user...');
  const user = await getUserByEmail(email, token);
  console.log(`Found user: uid=${user.localId}, email=${user.email}`);

  // Set admin custom claim (DO NOT add role field — only trusted server claim)
  const claims = { admin: true };
  console.log('Setting admin custom claim:', JSON.stringify(claims));
  await setCustomClaims(user.localId, claims, token);

  console.log('\n✓ Admin custom claim set successfully!');
  console.log(`User ${email} (uid: ${user.localId}) now has: { admin: true }`);
  console.log('\nNote: The user must sign out and sign in again (or wait up to 1 hour) for the new claim to take effect in their ID token.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
