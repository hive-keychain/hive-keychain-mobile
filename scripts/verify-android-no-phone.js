#!/usr/bin/env node
/**
 * Fails if the local AAB still contains Google phone-number / SMS Retriever SDKs.
 */
const {execFileSync} = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const aabPath = path.resolve(
  process.argv[2] || path.join(__dirname, '../builds/keychain.aab'),
);

if (!fs.existsSync(aabPath)) {
  console.error(`AAB not found: ${aabPath}`);
  process.exit(1);
}

const listing = execFileSync('unzip', ['-l', aabPath], {encoding: 'utf8'});
const blockedArtifacts = [
  'play-services-auth-api-phone.properties',
  'play-services-auth.properties',
];
const foundArtifacts = blockedArtifacts.filter((name) => listing.includes(name));

const needles = ['SmsRetriever', 'auth.api.phone', 'getLine1Number'];
const phoneApiHits = [];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'keychain-aab-'));
try {
  execFileSync('unzip', ['-qo', aabPath, 'base/dex/*.dex', '-d', tmp]);
  const dexDir = path.join(tmp, 'base/dex');
  if (fs.existsSync(dexDir)) {
    for (const name of fs.readdirSync(dexDir)) {
      if (!name.endsWith('.dex')) continue;
      const buf = fs.readFileSync(path.join(dexDir, name));
      for (const needle of needles) {
        if (buf.includes(needle) && !phoneApiHits.includes(needle)) {
          phoneApiHits.push(needle);
        }
      }
    }
  }
} finally {
  fs.rmSync(tmp, {recursive: true, force: true});
}

if (foundArtifacts.length || phoneApiHits.length) {
  console.error('Phone-number SDK signals still present in AAB:');
  for (const name of foundArtifacts) {
    console.error(`  artifact: ${name}`);
  }
  for (const name of phoneApiHits) {
    console.error(`  dex: ${name}`);
  }
  process.exit(1);
}

console.log(`OK: no phone-number SDK signals in ${aabPath}`);
